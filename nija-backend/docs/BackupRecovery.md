# Backup and Recovery Procedures

This document outlines the comprehensive backup and recovery strategies for the NijaSpec backend to ensure data integrity, availability, and business continuity in the event of system failure, data corruption, or disaster.

## 1. Overview

The goal of these procedures is to minimize data loss and downtime. We define two key metrics for our recovery objectives:
- **Recovery Point Objective (RPO):** The maximum acceptable amount of data loss measured in time (e.g., 24 hours).
- **Recovery Time Objective (RTO):** The maximum acceptable duration of downtime before the system is restored (e.g., 4 hours).

## 2. Backup Strategy

### 2.1 Backup Frequency
| Component | Backup Type | Frequency | Retention Period |
|-----------|-------------|-----------|------------------|
| Database  | Full Dump   | Daily     | 30 Days          |
| Database  | WAL/Logs    | Continuous| 7 Days           |
| Configs   | Snapshot    | On Change | Forever          |
| Artifacts | Sync        | Hourly    | 90 Days          |
| Code       | Commit      | Continuous| Forever (Git)    |

### 2.2 Backup Types
- **Full Backup:** A complete copy of the entire dataset.
- **Incremental Backup:** Only changes made since the last backup.
- **Configuration Backup:** Backups of `.env` files, secrets, and system configurations.

## 3. Database Backups

The NijaSpec backend primarily uses a relational database managed via SQLAlchemy and Alembic.

### 3.1 PostgreSQL (Production)
For production environments running PostgreSQL, use `pg_dump` for logical backups.

**Manual Backup Command:**
```bash
pg_dump -U <username> -h <host> <database_name> > backup_$(date +%Y%m%d).sql
```

**Automated Backup Script:**
A cron job should be configured to run daily:
```bash
0 2 * * * pg_dump -U nija_user nija_db | gzip > /backups/db/nija_db_$(date +\%F).sql.gz
```

### 3.2 SQLite (Development/Testing)
For local development or small-scale deployments using SQLite, the database is a single file.

**Backup Command:**
```bash
cp /path/to/nija_backend/app/nija.db /backups/db/nija_db_$(date +%Y%m%d).db.bak
```

## 4. File and Configuration Backups

### 4.1 Application Code
All source code is version-controlled using Git. The remote repository (e.g., GitHub/GitLab) serves as the primary backup for the codebase.

### 4.2 Environment Variables and Secrets
Since `.env` files are not committed to Git, they must be backed up separately to a secure vault (e.g., AWS Secrets Manager, HashiCorp Vault, or an encrypted backup volume).

**Manual Backup:**
```bash
tar -czf secrets_backup_$(date +%Y%m%d).tar.gz .env
```

### 4.3 Uploaded Files and Artifacts
Any user-uploaded specifications or generated reports should be stored on persistent volumes (e.g., AWS S3, Azure Blob Storage) with versioning enabled.

**S3 Sync Command:**
```bash
aws s3 sync /app/uploads s3://nijaspec-backups/uploads/
```

## 5. Recovery Procedures

### 5.1 Database Restoration

#### PostgreSQL Restore
1. Create a fresh database:
   ```bash
   createdb -U <username> nija_db_new
   ```
2. Restore the dump:
   ```bash
   psql -U <username> -d nija_db_new < backup_YYYYMMDD.sql
   ```
3. Update application connection strings to point to `nija_db_new`.

#### SQLite Restore
1. Stop the application.
2. Replace the current database file with the backup:
   ```bash
   cp /backups/db/nija_db_YYYYMMDD.db.bak /path/to/nija_backend/app/nija.db
   ```
3. Restart the application.

### 5.2 Full System Recovery (Disaster Recovery)
In the event of a total server failure:
1. **Provision Infrastructure:** Spin up a new server/container instance.
2. **Deploy Code:** Clone the latest stable branch from the Git repository.
3. **Restore Config:** Deploy the latest `.env` and secret files from the secure vault.
4. **Restore Data:** Execute the database restoration procedure described in Section 5.1.
5. **Verify:** Run integration tests to ensure the system is functional.

## 6. Testing and Validation

Backups are useless if they cannot be restored. The following validation schedule is mandated:

### 6.1 Validation Schedule
| Test Type | Frequency | Procedure |
|-----------|-----------|------------|
| Backup Verification | Daily | Check backup logs for "Success" status and verify file size > 0. |
| Partial Restore | Monthly | Restore a single table or file to a staging environment. |
| Full DR Drill | Quarterly | Perform a complete system recovery in a sandbox environment. |

### 6.2 Restoration Checklist
- [ ] Database restored and accessible.
- [ ] All migrations applied (`alembic upgrade head`).
- [ ] Environment variables correctly loaded.
- [ ] Application health check endpoint (`/health`) returns 200 OK.
- [ ] Sample data verified across key tables (Users, Organizations, Projects).

## 7. Maintenance and Rotation

To prevent disk exhaustion, a rotation policy is implemented:
- **Daily Backups:** Retained for 30 days.
- **Monthly Backups:** Retained for 1 year.
- **Yearly Backups:** Retained indefinitely.

**Rotation Script (Example):**
```bash
find /backups/db/ -name "*.sql.gz" -mtime +30 -exec rm {} \;
```

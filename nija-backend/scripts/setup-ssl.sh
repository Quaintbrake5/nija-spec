#!/bin/bash
set -e

echo "Generating self-signed SSL certificates..."
mkdir -p certs

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/selfsigned.key \
  -out certs/selfsigned.crt \
  -subj "/C=NG/ST=Lagos/L=Lagos/O=NijaSpec/OU=Engineering/CN=localhost"

echo "Certificates generated in nija-backend/certs/"
ls -l certs/

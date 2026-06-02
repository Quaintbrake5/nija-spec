import { useState } from 'react';
import { User, Building2, Users, LogOut, Trash2, Shield } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Button, Card, Spinner, Alert, EmptyState, Input, Modal, Tag } from '@/components/ui';
import { useAuth } from '@/stores';
import {
  useOrganizations,
  useOrganizationMembers,
  useCreateOrganization,
  useRemoveOrganizationMember,
} from '@/hooks/useOrganizations';
import { ROUTES } from '@/routes/paths';
import './SettingsPage.css';

const ROLE_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  OWNER: 'success',
  MAINTAINER: 'info',
  REVIEWER: 'warning',
  VIEWER: 'neutral',
};

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'organization' | 'members'>('profile');
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');

  const { data: organizations, isLoading: orgsLoading } = useOrganizations();
  const currentOrg = organizations?.[0];
  const { data: members, isLoading: membersLoading } = useOrganizationMembers(currentOrg?.id ?? '');
  const createOrg = useCreateOrganization();
  const removeMember = useRemoveOrganizationMember(currentOrg?.id ?? '');

  const handleCreateOrg = async () => {
    if (!orgName.trim()) return;
    try {
      await createOrg.mutateAsync({ name: orgName.trim() });
      setIsCreateOrgModalOpen(false);
      setOrgName('');
    } catch {
      // Error handled by mutation
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync(userId);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <MainLayout>
      <div className="settings-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Settings' },
          ]}
        />

        <header className="settings-page__header">
          <h1 className="settings-page__title">Settings</h1>
          <p className="settings-page__subtitle">Manage your account and organization</p>
        </header>

        <nav className="settings-page__nav" aria-label="Settings sections">
          <button
            className={`settings-page__nav-btn ${
              activeSection === 'profile' ? 'settings-page__nav-btn--active' : ''
            }`}
            onClick={() => setActiveSection('profile')}
          >
            <User size={16} aria-hidden="true" />
            Profile
          </button>
          <button
            className={`settings-page__nav-btn ${
              activeSection === 'organization' ? 'settings-page__nav-btn--active' : ''
            }`}
            onClick={() => setActiveSection('organization')}
          >
            <Building2 size={16} aria-hidden="true" />
            Organization
          </button>
          <button
            className={`settings-page__nav-btn ${
              activeSection === 'members' ? 'settings-page__nav-btn--active' : ''
            }`}
            onClick={() => setActiveSection('members')}
          >
            <Users size={16} aria-hidden="true" />
            Members
          </button>
        </nav>

        <div className="settings-page__content">
          {activeSection === 'profile' && (
            <section className="settings-page__section" aria-label="User profile">
              <Card>
                <div className="settings-page__profile">
                  <div className="settings-page__avatar">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="settings-page__avatar-img" />
                    ) : (
                      <User size={32} aria-hidden="true" />
                    )}
                  </div>
                  <div className="settings-page__profile-info">
                    <h2 className="settings-page__profile-name">{user?.name ?? 'User'}</h2>
                    <p className="settings-page__profile-email">{user?.email ?? ''}</p>
                    <p className="settings-page__profile-id">
                      ID: <code>{user?.id ?? 'N/A'}</code>
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {activeSection === 'organization' && (
            <section className="settings-page__section" aria-label="Organization">
              {orgsLoading ? (
                <Spinner size="md" label="Loading organizations" />
              ) : currentOrg ? (
                <Card>
                  <div className="settings-page__org">
                    <div className="settings-page__org-header">
                      <h3 className="settings-page__org-name">{currentOrg.name}</h3>
                      <Tag variant={ROLE_VARIANT[currentOrg.role] ?? 'neutral'} size="sm">
                        <Shield size={12} aria-hidden="true" /> {currentOrg.role}
                      </Tag>
                    </div>
                    <p className="settings-page__org-meta">
                      Created {new Date(currentOrg.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="settings-page__org-id">
                      Organization ID: <code>{currentOrg.id}</code>
                    </p>
                  </div>
                </Card>
              ) : (
                <EmptyState
                  title="No organization"
                  description="Create an organization to get started."
                  action={{
                    label: 'Create Organization',
                    onClick: () => setIsCreateOrgModalOpen(true),
                  }}
                  icon={<Building2 size={48} />}
                />
              )}
            </section>
          )}

          {activeSection === 'members' && (
            <section className="settings-page__section" aria-label="Organization members">
              <div className="settings-page__members-header">
                <h3 className="settings-page__section-title">Members</h3>
              </div>
              {membersLoading ? (
                <Spinner size="md" label="Loading members" />
              ) : members && members.length > 0 ? (
                <div className="settings-page__members-list">
                  {members.map((member) => (
                    <div key={member.userId} className="settings-page__member">
                      <div className="settings-page__member-info">
                        <span className="settings-page__member-id">{member.userId}</span>
                        <Tag variant={ROLE_VARIANT[member.role] ?? 'neutral'} size="sm">
                          {member.role}
                        </Tag>
                      </div>
                      <span className="settings-page__member-joined">
                        Joined {new Date(member.joinedAt).toLocaleDateString('en-NG')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => handleRemoveMember(member.userId)}
                        isLoading={removeMember.isPending}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No members"
                  description="No members in this organization yet."
                  icon={<Users size={48} />}
                />
              )}
            </section>
          )}
        </div>

        <div className="settings-page__danger-zone">
          <Card>
            <div className="settings-page__danger">
              <div>
                <h3 className="settings-page__danger-title">Sign Out</h3>
                <p className="settings-page__danger-desc">
                  Sign out of your account on this device.
                </p>
              </div>
              <Button
                variant="danger"
                leftIcon={<LogOut size={16} />}
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        <Modal
          isOpen={isCreateOrgModalOpen}
          onClose={() => setIsCreateOrgModalOpen(false)}
          title="Create Organization"
        >
          <form
            className="settings-page__form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateOrg();
            }}
          >
            <Input
              label="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="My Organization"
              fullWidth
              required
            />
            {createOrg.isError && (
              <Alert variant="danger">{createOrg.error.message}</Alert>
            )}
            <div className="settings-page__form-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOrgModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={createOrg.isPending}
                disabled={!orgName.trim()}
              >
                Create
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;

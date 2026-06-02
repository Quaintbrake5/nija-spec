import { useState, useCallback } from 'react';
import { useAuth, useOrganization } from '@/stores';
import './Topbar.css';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user, logout } = useAuth();
  const { organizations, currentOrganization, setCurrentOrganization } = useOrganization();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);



  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-menu-button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="topbar-breadcrumbs">
          <span className="topbar-app-name">NijaSpec</span>
          {currentOrganization && (
            <>
              <span className="topbar-separator">/</span>
              <span className="topbar-org-name">{currentOrganization.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Organization Selector */}
        {organizations.length > 1 && (
          <div className="topbar-dropdown">
            <button
              className="topbar-dropdown-button"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              aria-expanded={showOrgDropdown ? 'true' : 'false'}
              aria-haspopup="true"
            >
              Switch Org{' '}
              <span className="topbar-dropdown-arrow">▼</span>
            </button>
            {showOrgDropdown && (
              <div className="topbar-dropdown-menu">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    className={`topbar-dropdown-item ${
                      org.id === currentOrganization?.id ? 'topbar-dropdown-item-active' : ''
                    }`}
                    onClick={() => {
                      setCurrentOrganization(org.id);
                      setShowOrgDropdown(false);
                    }}
                  >
                    {org.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Menu */}
        <div className="topbar-dropdown">
          <button
            className="topbar-user-button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            aria-expanded={showUserDropdown ? 'true' : 'false'}
            aria-haspopup="true"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name || "User avatar"} className="topbar-avatar" />
            ) : (
              <span className="topbar-avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
            <span className="topbar-user-name">{user?.name || 'User'}</span>
            <span className="topbar-dropdown-arrow">▼</span>
          </button>
          {showUserDropdown && (
            <div className="topbar-dropdown-menu">
              <div className="topbar-dropdown-header">
                <div className="topbar-user-info">
                  <div className="topbar-user-name">{user?.name}</div>
                  <div className="topbar-user-email">{user?.email}</div>
                </div>
              </div>
              <div className="topbar-dropdown-divider" />
              <button className="topbar-dropdown-item" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
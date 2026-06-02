import { NavLink } from 'react-router-dom';
import { useOrganization } from '@/stores';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { currentOrganization } = useOrganization();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/runs', label: 'Run History', icon: '▶️' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const orgId = currentOrganization?.id;

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
          type="button"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">NijaSpec</h2>
          {currentOrganization && (
            <div className="sidebar-org">
              <span className="sidebar-org-name">{currentOrganization.name}</span>
              <span className="sidebar-org-role">{currentOrganization.role}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={orgId ? `${item.path}/${orgId}` : item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">v{import.meta.env.VITE_APP_VERSION}</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
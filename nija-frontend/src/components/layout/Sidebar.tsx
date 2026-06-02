import { NavLink } from 'react-router-dom';
import { useOrganization } from '@/stores';
import { LayoutDashboard, FolderOpen, PlayCircle, Settings, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/runs', label: 'Run History', icon: PlayCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { currentOrganization } = useOrganization();

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
          <div className="sidebar-brand">
            <ShieldCheck className="sidebar-logo" size={24} />
            <h2 className="sidebar-title">NijaSpec</h2>
          </div>
          {currentOrganization && (
            <div className="sidebar-org">
              <span className="sidebar-org-name">{currentOrganization.name}</span>
              <span className="sidebar-org-role">{currentOrganization.role}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={orgId ? `${item.path}/${orgId}` : item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                onClick={onClose}
              >
                <Icon className="sidebar-icon" size={20} />
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">v{import.meta.env.VITE_APP_VERSION}</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

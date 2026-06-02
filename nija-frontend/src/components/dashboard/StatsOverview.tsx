import { FolderOpen, FileText, PlayCircle, CheckCircle, DollarSign } from 'lucide-react';
import './StatsOverview.css';

export interface DashboardStats {
  totalProjects: number;
  totalSpecs: number;
  totalRuns: number;
  passingRate: number;
  totalCostNaira: number;
}

export interface StatsOverviewProps {
  stats: DashboardStats;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  valueVariant?: 'default' | 'success' | 'info';
  ariaLabel: string;
}

const StatCard = ({ label, value, icon, valueVariant = 'default', ariaLabel }: StatCardProps) => (
  <div className="stats-overview__card" role="group" aria-label={ariaLabel}>
    <div className="stats-overview__card-header">
      <span className="stats-overview__card-label">{label}</span>
      <span className="stats-overview__card-icon" aria-hidden="true">{icon}</span>
    </div>
    <p className={`stats-overview__card-value ${valueVariant !== 'default' ? `stats-overview__card-value--${valueVariant}` : ''}`}>
      {value}
    </p>
  </div>
);

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="stats-overview" role="region" aria-label="Dashboard statistics">
      <StatCard
        label="Projects"
        value={stats.totalProjects}
        icon={<FolderOpen size={20} />}
        ariaLabel={`Total projects: ${stats.totalProjects}`}
      />
      <StatCard
        label="Specifications"
        value={stats.totalSpecs}
        icon={<FileText size={20} />}
        ariaLabel={`Total specifications: ${stats.totalSpecs}`}
      />
      <StatCard
        label="Total Runs"
        value={stats.totalRuns}
        icon={<PlayCircle size={20} />}
        ariaLabel={`Total runs: ${stats.totalRuns}`}
      />
      <StatCard
        label="Passing Rate"
        value={`${stats.passingRate.toFixed(1)}%`}
        icon={<CheckCircle size={20} />}
        valueVariant={stats.passingRate >= 80 ? 'success' : 'info'}
        ariaLabel={`Passing rate: ${stats.passingRate.toFixed(1)} percent`}
      />
      <StatCard
        label="Total Cost"
        value={`₦${stats.totalCostNaira.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={<DollarSign size={20} />}
        ariaLabel={`Total cost: ${stats.totalCostNaira} Naira`}
      />
    </div>
  );
};

export default StatsOverview;

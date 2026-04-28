function StatCard({ stats }) {
  const { icon, title, statistics } = stats;

  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value">
        <strong>{statistics.value}</strong>
        {statistics.unit && <span> {statistics.unit}</span>}
      </div>
    </div>
  );
}

export default StatCard;
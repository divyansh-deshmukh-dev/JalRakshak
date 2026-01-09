import RealTimeMetrics from './real-time-metrics';
import HeatmapView from './heatmap-view';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <RealTimeMetrics />
      <HeatmapView />
    </div>
  );
}

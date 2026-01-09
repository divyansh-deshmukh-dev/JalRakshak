import WaterQualityCard from './water-quality-card';
import WardStatusList from './ward-status-list';
import MapCard from './map-card';
import CitizenReportForm from './citizen-report-form';

export default function PublicDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        <WaterQualityCard />
        <MapCard />
      </div>
      <div className="space-y-6 lg:space-y-8">
        <WardStatusList />
        <CitizenReportForm />
      </div>
    </div>
  );
}

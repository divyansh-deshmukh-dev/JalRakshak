import SafetyOverview from './safety-overview';
import WardMap from './ward-map';
import CitizenReportSection from './citizen-report-section';

export default function PublicDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-3">
        <SafetyOverview />
      </div>
      <div className="lg:col-span-2">
        <WardMap />
      </div>
      <div>
        <CitizenReportSection />
      </div>
    </div>
  );
}

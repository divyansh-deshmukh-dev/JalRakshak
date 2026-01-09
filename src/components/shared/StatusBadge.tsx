import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: { [key: string]: string } = {
  // Water Quality
  Safe: "bg-green-100 text-green-800 border-green-200",
  Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Unsafe: "bg-red-100 text-red-800 border-red-200",
  // Alerts
  New: "bg-blue-100 text-blue-800 border-blue-200",
  Acknowledged: "bg-purple-100 text-purple-800 border-purple-200",
  Resolved: "bg-gray-100 text-gray-800 border-gray-200",
  // Citizen Reports
  Pending: "bg-orange-100 text-orange-800 border-orange-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
  // Infrastructure
  Operational: "bg-green-100 text-green-800 border-green-200",
  Maintenance: "bg-blue-100 text-blue-800 border-blue-200",
  Risk: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-semibold", statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200")}>
      {status}
    </Badge>
  );
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: { [key: string]: string } = {
  // Water Quality
  Safe: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  Unsafe: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  // Alerts
  New: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Acknowledged: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  Resolved: "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-200",
  // Citizen Reports
  Pending: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
  Approved: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Rejected: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  // Infrastructure
  Operational: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Maintenance: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Risk: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-semibold", statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200")}>
      {status}
    </Badge>
  );
}

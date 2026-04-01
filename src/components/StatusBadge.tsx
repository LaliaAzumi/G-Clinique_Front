interface StatusBadgeProps {
  status: "confirmed" | "pending" | "cancelled" | "completed" | "active" | "inactive";
  text?: string;
}

const StatusBadge = ({ status, text }: StatusBadgeProps) => {
  const statusConfig = {
    confirmed: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      label: "Confirmé",
    },
    completed: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      label: "Complété",
    },
    pending: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      label: "En attente",
    },
    cancelled: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      label: "Annulé",
    },
    active: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      label: "Actif",
    },
    inactive: {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      label: "Inactif",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {text || config.label}
    </span>
  );
};

export default StatusBadge;

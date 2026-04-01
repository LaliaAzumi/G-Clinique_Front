import { Edit, Trash2 } from "lucide-react";

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const TableActions = ({ onEdit, onDelete, onView }: TableActionsProps) => {
  return (
    <div className="flex justify-center gap-3">
      {onView && (
        <button
          onClick={onView}
          className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
          title="Voir"
        >
          <Edit size={16} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 hover:bg-white/10 rounded-lg text-primary transition-colors"
          title="Modifier"
        >
          <Edit size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default TableActions;

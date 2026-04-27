import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, Edit, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface ActionsDropdownProps {
  onView?: () => void;
  onEdit: () => void;
  onInactivate: () => void;
  inactivateLabel?: string;
  customActions?: CustomAction[];
}

export function ActionsDropdown({
  onView,
  onEdit,
  onInactivate,
  inactivateLabel = "Inativar",
  customActions,
}: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Opções <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        {customActions?.map((action, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={action.onClick}
            className={action.className}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={onInactivate}
          className={cn("text-destructive focus:text-destructive")}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {inactivateLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

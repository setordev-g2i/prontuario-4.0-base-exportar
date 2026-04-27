import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export interface ViewField {
  label: string;
  value: React.ReactNode;
}

export interface ViewModalTab {
  id: string;
  label: string;
  fields: ViewField[];
}

interface ViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  tabs?: ViewModalTab[];
  fields?: ViewField[];
  className?: string;
}

function FieldsGrid({ fields }: { fields: ViewField[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
      {fields.map((f, i) => (
        <div key={i} className="space-y-0.5">
          <div className="text-xs font-medium text-muted-foreground">
            {f.label}
          </div>
          <div className="text-sm break-words">
            {f.value === undefined || f.value === null || f.value === ""
              ? "—"
              : f.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ViewModal({
  open,
  onOpenChange,
  title,
  tabs,
  fields,
  className = "max-w-4xl max-h-[90vh] overflow-y-auto",
}: ViewModalProps) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {tabs ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto">
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((t) => (
              <TabsContent key={t.id} value={t.id} className="mt-4">
                <FieldsGrid fields={t.fields} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          fields && <FieldsGrid fields={fields} />
        )}
      </DialogContent>
    </Dialog>
  );
}

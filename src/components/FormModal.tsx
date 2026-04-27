import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export interface FormModalTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  tabs?: FormModalTab[];
  defaultTab?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  tabs,
  defaultTab,
  footer,
  className = "max-w-5xl max-h-[92vh] overflow-y-auto",
}: FormModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs?.[0]?.id ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
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
                {t.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div>{children}</div>
        )}

        {footer && <div className="flex justify-end gap-2 pt-4 border-t">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}

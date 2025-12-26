import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="bridal-card p-12 text-center space-y-4">
      {icon && (
        <div className="flex justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-serif text-bridal-charcoal">{title}</h3>
      {description && (
        <p className="text-bridal-charcoal/70">{description}</p>
      )}
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
}

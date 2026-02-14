import type { QuickAction } from "../types/content";

interface QuickActionsProps {
  actions: QuickAction[];
}

function iconFor(action: QuickAction) {
  if (action.icon === "phone") return "📞";
  if (action.icon === "whatsapp") return "💬";
  if (action.icon === "mail") return "✉";
  return "•";
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="quick-actions" aria-label="Quick actions">
      {actions.map((action) => (
        <a key={action.id} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          <span className="quick-action-icon" aria-hidden="true">
            {iconFor(action)}
          </span>
          <span>{action.label}</span>
        </a>
      ))}
    </div>
  );
}

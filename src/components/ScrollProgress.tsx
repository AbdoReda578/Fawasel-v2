interface ScrollProgressProps {
  items: Array<{ id: string; label: string }>;
  activeId: string;
}

export function ScrollProgress({ items, activeId }: ScrollProgressProps) {
  return (
    <nav className="scroll-progress" aria-label="Section progress">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={item.id === activeId ? "active" : ""}>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

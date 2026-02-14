import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickActions } from "./QuickActions";

describe("QuickActions", () => {
  it("renders links for call, WhatsApp, and email", () => {
    render(
      <QuickActions
        actions={[
          { id: "call", label: "Call", href: "tel:111", icon: "phone" },
          { id: "wa", label: "WhatsApp", href: "https://wa.me/123", icon: "whatsapp" },
          { id: "mail", label: "Email", href: "mailto:test@example.com", icon: "mail" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: /Call/i })).toHaveAttribute("href", "tel:111");
    expect(screen.getByRole("link", { name: /WhatsApp/i })).toHaveAttribute("href", "https://wa.me/123");
    expect(screen.getByRole("link", { name: /Email/i })).toHaveAttribute("href", "mailto:test@example.com");
  });
});

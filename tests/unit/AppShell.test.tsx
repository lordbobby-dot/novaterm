import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { AppShell } from "../../src/app/AppShell";
import { useLayoutStore } from "../../src/core/store/layoutStore";
import React from "react";

describe("AppShell Component", () => {
  beforeEach(() => {
    useLayoutStore.setState({ sidebarOpen: true, bottomPanelOpen: true, theme: "light" });
  });

  it("renders the top toolbar and titles", () => {
    render(<AppShell />);
    expect(screen.getByText("NovaTerm")).toBeInTheDocument();
  });

  it("toggles the sidebar when button is clicked", () => {
    render(<AppShell />);
    expect(screen.getByText("Explorer")).toBeInTheDocument();
    
    const toggleBtn = screen.getByLabelText("Toggle Sidebar (Cmd+B)");
    fireEvent.click(toggleBtn);
    
    expect(screen.queryByText("Explorer")).not.toBeInTheDocument();
  });

  it("toggles the bottom panel when button is clicked", () => {
    render(<AppShell />);
    expect(screen.getByText("Logs, Output, or Context")).toBeInTheDocument();
    
    const toggleBtn = screen.getByLabelText("Toggle Bottom Panel (Cmd+J)");
    fireEvent.click(toggleBtn);
    
    expect(screen.queryByText("Logs, Output, or Context")).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { SessionPermissions } from "../../src/sessions/permissions/SessionPermissions";
import { SessionLifecycle } from "../../src/sessions/lifecycle/SessionLifecycle";
import { SessionState } from "../../src/sessions/lifecycle/types";
import { SessionRegistry } from "../../src/sessions/registry/SessionRegistry";

describe("Session Permissions", () => {
  it("grants and checks capabilities properly", () => {
    const permissions = new SessionPermissions();
    permissions.grant("network");
    permissions.grant("filesystem");
    permissions.deny("network");

    expect(permissions.has("filesystem")).toBe(true);
    expect(permissions.has("network")).toBe(false); // Deny overrides grant
    expect(permissions.has("pty")).toBe(false);
  });
});

describe("Session Lifecycle", () => {
  it("transitions states", () => {
    const lifecycle = new SessionLifecycle();
    expect(lifecycle.state).toBe(SessionState.CREATED);
    
    lifecycle.transition(SessionState.RUNNING);
    expect(lifecycle.state).toBe(SessionState.RUNNING);
  });

  it("prevents transition from disposed", () => {
    const lifecycle = new SessionLifecycle();
    lifecycle.transition(SessionState.DISPOSED);
    expect(lifecycle.canTransition(SessionState.RUNNING)).toBe(false);
    expect(() => lifecycle.transition(SessionState.RUNNING)).toThrow();
  });
});

describe("Session Registry", () => {
  it("registers and tracks statistics", () => {
    const registry = new SessionRegistry();
    const mockSession = { 
      id: "s-1", 
      type: "terminal", 
      lifecycle: { state: SessionState.CREATED } as any, 
      context: { workspaceId: "w-1" } as any 
    } as any;
    
    registry.register(mockSession);
    expect(registry.find("s-1")).toBe(mockSession);
    expect(registry.findByType("terminal").length).toBe(1);
    expect(registry.findByWorkspace("w-1").length).toBe(1);
  });
});

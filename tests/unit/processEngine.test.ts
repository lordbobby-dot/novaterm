import { describe, it, expect } from "vitest";
import { ProcessLifecycle } from "../../src/processes/lifecycle/ProcessLifecycle";
import { ProcessState } from "../../src/processes/lifecycle/types";
import { ProcessRegistry } from "../../src/processes/registry/ProcessRegistry";

describe("Process Lifecycle", () => {
  it("starts in CREATED state", () => {
    const lifecycle = new ProcessLifecycle();
    expect(lifecycle.state).toBe(ProcessState.CREATED);
  });

  it("transitions states", () => {
    const lifecycle = new ProcessLifecycle();
    lifecycle.transition(ProcessState.QUEUED);
    expect(lifecycle.state).toBe(ProcessState.QUEUED);
  });

  it("prevents transition from disposed", () => {
    const lifecycle = new ProcessLifecycle();
    lifecycle.transition(ProcessState.DISPOSED);
    expect(lifecycle.canTransition(ProcessState.RUNNING)).toBe(false);
    expect(() => lifecycle.transition(ProcessState.RUNNING)).toThrow();
  });
});

describe("Process Registry", () => {
  it("registers and tracks processes", () => {
    const registry = new ProcessRegistry();
    const mockProcess = { 
      id: "p-1", 
      type: "terminal", 
      lifecycle: { state: ProcessState.RUNNING } as any, 
      context: { sessionId: "s-1" } as any 
    } as any;
    
    registry.register(mockProcess);
    expect(registry.find("p-1")).toBe(mockProcess);
    expect(registry.findByType("terminal").length).toBe(1);
    expect(registry.findBySession("s-1").length).toBe(1);
    expect(registry.getAll().length).toBe(1);
  });
});

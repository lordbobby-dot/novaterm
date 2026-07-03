import { describe, it, expect, vi } from "vitest";
import { EventBus } from "../../src/core/events/EventBus";
import { CommandRegistry } from "../../src/core/commands/CommandRegistry";
import { SettingsManager } from "../../src/core/settings/SettingsManager";

describe("Event Bus", () => {
  it("publishes and subscribes to events", () => {
    const bus = new EventBus();
    const mockCallback = vi.fn();
    
    bus.subscribe("workspace:closed", mockCallback);
    bus.publish("workspace:closed", undefined);
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("unsubscribes correctly", () => {
    const bus = new EventBus();
    const mockCallback = vi.fn();
    
    const unsubscribe = bus.subscribe("workspace:closed", mockCallback);
    unsubscribe();
    bus.publish("workspace:closed", undefined);
    
    expect(mockCallback).not.toHaveBeenCalled();
  });
});

describe("Command Registry", () => {
  it("registers and executes commands", async () => {
    const registry = new CommandRegistry();
    const executeFn = vi.fn();
    
    registry.register({
      id: "test.cmd",
      title: "Test Command",
      execute: executeFn
    });
    
    await registry.execute("test.cmd", "arg1");
    expect(executeFn).toHaveBeenCalledWith("arg1");
  });

  it("handles undo stack", async () => {
    const registry = new CommandRegistry();
    const undoFn = vi.fn();
    
    registry.register({
      id: "test.undo",
      title: "Test Undo",
      execute: () => {},
      undo: undoFn
    });
    
    await registry.execute("test.undo");
    await registry.undo();
    expect(undoFn).toHaveBeenCalled();
  });
});

describe("Settings Manager", () => {
  it("loads and saves settings with validation", async () => {
    const bus = new EventBus();
    const manager = new SettingsManager(bus);
    
    await manager.save({ theme: "dark" });
    const settings = await manager.load();
    expect(settings.theme).toBe("dark");
  });
});

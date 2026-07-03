import { describe, it, expect } from "vitest";
import { ApplicationRuntime } from "../../src/runtime/core/ApplicationRuntime";
import { LifecycleState } from "../../src/runtime/lifecycle/types";
import { DependencyContainer } from "../../src/runtime/di/DependencyContainer";

describe("Dependency Container", () => {
  it("registers and resolves instances", () => {
    const di = new DependencyContainer();
    di.register("MyService", { test: true });
    expect(di.resolve("MyService")).toEqual({ test: true });
  });

  it("handles factories and singletons", () => {
    const di = new DependencyContainer();
    let count = 0;
    di.factory("Factory", () => ++count);
    di.singleton("Singleton", () => ++count);
    
    expect(di.resolve("Factory")).toBe(1);
    expect(di.resolve("Factory")).toBe(2);
    
    expect(di.resolve("Singleton")).toBe(3);
    expect(di.resolve("Singleton")).toBe(3);
  });
});

describe("Application Runtime", () => {
  it("runs full lifecycle properly", async () => {
    const runtime = new ApplicationRuntime();
    expect(runtime.status()).toBe(LifecycleState.STARTING);
    
    await runtime.initialize();
    expect(runtime.status()).toBe(LifecycleState.STARTING);
    
    await runtime.boot();
    expect(runtime.status()).toBe(LifecycleState.READY);
    
    await runtime.shutdown();
    expect(runtime.status()).toBe(LifecycleState.SHUTTING_DOWN);
  });
});

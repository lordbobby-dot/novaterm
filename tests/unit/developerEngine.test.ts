import { describe, it, expect, vi } from "vitest";
import { CapabilityEngine } from "../../src/developer/capabilities/CapabilityEngine";
import { DetectionRegistry } from "../../src/developer/registry/DetectionRegistry";
import { WorkspaceCache } from "../../src/developer/cache/WorkspaceCache";

describe("Capability Engine", () => {
  it("tracks capabilities correctly", () => {
    const engine = new CapabilityEngine();
    engine.updateCapabilities("project-1", { flags: ["docker", "git"] });
    
    expect(engine.supportsDocker("project-1")).toBe(true);
    expect(engine.supportsGit("project-1")).toBe(true);
    expect(engine.supportsNode("project-1")).toBe(false);
  });
});

describe("Detection Registry", () => {
  it("sorts analyzers by priority", () => {
    const registry = new DetectionRegistry();
    
    registry.register({ metadata: { id: "low", name: "Low", priority: 10, dependencies: [], providesCapabilities: [] }, analyze: async () => ({}) });
    registry.register({ metadata: { id: "high", name: "High", priority: 100, dependencies: [], providesCapabilities: [] }, analyze: async () => ({}) });
    
    const sorted = registry.getSortedAnalyzers();
    expect(sorted[0].metadata.id).toBe("high");
    expect(sorted[1].metadata.id).toBe("low");
  });
});

describe("Workspace Cache", () => {
  it("respects TTL", async () => {
    const cache = new WorkspaceCache();
    await cache.set("test-key", "test-data", 100);
    
    let data = await cache.get("test-key");
    expect(data).toBe("test-data");
    
    await new Promise(r => setTimeout(r, 150));
    data = await cache.get("test-key");
    expect(data).toBeNull();
  });
});

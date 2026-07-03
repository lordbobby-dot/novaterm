import { describe, it, expect, vi } from "vitest";
import { TerminalAdapter } from "../../src/terminal/adapter/TerminalAdapter";
import { IRenderer } from "../../src/terminal/render/RenderModel";

describe("Terminal Adapter", () => {
  it("attaches and detaches renderer", () => {
    const adapter = new TerminalAdapter("test-1");
    const renderer: IRenderer = {
      writeText: vi.fn(),
      updateCursor: vi.fn(),
      updateScroll: vi.fn(),
      updateTitle: vi.fn(),
      ringBell: vi.fn(),
      requestClipboard: vi.fn(),
      resize: vi.fn(),
      clear: vi.fn(),
    };

    adapter.attach(renderer);
    adapter.receiveStreamData(new TextEncoder().encode("hello"));
    
    expect(renderer.writeText).toHaveBeenCalledWith("hello");

    adapter.detach();
    adapter.receiveStreamData(new TextEncoder().encode("world"));
    
    // Should not be called again after detach
    expect(renderer.writeText).toHaveBeenCalledTimes(1);
  });

  it("handles state updates correctly", () => {
    const adapter = new TerminalAdapter("test-2");
    const renderer = { resize: vi.fn() } as any;
    
    adapter.attach(renderer);
    adapter.resize({ rows: 50, cols: 100 });
    
    expect(renderer.resize).toHaveBeenCalledWith({ rows: 50, cols: 100 });
  });

  it("routes input to stream consumer", () => {
    const adapter = new TerminalAdapter("test-3");
    let output: Uint8Array | null = null;
    
    adapter.connect((data) => { output = data; });
    adapter.sendInput("ls");
    
    expect(output).toBeDefined();
    expect(new TextDecoder().decode(output!)).toBe("ls");
  });
});

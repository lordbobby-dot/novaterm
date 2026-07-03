import { describe, it, expect, vi, beforeEach } from "vitest";
import { TerminalView } from "../../src/components/terminal/TerminalView";
import { TerminalAdapter } from "../../src/terminal/adapter/TerminalAdapter";
import { XtermRenderer } from "../../src/terminal/render/XtermRenderer";
import React from 'react';
import { render } from '@testing-library/react';

// Mock ResizeObserver for JSDOM
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock xterm since it requires a real DOM layout engine usually
vi.mock('@xterm/xterm', () => ({
  Terminal: vi.fn().mockImplementation(() => ({
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: vi.fn(),
    onData: vi.fn(),
    onResize: vi.fn(),
    resize: vi.fn(),
    clear: vi.fn(),
    dispose: vi.fn(),
    scrollToRow: vi.fn()
  }))
}));

describe("XtermRenderer", () => {
  it("initializes without throwing", () => {
    const container = document.createElement("div");
    const renderer = new XtermRenderer(container);
    expect(renderer).toBeDefined();
  });
});

describe("TerminalView Component", () => {
  it("mounts and attaches to adapter", () => {
    const adapter = new TerminalAdapter("test-adapter");
    const attachSpy = vi.spyOn(adapter, "attach");
    const detachSpy = vi.spyOn(adapter, "detach");
    
    const { unmount } = render(React.createElement(TerminalView, { adapter }));
    
    expect(attachSpy).toHaveBeenCalled();
    unmount();
    expect(detachSpy).toHaveBeenCalled();
  });
});

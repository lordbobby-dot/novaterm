import { describe, it, expect, vi } from "vitest";
import { StreamManager } from "../../src/streams/manager/StreamManager";
import { StreamBuffer } from "../../src/streams/buffer/StreamBuffer";
import { BackpressureEngine } from "../../src/streams/backpressure/BackpressureEngine";

describe("Stream Buffer", () => {
  it("appends and flushes correctly", () => {
    const buffer = new StreamBuffer(1024);
    const success = buffer.append(new Uint8Array([1, 2, 3]));
    
    expect(success).toBe(true);
    expect(buffer.getSize()).toBe(3);
    
    const chunks = buffer.flush();
    expect(chunks.length).toBe(1);
    expect(buffer.getSize()).toBe(0);
  });

  it("respects max size", () => {
    const buffer = new StreamBuffer(2);
    expect(buffer.append(new Uint8Array([1, 2]))).toBe(true);
    expect(buffer.append(new Uint8Array([3]))).toBe(false);
  });
});

describe("Backpressure Engine", () => {
  it("triggers pause and resume", () => {
    const onPause = vi.fn();
    const onResume = vi.fn();
    const engine = new BackpressureEngine(100, 50, onPause, onResume);
    
    engine.check(80);
    expect(onPause).not.toHaveBeenCalled();
    
    engine.check(110);
    expect(onPause).toHaveBeenCalledTimes(1);
    
    engine.check(60);
    expect(onResume).not.toHaveBeenCalled();
    
    engine.check(40);
    expect(onResume).toHaveBeenCalledTimes(1);
  });
});

describe("Stream Manager", () => {
  it("manages pipelines and routes chunks", () => {
    const manager = new StreamManager();
    const pipeline = manager.createStream("pty-1", "session-1");
    
    let received = 0;
    const consumer = (data: Uint8Array) => received += data.length;
    
    manager.attach("pty-1", consumer);
    manager.handleChunk("pty-1", new Uint8Array([10, 20]));
    
    expect(received).toBe(2);
    expect(manager.lookup("pty-1")).toBeDefined();
    
    manager.close("pty-1");
    expect(manager.lookup("pty-1")).toBeUndefined();
  });
});

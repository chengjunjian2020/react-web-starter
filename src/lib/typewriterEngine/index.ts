export enum TypewriterState {
  Idle = "idle",
  Running = "running",
  Paused = "paused",
  Stopped = "stopped",
  Done = "done",
}

const allowedTransitions: Record<TypewriterState, ReadonlySet<TypewriterState>> = {
  [TypewriterState.Idle]: new Set([
    TypewriterState.Running,
    TypewriterState.Stopped,
    TypewriterState.Done,
    TypewriterState.Idle,
  ]),
  [TypewriterState.Running]: new Set([
    TypewriterState.Paused,
    TypewriterState.Stopped,
    TypewriterState.Done,
    TypewriterState.Idle,
  ]),
  [TypewriterState.Paused]: new Set([
    TypewriterState.Running,
    TypewriterState.Stopped,
    TypewriterState.Done,
    TypewriterState.Idle,
  ]),
  [TypewriterState.Stopped]: new Set([TypewriterState.Stopped, TypewriterState.Idle, TypewriterState.Done]),
  [TypewriterState.Done]: new Set([
    TypewriterState.Running,
    TypewriterState.Stopped,
    TypewriterState.Done,
    TypewriterState.Idle,
  ]),
};

type TypewriterOptions = {
  /** 每秒基础输出字符数（会动态换算成每帧输出量） */
  cps?: number; // chars per second
  /** 每帧最大输出字符数，防止一次吐太多导致 UI 抖动 */
  maxChunkPerFrame?: number;
  /** 遇到换行/标题等结构符号时加速倍率 */
  structureBoost?: number;
  /** 输出回调：把增量 append 到展示层 */
  onOutput: (delta: string) => void;
  /** 引擎状态变化 */
  onStateChange?: (s: TypewriterState) => void;
};

export class TypewriterEngine {
  private queue = "";
  private rafId: number | null = null;
  private lastTs = 0;

  private state: TypewriterState = TypewriterState.Idle;

  private cps: number;
  private maxChunkPerFrame: number;
  private structureBoost: number;

  private onOutput: (delta: string) => void;
  private onStateChange?: TypewriterOptions["onStateChange"];

  constructor(opts: TypewriterOptions) {
    this.cps = opts.cps ?? 60;
    this.maxChunkPerFrame = opts.maxChunkPerFrame ?? 24;
    this.structureBoost = opts.structureBoost ?? 2.5;
    this.onOutput = opts.onOutput;
    this.onStateChange = opts.onStateChange;
  }

  /** 推入后端新增文本（流式） */
  push(text: string) {
    if (!text) return;
    this.queue += text;
    // 如果处于 idle/done，自动拉起
    if (this.state === TypewriterState.Idle || this.state === TypewriterState.Done) this.start();
  }

  /** 开始/继续 */
  start() {
    if (this.state === TypewriterState.Running) return;
    if (this.state === TypewriterState.Stopped) return; // 停止后需要 reset 再 start
    this.setState(TypewriterState.Running);
    this.lastTs = performance.now();
    this.loop(this.lastTs);
  }

  pause() {
    if (this.state !== TypewriterState.Running) return;
    this.setState(TypewriterState.Paused);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  resume() {
    if (this.state !== TypewriterState.Paused) return;
    this.start();
  }

  /** 立即刷完队列 */
  flush() {
    if (!this.queue) return;
    const all = this.queue;
    this.queue = "";
    this.onOutput(all);
    this.setState(TypewriterState.Done);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** 停止（不再输出） */
  stop() {
    this.setState(TypewriterState.Stopped);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** 清空并回到初始态 */
  reset() {
    this.queue = "";
    this.setState(TypewriterState.Idle);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** 动态调速 */
  setSpeed(cps: number) {
    this.cps = Math.max(1, cps);
  }

  private loop = (ts: number) => {
    if (this.state !== TypewriterState.Running) return;

    const dt = ts - this.lastTs;
    this.lastTs = ts;

    if (!this.queue) {
      this.setState(TypewriterState.Done);
      this.rafId = null;
      return;
    }

    // 计算本帧理论可输出字符数
    let budget = Math.floor((this.cps * dt) / 1000);
    if (budget <= 0) budget = 1;

    // 结构化加速：遇到换行/标题符号，适当多吐一些
    const head = this.queue.slice(0, Math.min(this.queue.length, 64));
    const structural = head.startsWith("\n") || head.startsWith("#") || head.startsWith("-") || head.startsWith("##");
    if (structural) budget = Math.floor(budget * this.structureBoost);

    budget = Math.min(budget, this.maxChunkPerFrame, this.queue.length);

    // 输出 chunk（避免逐字 setState）
    const chunk = this.queue.slice(0, budget);
    this.queue = this.queue.slice(budget);
    this.onOutput(chunk);

    this.rafId = requestAnimationFrame(this.loop);
  };

  private setState(s: TypewriterState) {
    if (this.state === s) return;
    if (!allowedTransitions[this.state]?.has(s)) return;
    this.state = s;
    this.onStateChange?.(s);
  }
}

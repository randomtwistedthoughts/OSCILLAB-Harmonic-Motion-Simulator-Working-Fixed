import { DEFAULT_AMPLITUDE, DEFAULT_ANGULAR_FREQUENCY, DEFAULT_PHASE, DEFAULT_DURATION } from "./constants.js";
import { calculateMotion }
    from "./physicsEngine.js";

export class SimulationEngine {
    constructor(onUpdate = () => {}, onStateChange = () => {}) {
        this.A = DEFAULT_AMPLITUDE;
        this.omega = DEFAULT_ANGULAR_FREQUENCY;
        this.phi = DEFAULT_PHASE;
        this.duration = DEFAULT_DURATION;

        this.time = 0;
        this.running = false;
        this.lastTimestamp = null;
        this.animationFrameId = null;

        this.onUpdate = onUpdate;
        this.onStateChange = onStateChange;
    }

    setParameters({ A, omega, phi, duration }) {
        this.pause();
        this.A = Number(A);
        this.omega = Number(omega);
        this.phi = Number(phi);
        this.duration = Number(duration);
        this.time = 0;
        this.lastTimestamp = null;
        this.update();
        this.onStateChange("ready");
    }

    play() {
        if (this.running) return;

        if (this.time >= this.duration) {
            this.time = 0;
            this.update();
        }

        this.running = true;
        this.lastTimestamp = null;
        this.onStateChange("running");
        this.animationFrameId = requestAnimationFrame((ts) => this.tick(ts));
    }

    pause() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.running = false;
        this.lastTimestamp = null;
        this.onStateChange("paused");
    }

    reset() {
        this.pause();
        this.time = 0;
        this.update();
        this.onStateChange("ready");
    }

    tick(timestamp) {
        if (!this.running) return;

        if (this.lastTimestamp === null) {
            this.lastTimestamp = timestamp;
        }

        const dt = Math.max(0, (timestamp - this.lastTimestamp) / 1000);
        this.lastTimestamp = timestamp;
        this.time += dt;

        if (this.time >= this.duration) {
            this.time = this.duration;
            this.update();
            this.running = false;
            this.lastTimestamp = null;
            this.animationFrameId = null;
            this.onStateChange("finished");
            return;
        }

        this.update();
        this.animationFrameId = requestAnimationFrame((ts) => this.tick(ts));
    }

    update() {
        const omega = this.omega;
        const phase = omega * this.time + this.phi;
        const x = this.A * Math.cos(phase);
        const v = -this.A * omega * Math.sin(phase);
        const a = -this.A * omega * omega * Math.cos(phase);

        this.onUpdate({
            time: this.time,
            x,
            v,
            a,
            A: this.A,
            omega: this.omega,
            phi: this.phi,
            duration: this.duration
        });
    }
}

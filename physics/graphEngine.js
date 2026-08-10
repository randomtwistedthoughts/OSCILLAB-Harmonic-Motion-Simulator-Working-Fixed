export class GraphEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.maxPoints = 5000;
        this.timeData = [];
        this.bands = [
            { key: "x", label: "x(t)", unit: "cm", data: [] },
            { key: "v", label: "v(t)", unit: "cm/s", data: [] },
            { key: "a", label: "a(t)", unit: "cm/s²", data: [] }
        ];
    }

    initialize(canvas) {
        this.canvas = canvas;
        if (!canvas) {
            console.error("GraphEngine: canvas not found.");
            return false;
        }
        this.ctx = canvas.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.clear();
        return true;
    }

    resize() {
        if (!this.canvas) return;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.cssWidth = width;
        this.cssHeight = height;
        this.draw();
    }

    clear() {
        this.timeData = [];
        this.bands.forEach(b => b.data = []);
        this.draw();
    }

    addPoint(sample) {
        if (!Number.isFinite(sample.time)) return;
        // Never append a time that goes backwards; this prevents T -> 0 jumps.
        if (this.timeData.length && sample.time < this.timeData[this.timeData.length - 1]) {
            this.clear();
        }

        this.timeData.push(sample.time);
        this.bands.forEach(b => {
            const value = Number(sample[b.key]);
            b.data.push(Number.isFinite(value) ? value : 0);
        });

        if (this.timeData.length > this.maxPoints) {
            this.timeData.shift();
            this.bands.forEach(b => b.data.shift());
        }
        this.draw();
    }

    draw() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const W = this.cssWidth || this.canvas.clientWidth || 1000;
        const H = this.cssHeight || this.canvas.clientHeight || 300;
        ctx.clearRect(0, 0, W, H);

        const left = 58, right = 16, top = 18, gap = 10;
        const bandH = (H - top - 18 - gap * 2) / 3;
        const plotW = W - left - right;

        this.bands.forEach((band, i) => {
            const y0 = top + i * (bandH + gap);
            this.drawBand(ctx, band, left, y0, plotW, bandH);
        });
    }

    drawBand(ctx, band, left, top, width, height) {
        const values = band.data;
        const times = this.timeData;
        ctx.save();
        ctx.strokeStyle = "#999";
        ctx.strokeRect(left, top, width, height);

        ctx.fillStyle = "#222";
        ctx.font = "12px sans-serif";
        ctx.fillText(`${band.label} (${band.unit})`, 6, top + 14);

        if (values.length < 2 || times.length < 2) {
            ctx.restore();
            return;
        }

        let min = Math.min(...values);
        let max = Math.max(...values);
        if (min === max) { min -= 1; max += 1; }
        const pad = (max - min) * 0.08;
        min -= pad; max += pad;

        const tMin = times[0];
        const tMax = times[times.length - 1] || tMin + 1;
        const tSpan = Math.max(1e-9, tMax - tMin);

        ctx.beginPath();
        values.forEach((value, i) => {
            const x = left + ((times[i] - tMin) / tSpan) * width;
            const y = top + height - ((value - min) / (max - min)) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // zero line
        if (min <= 0 && max >= 0) {
            const zy = top + height - ((0 - min) / (max - min)) * height;
            ctx.beginPath();
            ctx.moveTo(left, zy);
            ctx.lineTo(left + width, zy);
            ctx.strokeStyle = "#bbb";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.fillStyle = "#555";
        ctx.font = "10px sans-serif";
        ctx.fillText(`${tMin.toFixed(2)} s`, left, top + height + 11);
        ctx.textAlign = "right";
        ctx.fillText(`${tMax.toFixed(2)} s`, left + width, top + height + 11);
        ctx.textAlign = "left";
        ctx.restore();
    }
}

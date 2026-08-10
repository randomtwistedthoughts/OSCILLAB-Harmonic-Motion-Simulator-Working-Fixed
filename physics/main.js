/* OSCILLAB - standalone browser runtime
 * No ES-module imports are required here, so the simulator also works when
 * index.html is opened directly from a local folder (file://).
 */

(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const canvas = $("simulationCanvas");
    const graphCanvas = $("motionChart");

    const amplitudeInput = $("amplitude");
    const omegaInput = $("omega");
    const phaseInput = $("phase");
    const durationInput = $("duration");

    const startButton = $("startButton");
    const pauseButton = $("pauseButton");
    const resetButton = $("resetButton");
    const clearButton = $("clearButton");

    const statusEl = $("simulationStatus");
    const timeEl = document.querySelector(".current-time strong");
    const stateValues = document.querySelectorAll(".state-card .state-value");

    const MASS = 0.01; // kg

    let params = {
        A: 5,
        omega: Math.PI,
        phi: 0,
        duration: 10
    };

    let time = 0;
    let running = false;
    let rafId = null;
    let lastTimestamp = null;

    // ------------------------------------------------------------
    // Validation / parameters
    // ------------------------------------------------------------

    function readParameters() {
        const A = Number(amplitudeInput.value);
        const omega = Number(omegaInput.value);
        const phi = Number(phaseInput.value);
        const duration = Number(durationInput.value);

        const valid =
            Number.isFinite(A) && A > 0 && A <= 100 &&
            Number.isFinite(omega) && omega > 0 && omega <= 100 &&
            Number.isFinite(phi) &&
            Number.isFinite(duration) && duration >= 0.1 && duration <= 120;

        if (!valid) {
            alert("Vui lòng nhập A > 0, ω > 0 và thời gian từ 0.1 đến 120 s.");
            return null;
        }

        return { A, omega, phi, duration };
    }

    function motionAt(t) {
        const phase = params.omega * t + params.phi;
        const x = params.A * Math.cos(phase);
        const v = -params.A * params.omega * Math.sin(phase);
        const a = -params.A * params.omega * params.omega * Math.cos(phase);
        return { time: t, x, v, a, phase };
    }

    function energyAt(motion) {
        const xM = motion.x / 100;
        const vM = motion.v / 100;
        const k = MASS * params.omega * params.omega;
        return {
            kinetic: 0.5 * MASS * vM * vM,
            potential: 0.5 * k * xM * xM,
            total: 0.5 * k * (params.A / 100) ** 2
        };
    }

    // ------------------------------------------------------------
    // UI
    // ------------------------------------------------------------

    function setStatus(text) {
        if (statusEl) statusEl.textContent = text;
    }

    function updateState() {
        const m = motionAt(time);
        const e = energyAt(m);

        if (timeEl) timeEl.textContent = m.time.toFixed(2);

        if (stateValues.length >= 4) {
            stateValues[0].innerHTML = `${m.x.toFixed(2)} <span>cm</span>`;
            stateValues[1].innerHTML = `${m.v.toFixed(2)} <span>cm/s</span>`;
            stateValues[2].innerHTML = `${m.a.toFixed(2)} <span>cm/s²</span>`;
            stateValues[3].innerHTML = `${e.total.toFixed(4)} <span>J</span>`;
        }

        drawSimulation(m);
        drawGraph(m);
    }

    // ------------------------------------------------------------
    // Simulation canvas
    // ------------------------------------------------------------

    function resizeSimulationCanvas() {
        if (!canvas) return;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(300, Math.round(rect.width));
        const h = Math.max(220, Math.round(rect.height));
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas._cssW = w;
        canvas._cssH = h;
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        updateState();
    }

    function drawSpring(ctx, x1, x2, y, coils = 16) {
        const lead = 28;
        const start = x1 + lead;
        const end = x2 - 18;
        const span = Math.max(20, end - start);
        const step = span / coils;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(start, y);

        for (let i = 0; i < coils; i++) {
            const x = start + i * step;
            const next = x + step / 2;
            const sign = i % 2 === 0 ? -1 : 1;
            ctx.lineTo(next, y + sign * 10);
            ctx.lineTo(x + step, y);
        }

        ctx.lineTo(x2, y);
        ctx.stroke();
    }

    function drawSimulation(m) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas._cssW || canvas.clientWidth || 1000;
        const H = canvas._cssH || canvas.clientHeight || 300;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#07111f";
        ctx.fillRect(0, 0, W, H);

        const left = 55;
        const right = W - 55;
        const cy = H * 0.56;
        const centerX = W / 2;
        const maxTravel = Math.max(80, Math.min(W * 0.36, W / 2 - 80));
        const normalized = params.A > 0 ? m.x / params.A : 0;
        const particleX = centerX + normalized * maxTravel;

        // Track
        ctx.strokeStyle = "#50627a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(left, cy + 28);
        ctx.lineTo(right, cy + 28);
        ctx.stroke();

        // Equilibrium
        ctx.save();
        ctx.strokeStyle = "#00d9ff";
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(centerX, 30);
        ctx.lineTo(centerX, cy + 42);
        ctx.stroke();
        ctx.restore();

        // Amplitude markers
        ctx.strokeStyle = "#35506d";
        ctx.lineWidth = 1;
        [-1, 1].forEach(sign => {
            const x = centerX + sign * maxTravel;
            ctx.beginPath();
            ctx.moveTo(x, cy - 35);
            ctx.lineTo(x, cy + 42);
            ctx.stroke();
        });

        // Wall + spring
        const wallX = Math.max(25, particleX - 210);
        ctx.fillStyle = "#8aa0b8";
        ctx.fillRect(wallX - 12, cy - 55, 12, 110);
        ctx.strokeStyle = "#8aa0b8";
        ctx.lineWidth = 2;
        for (let y = cy - 50; y <= cy + 50; y += 10) {
            ctx.beginPath();
            ctx.moveTo(wallX - 12, y);
            ctx.lineTo(wallX - 25, y + 7);
            ctx.stroke();
        }

        drawSpring(ctx, wallX, particleX - 20, cy - 2);

        // Particle
        const radius = 22;
        const grad = ctx.createRadialGradient(
            particleX - 7, cy - 7, 2,
            particleX, cy, radius
        );
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.2, "#66e8ff");
        grad.addColorStop(1, "#00a8c7");

        ctx.beginPath();
        ctx.arc(particleX, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.fillStyle = "#e9f2ff";
        ctx.font = "600 13px Arial";
        ctx.fillText("VTCB", centerX - 20, 24);
        ctx.fillStyle = "#91a5bb";
        ctx.font = "12px Arial";
        ctx.fillText(`x = ${m.x.toFixed(2)} cm`, 18, 24);
        ctx.fillText(`t = ${m.time.toFixed(2)} s`, 18, H - 14);
        ctx.fillText(`A = ${params.A.toFixed(2)} cm`, W - 120, H - 14);
    }

    // ------------------------------------------------------------
    // Graph
    // ------------------------------------------------------------

    function resizeGraphCanvas() {
        if (!graphCanvas) return;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const rect = graphCanvas.getBoundingClientRect();
        const w = Math.max(300, Math.round(rect.width));
        const h = Math.max(260, Math.round(rect.height));
        graphCanvas.width = w * dpr;
        graphCanvas.height = h * dpr;
        graphCanvas._cssW = w;
        graphCanvas._cssH = h;
        const ctx = graphCanvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawGraph(motionAt(time));
    }

    function drawGraph(current) {
        if (!graphCanvas) return;
        const ctx = graphCanvas.getContext("2d");
        const W = graphCanvas._cssW || graphCanvas.clientWidth || 1000;
        const H = graphCanvas._cssH || graphCanvas.clientHeight || 400;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#07111f";
        ctx.fillRect(0, 0, W, H);

        const left = 64, right = 18, top = 18, bottom = 24, gap = 16;
        const bandH = Math.max(55, (H - top - bottom - gap * 2) / 3);
        const plotW = W - left - right;

        const bands = [
            { key: "x", label: "x(t)", unit: "cm", value: current.x },
            { key: "v", label: "v(t)", unit: "cm/s", value: current.v },
            { key: "a", label: "a(t)", unit: "cm/s²", value: current.a }
        ];

        bands.forEach((band, index) => {
            const y0 = top + index * (bandH + gap);
            drawBand(ctx, band, left, y0, plotW, bandH);
        });
    }

    function drawBand(ctx, band, left, top, width, height) {
        const n = 700;
        const values = new Array(n);
        let min = Infinity;
        let max = -Infinity;

        for (let i = 0; i < n; i++) {
            const t = params.duration * i / (n - 1);
            const m = motionAt(t);
            const value = m[band.key];
            values[i] = { t, value };
            min = Math.min(min, value);
            max = Math.max(max, value);
        }

        if (!Number.isFinite(min) || !Number.isFinite(max)) return;
        if (min === max) { min -= 1; max += 1; }
        const pad = (max - min) * 0.10;
        min -= pad;
        max += pad;

        ctx.strokeStyle = "#294057";
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, width, height);

        // Zero line
        if (min < 0 && max > 0) {
            const zy = top + height - ((0 - min) / (max - min)) * height;
            ctx.save();
            ctx.strokeStyle = "#38516b";
            ctx.setLineDash([4, 5]);
            ctx.beginPath();
            ctx.moveTo(left, zy);
            ctx.lineTo(left + width, zy);
            ctx.stroke();
            ctx.restore();
        }

        // Curve
        ctx.beginPath();
        values.forEach((p, i) => {
            const x = left + (p.t / params.duration) * width;
            const y = top + height - ((p.value - min) / (max - min)) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "#00d9ff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Current-time marker
        const markerX = left + (Math.min(currentTimeSafe(), params.duration) / params.duration) * width;
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(markerX, top);
        ctx.lineTo(markerX, top + height);
        ctx.stroke();
        ctx.restore();

        // Current point
        const cv = band.value;
        const pointY = top + height - ((cv - min) / (max - min)) * height;
        ctx.beginPath();
        ctx.arc(markerX, pointY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Text
        ctx.fillStyle = "#e9f2ff";
        ctx.font = "600 12px Arial";
        ctx.fillText(`${band.label} (${band.unit})`, 8, top + 14);
        ctx.fillStyle = "#71869e";
        ctx.font = "10px Arial";
        ctx.fillText(min.toFixed(2), left + 3, top + height - 4);
        ctx.fillText(max.toFixed(2), left + 3, top + 11);
        ctx.textAlign = "right";
        ctx.fillText(`${params.duration.toFixed(2)} s`, left + width, top + height + 12);
        ctx.textAlign = "left";
    }

    function currentTimeSafe() {
        return Number.isFinite(time) ? time : 0;
    }

    // ------------------------------------------------------------
    // Animation
    // ------------------------------------------------------------

    function tick(timestamp) {
        if (!running) return;

        if (lastTimestamp === null) lastTimestamp = timestamp;
        const dt = Math.min(0.05, Math.max(0, (timestamp - lastTimestamp) / 1000));
        lastTimestamp = timestamp;

        time += dt;

        if (time >= params.duration) {
            time = params.duration;
            running = false;
            lastTimestamp = null;
            rafId = null;
            setStatus("■ FINISHED");
            updateState();
            return;
        }

        updateState();
        rafId = requestAnimationFrame(tick);
    }

    function start() {
        const next = readParameters();
        if (!next) return;

        if (!running) {
            params = next;
            if (time >= params.duration) time = 0;
            running = true;
            lastTimestamp = null;
            setStatus("▶ RUNNING");
            if (rafId === null) rafId = requestAnimationFrame(tick);
        }
    }

    function pause() {
        running = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        lastTimestamp = null;
        setStatus("Ⅱ PAUSED");
    }

    function reset() {
        pause();
        const next = readParameters();
        if (next) params = next;
        time = 0;
        setStatus("● READY");
        updateState();
    }

    function clearGraph() {
        pause();
        time = 0;
        if (graphCanvas) {
            const ctx = graphCanvas.getContext("2d");
            const W = graphCanvas._cssW || graphCanvas.clientWidth || 1000;
            const H = graphCanvas._cssH || graphCanvas.clientHeight || 400;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "#07111f";
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = "#71869e";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Đồ thị đã được xóa — nhấn BẮT ĐẦU để vẽ lại.", W / 2, H / 2);
            ctx.textAlign = "left";
        }
        setStatus("● READY");
        updateState();
    }

    // ------------------------------------------------------------
    // Events
    // ------------------------------------------------------------

    startButton?.addEventListener("click", start);
    pauseButton?.addEventListener("click", pause);
    resetButton?.addEventListener("click", reset);
    clearButton?.addEventListener("click", clearGraph);

    [amplitudeInput, omegaInput, phaseInput, durationInput].forEach(input => {
        input?.addEventListener("change", () => {
            if (!running) reset();
        });
    });

    window.addEventListener("resize", () => {
        resizeSimulationCanvas();
        resizeGraphCanvas();
    });

    // Initial render
    resizeSimulationCanvas();
    resizeGraphCanvas();
    updateState();
    setStatus("● READY");
})();

export class UIController {

    constructor() {

        // ==============================
        // INPUT
        // ==============================

        this.amplitude =
            document.getElementById(
                "amplitude"
            );


        this.omega =
            document.getElementById(
                "omega"
            );


        this.phase =
            document.getElementById(
                "phase"
            );


        this.duration =
            document.getElementById(
                "duration"
            );


        // ==============================
        // STATE CARDS
        // ==============================

        this.stateValues =
            document.querySelectorAll(
                ".state-card .state-value"
            );


        // ==============================
        // TIME
        // ==============================

        this.timeElement =
            document.querySelector(
                ".current-time strong"
            );


        // ==============================
        // SIMULATION
        // ==============================

        this.canvas =
            document.getElementById(
                "simulationCanvas"
            );


        this.ctx =
            this.canvas
                ? this.canvas.getContext("2d")
                : null;


        // ==============================
        // BUTTONS
        // ==============================

        this.buttons =
            document.querySelectorAll(
                ".control-grid .btn"
            );

    }


    getParameters() {

        return {

            A: Number(this.amplitude?.value),

            omega: Number(this.omega?.value),

            phi: Number(this.phase?.value),

            duration: Number(this.duration?.value)

        };

    }


    update(motion, energy) {

        // ==============================
        // TIME
        // ==============================

        if (this.timeElement) {

            this.timeElement.textContent =
                motion.time.toFixed(2);

        }


        // ==============================
        // STATE CARDS
        // ==============================

        if (
            this.stateValues.length >= 4
        ) {

            this.stateValues[0].innerHTML =
                `${motion.displacement.toFixed(2)}
                <span>cm</span>`;


            this.stateValues[1].innerHTML =
                `${motion.velocity.toFixed(2)}
                <span>cm/s</span>`;


            this.stateValues[2].innerHTML =
                `${motion.acceleration.toFixed(2)}
                <span>cm/s²</span>`;


            this.stateValues[3].innerHTML =
                `${energy.totalEnergy.toFixed(4)}
                <span>J</span>`;

        }


        // ==============================
        // DRAW SIMULATION
        // ==============================

        this.drawSimulation(
            motion
        );

    }


    drawSimulation(motion) {

        if (!this.ctx || !this.canvas) {
            return;
        }


        const ctx = this.ctx;

        const width =
            this.canvas.width;

        const height =
            this.canvas.height;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        // Background

        ctx.fillStyle =
            "#07111f";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        // Center

        const centerX =
            width / 2;

        const centerY =
            height / 2;


        // Axis

        ctx.strokeStyle =
            "#50627a";

        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(
            50,
            centerY
        );

        ctx.lineTo(
            width - 50,
            centerY
        );

        ctx.stroke();


        // Scale

        const maxVisual =
            width * 0.38;


        const normalizedPosition =
            motion.amplitude === 0
                ? 0
                : motion.displacement / motion.amplitude;

        const position =
            centerX +
            normalizedPosition * maxVisual;


        // Equilibrium

        ctx.strokeStyle =
            "#00d9ff";

        ctx.setLineDash([
            6,
            6
        ]);


        ctx.beginPath();

        ctx.moveTo(
            centerX,
            30
        );

        ctx.lineTo(
            centerX,
            height - 30
        );

        ctx.stroke();


        ctx.setLineDash([]);


        // Particle

        ctx.beginPath();

        ctx.arc(
            position,
            centerY,
            18,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#00d9ff";

        ctx.fill();


        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.stroke();


        // Labels

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "14px Arial";


        ctx.fillText(
            "VTCB",
            centerX - 20,
            25
        );


        ctx.fillText(
            "x = " +
            motion.displacement.toFixed(2) +
            " cm",
            20,
            25
        );

    }

}

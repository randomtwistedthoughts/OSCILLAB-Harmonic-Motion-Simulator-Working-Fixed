import { validateParameter } from "./parameter.js";
import { validateAngularFrequency }
    from "./angularFrequency.js";
import { calculatePhase }
    from "./phase.js";
import { calculateDisplacement }
    from "./displacement.js";
import { calculateVelocity }
    from "./velocity.js";
import { calculateAcceleration }
    from "./acceleration.js";
export function calculateMotion(A, omega, phi, t) {
    A = validateParameter(A, 5);
    omega = validateParameter(omega, Math.PI);
    phi = validateParameter(phi, 0);
    t = validateParameter(t, 0);
    omega = validateAngularFrequency(omega);
    const phase =
        calculatePhase(
            omega,
            t,
            phi
        );
    const displacement =
        calculateDisplacement(
            A,
            omega,
            t,
            phi
        );
    const velocity =
        calculateVelocity(
            A,
            omega,
            t,
            phi
        );
    const acceleration =
        calculateAcceleration(
            A,
            omega,
            t,
            phi
        );
    const period =
        (2 * Math.PI) / omega;
    return {
        amplitude: A,
        angularFrequency: omega,
        period: period,
        initialPhase: phi,
        time: t,
        phase: phase,
        displacement: displacement,
        velocity: velocity,
        acceleration: acceleration

    };
}

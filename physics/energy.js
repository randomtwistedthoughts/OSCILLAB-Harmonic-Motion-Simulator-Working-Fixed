// Energy calculations use SI units internally.
// The UI displays displacement in cm and velocity in cm/s,
// so values are converted to meters and meters/second here.

const CM_TO_M = 0.01;

export function calculateKineticEnergy(m, velocityCmPerSecond) {
    const velocityMPerSecond =
        Number(velocityCmPerSecond) * CM_TO_M;

    return 0.5 * m * velocityMPerSecond ** 2;
}

export function calculatePotentialEnergy(m, omega, displacementCm) {
    const displacementM =
        Number(displacementCm) * CM_TO_M;

    return 0.5 * m * omega ** 2 * displacementM ** 2;
}

export function calculateTotalEnergy(m, omega, amplitudeCm) {
    const amplitudeM =
        Number(amplitudeCm) * CM_TO_M;

    return 0.5 * m * omega ** 2 * amplitudeM ** 2;
}

export function calculateEnergy(m, omega, amplitudeCm, displacementCm, velocityCmPerSecond) {
    const kineticEnergy =
        calculateKineticEnergy(
            m,
            velocityCmPerSecond
        );

    const potentialEnergy =
        calculatePotentialEnergy(
            m,
            omega,
            displacementCm
        );

    const totalEnergy =
        calculateTotalEnergy(
            m,
            omega,
            amplitudeCm
        );

    return {
        kineticEnergy,
        potentialEnergy,
        totalEnergy
    };
}

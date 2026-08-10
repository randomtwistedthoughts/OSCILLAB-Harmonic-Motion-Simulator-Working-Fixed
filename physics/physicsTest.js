import { calculateMotion }
    from "./physicsEngine.js";

import { calculateEnergy }
    from "./energy.js";

const EPSILON = 1e-8;

function approximatelyEqual(a, b) {
    return Math.abs(a - b) < EPSILON;
}

export function testInitialPosition() {
    const A = 5;
    const omega = Math.PI;
    const phi = 0;
    const t = 0;

    const motion =
        calculateMotion(
            A,
            omega,
            phi,
            t
        );

    return approximatelyEqual(
        motion.displacement,
        A
    );
}

export function testInitialVelocity() {
    const motion =
        calculateMotion(
            5,
            Math.PI,
            0,
            0
        );

    return approximatelyEqual(
        motion.velocity,
        0
    );
}

export function testAccelerationRelation() {
    const motion =
        calculateMotion(
            5,
            Math.PI,
            0.3,
            0.7
        );

    return approximatelyEqual(
        motion.acceleration,
        -motion.angularFrequency *
        motion.angularFrequency *
        motion.displacement
    );
}

export function testPeriodicity() {
    const A = 5;
    const omega = Math.PI;
    const phi = 0.5;
    const t = 1.3;

    const T =
        (2 * Math.PI) / omega;

    const first =
        calculateMotion(
            A,
            omega,
            phi,
            t
        );

    const second =
        calculateMotion(
            A,
            omega,
            phi,
            t + T
        );

    return (
        approximatelyEqual(
            first.displacement,
            second.displacement
        ) &&
        approximatelyEqual(
            first.velocity,
            second.velocity
        ) &&
        approximatelyEqual(
            first.acceleration,
            second.acceleration
        )
    );
}

export function testEnergyConservation() {
    const A = 5;
    const omega = Math.PI;
    const phi = 0.4;

    const motion =
        calculateMotion(
            A,
            omega,
            phi,
            0.73
        );

    const energy =
        calculateEnergy(
            1,
            omega,
            A,
            motion.displacement,
            motion.velocity
        );

    return approximatelyEqual(
        energy.kineticEnergy +
        energy.potentialEnergy,
        energy.totalEnergy
    );
}

export function runPhysicsTests() {
    const tests = {
        initialPosition:
            testInitialPosition(),

        initialVelocity:
            testInitialVelocity(),

        accelerationRelation:
            testAccelerationRelation(),

        periodicity:
            testPeriodicity(),

        energyConservation:
            testEnergyConservation()
    };

    console.table(tests);

    const passed =
        Object.values(tests)
            .every(Boolean);

    console.log(
        passed
            ? "✓ Tất cả Physics Tests đều PASS."
            : "✗ Có Physics Test thất bại."
    );

    return tests;
}

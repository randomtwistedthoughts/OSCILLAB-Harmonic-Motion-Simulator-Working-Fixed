export function calculateVelocity(A, omega, t, phi) {
    return -A * omega * Math.sin(omega * t + phi);
}

export function calculateAcceleration(A, omega, t, phi) {
    return -A * omega * omega * Math.cos(omega * t + phi);
}

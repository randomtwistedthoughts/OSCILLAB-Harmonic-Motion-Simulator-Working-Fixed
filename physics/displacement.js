export function calculateDisplacement(A, omega, t, phi) {
    return A * Math.cos(omega * t + phi);
}

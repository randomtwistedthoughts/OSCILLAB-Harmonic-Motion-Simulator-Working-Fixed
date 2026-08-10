export function calculateAngularFrequencyFromPeriod(T) {
    if (T <= 0) {
        throw new Error("Chu kỳ T phải lớn hơn 0.");
    }
    return (2 * Math.PI) / T;
}
export function validateAngularFrequency(omega) {
    if (!Number.isFinite(omega) || omega <= 0) {
        throw new Error("Tần số góc ω phải lớn hơn 0.");
    }
    return omega;
}

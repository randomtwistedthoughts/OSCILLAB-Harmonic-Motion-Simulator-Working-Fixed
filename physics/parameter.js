export function validateParameter(value, defaultValue = 0) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return defaultValue;
    }
    return number;
}
export function validatePositive(value, defaultValue) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
        return defaultValue;
    }
    return number;
}

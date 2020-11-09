export function validateInputs(validatableObject) {
    let isValid = true;
    const value = validatableObject.value;
    if (validatableObject.required) {
        isValid = isValid && value !== null;
    }
    if (validatableObject.minLength != null &&
        typeof validatableObject.value === "string") {
        isValid = isValid && value.toString().length >= validatableObject.minLength;
    }
    if (validatableObject.maxLength != null &&
        typeof validatableObject.value === "string") {
        isValid = isValid && value.toString().length <= validatableObject.maxLength;
    }
    if (validatableObject.min != null && typeof value === "number") {
        isValid = isValid && value >= validatableObject.min;
    }
    if (validatableObject.max != null && typeof value === "number") {
        isValid = isValid && value <= validatableObject.max;
    }
    return isValid;
}

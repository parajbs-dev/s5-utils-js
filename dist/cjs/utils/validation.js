"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = exports.throwValidationError = void 0;
/**
 * Throws an error for the given value
 * @param name - The name of the value.
 * @param value - The actual value.
 * @param valueKind - The kind of value that is being checked (e.g. "parameter", "response field", etc.)
 * @param expected - The expected aspect of the value that could not be validated (e.g. "type 'string'" or "non-null").
 * @throws - Will always throw.
 */
function throwValidationError(name, value, valueKind, expected) {
    throw validationError(name, value, valueKind, expected);
}
exports.throwValidationError = throwValidationError;
/**
 * Returns an error for the given value
 * @param name - The name of the value.
 * @param value - The actual value.
 * @param valueKind - The kind of value that is being checked (e.g. "parameter", "response field", etc.)
 * @param expected - The expected aspect of the value that could not be validated (e.g. "type 'string'" or "non-null").
 * @returns - The validation error.
 */
function validationError(name, value, valueKind, expected) {
    let actualValue;
    if (value === undefined) {
        actualValue = "type 'undefined'";
    }
    else if (value === null) {
        actualValue = "type 'null'";
    }
    else {
        actualValue = `type '${typeof value}', value '${value}'`;
    }
    return new Error(`Expected ${valueKind} '${name}' to be ${expected}, was ${actualValue}`);
}
exports.validationError = validationError;

export function formatNumberPrecision(number, precision) {
    if (number !== null) {
        return parseFloat(number).toFixed(precision)
    }
}

/**
 * Formats a patient name for display purposes
 */
export function formatPN(name) {
    if (!name) {
        return
    }

    // Convert the first ^ to a ', '. String.replace() only affects
    // the first appearance of the character.
    const commaBetweenFirstAndLast = name.replace('^', ', ')

    // Replace any remaining '^' characters with spaces
    const cleaned = commaBetweenFirstAndLast.replace(/\^/g, ' ')

    // Trim any extraneous whitespace
    return cleaned.trim()
}

export function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value)
}

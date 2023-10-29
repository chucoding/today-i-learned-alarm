/**
 * Converts the given number of days into milliseconds.
 *
 * @param {number} days - The number of days to convert.
 * @returns {number} The millisecond value for the input number of days.
 */
export function convertDaysToMilliseconds(days) { return 24 * days * 60 * 60 * 1000 };
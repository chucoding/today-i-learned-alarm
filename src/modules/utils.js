/**
 * Converts the given number of days into milliseconds.
 *
 * @param {number} days - The number of days to convert.
 * @returns {number} The millisecond value for the input number of days.
 */
export function convertDaysToMilliseconds(days) { return 24 * days * 60 * 60 * 1000 };

/**
 * get current date formatter
 * @since 2024-03-03
 * @returns yyyy-mm-dd
 */
export function getCurrentDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 포맷팅
    const day = String(currentDate.getDate()).padStart(2, '0'); // 날짜를 두 자리로 포맷팅

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
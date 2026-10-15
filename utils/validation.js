function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsed = new Date(date);

    return !isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date;
}
module.exports = { isValidDate };
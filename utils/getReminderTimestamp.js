
function getReminderTimestamp(dueDate) {
    
    const indiaDate = new Date(dueDate).toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kolkata'
    });

    const [year, month, day] = indiaDate.split('-').map(Number);

    const previousDay = new Date(Date.UTC(year, month - 1, day - 1));

    const reminderDate = [
        previousDay.getUTCFullYear(),
        String(previousDay.getUTCMonth() + 1).padStart(2, '0'),
        String(previousDay.getUTCDate()).padStart(2, '0')
    ].join('-');

    const reminderTimestamp = new Date(
        `${reminderDate}T00:00:00+05:30`
    ).getTime();


    return Math.max(reminderTimestamp, Date.now());
}

module.exports = { getReminderTimestamp };

export function formatDateTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - dateTime.getTime()) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) {
        return `${diffSeconds} sekunder siden`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minutter siden`;
    } else if (diffHours < 24) {
        return `${diffHours} timer siden`;
    } else if (isYesterday(dateTime, now)) {
        return `kl. ${formatTime(dateTime)} i går`;
    } else {
        return formatDateTimeFull(dateTime);
    }
}

function isYesterday(d1: Date, d2: Date): boolean {
    const yesterday = new Date(d2);
    yesterday.setDate(yesterday.getDate() - 1);
    return d1.getFullYear() === yesterday.getFullYear() &&
        d1.getMonth() === yesterday.getMonth() &&
        d1.getDate() === yesterday.getDate();
}

function formatTime(date: Date): string {
    return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

function formatDateTimeFull(date: Date): string {
    return `${formatTime(date)} ${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()} `;
}

function padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}

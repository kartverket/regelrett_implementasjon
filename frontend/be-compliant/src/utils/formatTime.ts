export function formatDateTime(dateTimeString: string): string {
<<<<<<< HEAD
  const dateTime = new Date(dateTimeString)
  const now = new Date()
  const diffSeconds = Math.floor((now.getTime() - dateTime.getTime()) / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)

  if (diffSeconds < 60) {
    return `${diffSeconds} sekunder siden`
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutter siden`
  } else if (diffHours < 24) {
    return `${diffHours} timer siden`
  } else if (isYesterday(dateTime, now)) {
    return `kl. ${formatTime(dateTime)} i går`
  } else {
    return formatDateTimeFull(dateTime)
=======
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
>>>>>>> 74d942d1 (Prettier)
  }
}

function isYesterday(d1: Date, d2: Date): boolean {
<<<<<<< HEAD
  const yesterday = new Date(d2)
  yesterday.setDate(yesterday.getDate() - 1)
=======
  const yesterday = new Date(d2);
  yesterday.setDate(yesterday.getDate() - 1);
>>>>>>> 74d942d1 (Prettier)
  return (
    d1.getFullYear() === yesterday.getFullYear() &&
    d1.getMonth() === yesterday.getMonth() &&
    d1.getDate() === yesterday.getDate()
<<<<<<< HEAD
  )
}

function formatTime(date: Date): string {
  return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}

function formatDateTimeFull(date: Date): string {
  return `${formatTime(date)} ${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()} `
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
=======
  );
}

function formatTime(date: Date): string {
  return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

function formatDateTimeFull(date: Date): string {
  return `${formatTime(date)} ${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()} `;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
>>>>>>> 74d942d1 (Prettier)
}

export function formatTimestamp(timestamp: string): string {
  // const [datePart, timePart] = timestamp.split(", ");
  // const [day, month, year] = datePart.split("/").map(Number);
  const [month, day, year] = timestamp.split("/").map(Number);
  // const [hours, minutes] = timePart.split(":").map(Number);
  // const date = new Date(2000 + year, month - 1, day, hours, minutes);
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    // hour: "numeric",
    // minute: "numeric",
    // second: "numeric",
    month: "short",
    day: "numeric",
    year: "numeric",
    // hour12: false,
  };
  const formattedDate: string = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(date);
  return formattedDate;
}

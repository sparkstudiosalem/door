// '0:0:0  1/1/0 SUN'
export default function parseAccxDate(accxDate: string): Date {
  const parts = accxDate.split(/\s+/);
  if (parts.length !== 3) {
    throw new Error(
      `Unrecognized ACCX date format ${accxDate}, overall format`
    );
  }

  const [time, date, _dayOfWeek] = parts;
  if (!time || !date) {
    throw new Error(`Unrecognized ACCX date format ${accxDate}, time or date`);
  }

  const timeParts = time.split(":");
  if (timeParts.length !== 3) {
    throw new Error(
      `Unrecognized ACCX date format ${accxDate}, hour:minute:second part A`
    );
  }

  const [hoursString, minutesString, secondsString] = timeParts;
  if (!hoursString || !minutesString || !secondsString) {
    throw new Error(
      `Unrecognized ACCX date format ${accxDate}, hour:minute:second part B`
    );
  }

  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);
  const milliseconds = 0;

  const dateParts = date.split("/");
  if (dateParts.length !== 3) {
    throw new Error(
      `Unrecognized ACCX date format ${accxDate}, day/month/year part A`
    );
  }

  const [yearString, monthString, dayString] = dateParts;
  if (!yearString || !monthString || !dayString) {
    throw new Error(
      `Unrecognized ACCX date format ${accxDate}, day/month/year part B`
    );
  }

  const year = parseInt(yearString, 10);
  const monthIndex = parseInt(monthString, 10);
  const day = parseInt(dayString, 10);

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
  return new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds);
}

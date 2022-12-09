// '0:0:0  1/1/0 SUN'
export default function parseAccxDate(accxDate: string): Date {
  const parts = accxDate.split(/\s+/);
  if (parts.length !== 4) {
    throw new Error(
      `Unrecognized ACCX date format ${JSON.stringify(
        accxDate
      )}; overall format`
    );
  }

  const [time, date, _dayOfWeek] = parts;
  if (!time || !date) {
    throw new Error(
      `Unrecognized ACCX date format ${JSON.stringify(accxDate)}; time or date`
    );
  }

  const timeParts = time.split(":");
  if (timeParts.length !== 3) {
    throw new Error(
      `Unrecognized ACCX date format ${JSON.stringify(
        accxDate
      )}; hour:minute:second part A`
    );
  }

  const [hoursString, minutesString, secondsString] = timeParts;
  if (!hoursString || !minutesString || !secondsString) {
    throw new Error(
      `Unrecognized ACCX date format ${JSON.stringify(
        accxDate
      )}; hour:minute:second part B`
    );
  }

  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);
  const milliseconds = 0;

  const dateParts = date.split("/");
  if (dateParts.length !== 3) {
    throw new Error(
      `Unrecognized ACCX date format ${JSON.stringify(
        accxDate
      )}; day/month/year part A`
    );
  }

  const [monthString, dayString, yearString] = dateParts;
  if (!dayString || !monthString || !yearString) {
    throw new Error(
      `Unrecognized ACCX date format ${JSON.stringify(
        accxDate
      )}; day/month/year part B`
    );
  }

  const year = parseInt(yearString, 10) + 2000;
  const month = parseInt(monthString, 10);
  const day = parseInt(dayString, 10);

  const datePart = `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  const timePart = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(3, "0")}Z`;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
  return new Date(`${datePart}T${timePart}`);
}

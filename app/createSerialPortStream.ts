import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export default function createSerialPortStream() {
  // serialPortStream.write("?\r");

  const serialPortStream = new SerialPort({
    path: "/dev/ttyAMA0",
    baudRate: 9600,
  });

  const lines: string[] = [];
  const errors: string[] = [];

  const parser = new ReadlineParser();
  serialPortStream.pipe(parser);

  parser.on("data", (line: string) => {
    lines.push(line);
    console.log(line);
  });

  serialPortStream.on("error", (err) => {
    if (err) {
      errors.push(err.toString());
      console.log(`Encountered an error event from serialport ${err}`);
    }
  });

  return serialPortStream;
}

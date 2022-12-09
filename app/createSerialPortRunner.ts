import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import parseAccxDate from "./utils/parseAccxDate";

async function runSession<TResolveType extends Promise<unknown>>(
  command: string,
  onData: (data: string) => TResolveType
) {
  return new Promise<TResolveType>((resolve, reject) => {
    const serialPortStream = new SerialPort({
      path: "/dev/ttyAMA0",
      baudRate: 9600,
    });

    const parser = new ReadlineParser();
    serialPortStream.pipe(parser);

    parser.on("data", async (data) => {
      const result = await onData(data);
      serialPortStream.close();
      resolve(result);
    });

    serialPortStream.on("error", (err) => {
      if (err) {
        console.log(`Encountered an error event from serialport ${err}`);
      }
      reject(err);
    });

    serialPortStream.write(`${command}\r`);
  });
}

export default function createSerialPortStream() {
  return {
    getDeviceTime: () => {
      return runSession("d", async (accxDate: string) => {
        return parseAccxDate(accxDate);
      });
    },
  };
}

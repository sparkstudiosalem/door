import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export async function runSession<TResolveType>({
  command,
  onData,
}: {
  command: string;
  onData: (onComplete: (result: TResolveType) => void, data: string) => void;
}) {
  const serialPortStream = new SerialPort({
    path: "/dev/ttyAMA0",
    baudRate: 9600,
  });

  return new Promise<TResolveType>((resolve, reject) => {
    const parser = new ReadlineParser();
    serialPortStream.pipe(parser);

    parser.on("data", onData.bind(null, resolve));

    serialPortStream.on("error", (err) => {
      if (err) {
        console.log(`Encountered an error event from serialport ${err}`);
      }
      reject(err);
    });

    serialPortStream.write(`${command}\r`);
  }).finally(() => {
    serialPortStream.close();
  });
}
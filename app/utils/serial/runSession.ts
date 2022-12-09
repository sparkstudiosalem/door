import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import createLogger from "../createLogger";

const log = createLogger(__filename);

type SerialSessionOnData<TResolveType> = (
  onComplete: (result: TResolveType) => void,
  data: string
) => void;

export async function runSession<TResolveType>({
  command,
  onData,
}: {
  command: string;
  onData: SerialSessionOnData<TResolveType>;
}) {
  log.info("Opening serial port stream");

  const serialPortStream = new SerialPort({
    path: "/dev/ttyAMA0",
    baudRate: 9600,
  });

  return new Promise<TResolveType>((resolve, reject) => {
    const parser = new ReadlineParser({ delimiter: "\r\n" });
    serialPortStream.pipe(parser);

    parser.on("data", (data: string) => {
      log.info(JSON.stringify({ data }));
      onData(resolve, data);
    });

    serialPortStream.on("error", (err) => {
      if (err) {
        log.error(`Encountered an error event from serialport ${err}`);
      }
      reject(err);
    });

    const writePayload = `${command}\r`;
    log.info(`Writing to serial port: ${JSON.stringify(writePayload)}`);
    serialPortStream.write(writePayload);
  }).finally(() => {
    log.info("Closing serial port stream");
    serialPortStream.close();
  });
}

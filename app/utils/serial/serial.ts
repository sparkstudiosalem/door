import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import createLogger from "../createLogger";
import {
  COMMANDS,
  PRIVILEGED_MODE,
  PRIVILEGED_MODE_PASSWORD,
} from "./constants";

const log = createLogger(__filename);

type SerialSessionOnData<TResolveType> = (
  onComplete: (result: TResolveType) => void,
  data: string
) => void;

let serialPortStream: SerialPort;
export default async function initialize() {
  log.info("Opening serial port stream");
  serialPortStream = new SerialPort({
    path: "/dev/ttyAMA0",
    baudRate: 9600,
  });

  const readlineParser = new ReadlineParser({ delimiter: "\r\n" });
  serialPortStream.pipe(readlineParser);

  // The primary data listener is responsible for splitting the data stream.
  // Recognized events from the ACCX such as card scans are forwarded to a
  // dedicated handler.
  // Other data events are forwarded to command-specific handlers.
  readlineParser.on("data", (data: string) => {
    log.debug(`Received data from serial port: ${JSON.stringify(data)}`);

    // 0:0:0  1/1/0 SUN User 6609 presented tag at reader 2
    // 0:0:0  1/1/0 SUN User not found
    // 0:0:0  1/1/0 SUN User  denied access at reader 2
    const isBadgeEvent = !!data.match(
      /^\d+:\d+\d+\s+\d+\/\d+\/\d+ \w{3} User /
    );
    if (isBadgeEvent) {
      handleBadgeEvent(data);
    } else {
      handleNonBadgeEvent(data);
    }
  });
}

function handleBadgeEvent(data: string) {
  log.info(`Badge data received: ${JSON.stringify(data)}`);
}

const handlers: {
  command: string;
  isPrivileged: boolean;
  onComplete: (result: any) => void;
  onData: SerialSessionOnData<any>;
}[] = [];

function handleNonBadgeEvent(data: string) {
  const handler = handlers[0];

  if (!handler) {
    log.warn(
      `Non-badge data received, and no handler is available ${JSON.stringify(
        data
      )}`
    );
    return;
  }

  const { onComplete, onData } = handler;

  onData(onComplete, data);
}

function enqueue<TResolveType>({
  command,
  isPrivileged,
  onComplete,
  onData,
}: {
  command: string;
  isPrivileged: boolean;
  onComplete: (result: TResolveType) => void;
  onData: SerialSessionOnData<TResolveType>;
}) {
  handlers.push({ command, isPrivileged, onComplete, onData });
  tick();
}

function tick() {
  const handler = handlers[0];
  if (handler && handlers.length === 1) {
    const { command, isPrivileged } = handler;
    if (isPrivileged) {
      log.info(
        `Enabling privileged mode for command ${JSON.stringify(command)}`
      );
      serialPortStream.write(
        `${PRIVILEGED_MODE} ${PRIVILEGED_MODE_PASSWORD}\r`
      );
    }
    log.info(`Writing to serial port: ${JSON.stringify(command)}`);
    serialPortStream.write(command);
  }
}

export async function runSession<TResolveType>({
  command,
  isPrivileged = false,
  onData,
  params,
}: {
  command: COMMANDS;
  isPrivileged?: boolean;
  onData: SerialSessionOnData<TResolveType>;
  params?: readonly string[];
}) {
  return new Promise<TResolveType>((resolve, reject) => {
    // serialPortStream.on("error", (err) => {
    //   if (err) {
    //     log.error(`Encountered an error event from serialport ${err}`);
    //   }
    //   reject(err);
    // });

    function onComplete(result: TResolveType) {
      const handler = handlers.shift();
      if (!handler) {
        log.error("Handler onComplete called, but handler was not available");
        reject();
        return;
      }

      const { isPrivileged } = handler;
      if (isPrivileged) {
        log.info(
          `Disabling privileged mode for command ${JSON.stringify(command)}`
        );
        serialPortStream.write(`${PRIVILEGED_MODE}\r`);
      }

      resolve(result);

      global.setImmediate(tick);
    }

    enqueue({
      command: `${command}${params ? " " + params.join(" ") : ""}\r`,
      isPrivileged,
      onComplete,
      onData,
    });
  }).finally(() => {
    // log.info("Closing serial port stream");
    // serialPortStream.close();
  });
}

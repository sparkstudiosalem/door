import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import createLogger from "../createLogger";
import {
  COMMANDS,
  PRIVILEGED_MODE,
  PRIVILEGED_MODE_PASSWORD,
} from "./constants";

const log = createLogger(__filename);

type SerialSessionOnEvent<TResolveType> = (event: {
  data: string;
  onComplete: (result: TResolveType) => void;
  onError: () => void;
}) => void;

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
      /^\d+:\d+:\d+\s+\d+\/\d+\/\d+\s+\w{3}\s+User\s+/
    );
    // 0:0:0  1/1/0 SUN Priveleged mode disabled.
    const isPrivilegeDisableEvent = data.includes("Priveleged mode disabled");

    if (isBadgeEvent) {
      handleBadgeEvent(data);
    } else if (!isPrivilegeDisableEvent) {
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
  onError: () => void;
  onEvent: SerialSessionOnEvent<any>;
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

  handler.onEvent({
    data,
    onComplete: handler.onComplete,
    onError: handler.onError,
  });
}

function enqueue<TResolveType>({
  command,
  isPrivileged,
  onComplete,
  onError,
  onEvent,
}: {
  command: string;
  isPrivileged: boolean;
  onComplete: (result: TResolveType) => void;
  onError: () => void;
  onEvent: SerialSessionOnEvent<TResolveType>;
}) {
  handlers.push({ command, isPrivileged, onComplete, onError, onEvent });
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
  onEvent,
  params,
}: {
  command: COMMANDS;
  isPrivileged?: boolean;
  onEvent: SerialSessionOnEvent<TResolveType>;
  params?: readonly (string | number)[];
}) {
  return new Promise<TResolveType>((resolve, reject) => {
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

    function onError() {
      reject();
    }

    enqueue({
      command: `${command}${params ? " " + params.join(" ") : ""}\r`,
      isPrivileged,
      onComplete,
      onError,
      onEvent,
    });
  });
}

import { components } from "../../generated/schema/openapi";
import { runSession } from "./serial";
import { DEVICE_STATUS_SHOW } from "./constants";

// "Alarm armed state (1=armed):4",
// "Alarm siren state (1=activated):0",
// "Front door open state (0=closed):0",
// "Roll up door open state (0=closed):0",
// "Door 1 unlocked state(1=locked):0",
// "Door 2 unlocked state(1=locked):0"

type Alarm = components["schemas"]["Alarm"];
type DeviceStatus = components["schemas"]["DeviceStatus"];
type Door = components["schemas"]["Door"];

type Mutable<TImmutable> = {
  -readonly [K in keyof TImmutable]: TImmutable[K];
};

type PartialMutable<TImmutable extends { id: string }> = Mutable<
  Partial<TImmutable>
> &
  Pick<TImmutable, "id">;

function createPartialAlarm(index: number): PartialMutable<Alarm> {
  return {
    id: index.toString(),
  };
}

function createPartialDoor(index: number): PartialMutable<Door> {
  return {
    id: index.toString(),
  };
}

export function parseDeviceStatus(lines: readonly string[]) {
  const [alarmLines, doorLines] = lines.reduce<[string[], string[]]>(
    (acc, line) => {
      const destination = line.startsWith("Alarm ") ? acc[0] : acc[1];
      destination.push(line);
      return acc;
    },
    [[], []]
  );

  const alarms = alarmLines.reduce<PartialMutable<Alarm>[]>(
    (acc, line, index) => {
      // Alarms are not given explicit indices; as the ACCX has only one alarm
      // it receives an implicit 0 index.
      // The status output includes two lines for the alarm; one indicating
      // armed state, and one indicating the siren state, so we use the
      // offset into the alarm lines, divided by two, in order to identify the
      // alarm.
      // TODO: FIRMWARE: Give explicit indices to alarms
      const alarmIndex = Math.floor(index / 2);
      const partialAlarm = acc[alarmIndex] || createPartialAlarm(alarmIndex);

      if (line.startsWith("Alarm armed state")) {
        const armedState = line.split(":")[1];

        if (armedState === "0") {
          partialAlarm.armedState = "disarmed";
        } else if (armedState === "1") {
          partialAlarm.armedState = "armed";
        } else if (armedState === "4") {
          partialAlarm.armedState = "chimeOnly";
        }
      } else if (line.startsWith("Alarm siren state") && partialAlarm) {
        const sirenState = line.split(":")[1];

        if (sirenState === "0") {
          partialAlarm.sirenState = "disarmed";
        } else if (sirenState === "1") {
          partialAlarm.sirenState = "activated";
        } else if (sirenState === "2") {
          partialAlarm.sirenState = "delayed";
        }
      }

      acc[alarmIndex] = partialAlarm;

      return acc;
    },
    []
  );

  const doors = doorLines.reduce<PartialMutable<Door>[]>((acc, line) => {
    // let doorIndex: number | undefined = undefined;
    // Doors are referred-to inconsistently
    // TODO: FIRMWARE: Give explicit, consistent indices to doors
    if (line.includes("door open state")) {
      let doorIndex: number | undefined = undefined;
      if (line.startsWith("Front")) {
        doorIndex = 0;
      } else if (line.startsWith("Roll up")) {
        doorIndex = 1;
      }

      if (doorIndex === undefined) {
        return acc;
      }

      const partialDoor = acc[doorIndex] || createPartialDoor(doorIndex);
      const doorOpenState = line.split(":")[1];
      partialDoor.isOpen = doorOpenState !== "0";
      acc[doorIndex] = partialDoor;
    } else if (line.includes("unlocked state")) {
      let doorIndex: number | undefined = undefined;
      if (line.startsWith("Door 1")) {
        doorIndex = 0;
      } else if (line.startsWith("Door 2")) {
        doorIndex = 1;
      }

      if (doorIndex === undefined) {
        return acc;
      }

      const partialDoor = acc[doorIndex] || createPartialDoor(doorIndex);
      const doorLockedState = line.split(":")[1];
      partialDoor.isLocked = doorLockedState === "1";
      acc[doorIndex] = partialDoor;
      return acc;
    }

    return acc;
  }, []);

  return {
    alarms: alarms.filter(isCompleteAlarm),
    doors: doors.filter(isCompleteDoor),
  };
}

function isCompleteAlarm(
  _partialAlarm: PartialMutable<Alarm>
): _partialAlarm is Alarm {
  return true;
}

function isCompleteDoor(
  _partialDoor: PartialMutable<Door>
): _partialDoor is Door {
  return true;
}

function validateDeviceStatus({ alarms, doors }: DeviceStatus): boolean {
  if (alarms.length !== 1) {
    return false;
  }

  if (
    alarms.some((alarm) => {
      return alarm.armedState === undefined || alarm.sirenState === undefined;
    })
  ) {
    return false;
  }

  if (doors.length !== 2) {
    return false;
  }

  if (
    doors.some((door) => {
      return door.isLocked === undefined || door.isOpen === undefined;
    })
  ) {
    return false;
  }

  return true;
}

export default async function getDeviceStatus() {
  const lines: string[] = [];

  return runSession({
    command: DEVICE_STATUS_SHOW,
    onEvent: ({
      data,
      onError,
      onComplete,
    }: {
      data: string;
      onError: () => void;
      onComplete: (deviceStatus: DeviceStatus) => void;
    }) => {
      lines.push(data);
      const deviceStatus = parseDeviceStatus(lines);
      if (validateDeviceStatus(deviceStatus)) {
        onComplete(deviceStatus);
      } else {
        onError();
      }
    },
  });
}

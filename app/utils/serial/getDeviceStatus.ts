import { components } from "../../generated/schema/openapi";
import { runSession } from "./runSession";
import { SHOW_DEVICE_STATUS } from "./constants";

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

function createPartialDoor(doorId: string): PartialMutable<Door> {
  return {
    id: doorId,
  };
}

export default async function getDeviceStatus() {
  const alarms: Alarm[] = [];
  const doors: Door[] = [];
  let partialAlarm: ReturnType<typeof createPartialAlarm> | undefined;
  let partialDoor: ReturnType<typeof createPartialDoor> | undefined;

  return runSession({
    command: SHOW_DEVICE_STATUS,
    onData: (
      onComplete: (deviceStatus: DeviceStatus) => void,
      data: string
    ) => {
      // Accumulate Alarm state
      if (data.startsWith("Alarm armed state")) {
        partialAlarm = createPartialAlarm(alarms.length);
        const armedState = data.split(":")[1];

        if (armedState === "0") {
          partialAlarm.armedState = "disarmed";
        } else if (armedState === "1") {
          partialAlarm.armedState = "armed";
        } else if (armedState === "4") {
          partialAlarm.armedState = "chimeOnly";
        }
      } else if (data.startsWith("Alarm siren state") && partialAlarm) {
        const sirenState = data.split(":")[1];

        if (sirenState === "0") {
          partialAlarm.sirenState = "disarmed";
        } else if (sirenState === "1") {
          partialAlarm.sirenState = "armed";
        } else if (sirenState === "2") {
          partialAlarm.sirenState = "delayed";
        }

        if (partialAlarm.armedState && partialAlarm.sirenState) {
          alarms.push(partialAlarm as Alarm);
          partialAlarm = undefined;
        }
      } else if (data.includes("door open state")) {
        let doorId: string | undefined = undefined;
        if (data.startsWith("Front")) {
          doorId = "0";
        } else if (data.startsWith("Roll up")) {
          doorId = "1";
        }

        if (!doorId) {
          return;
        }

        partialDoor = createPartialDoor(doorId);

        const doorOpenState = data.split(":")[1];
        partialDoor.isOpen = doorOpenState === "0";
      } else if (data.includes("unlocked state") && partialDoor) {
        let doorId: string | undefined = undefined;
        if (data.startsWith("Door 1")) {
          doorId = "0";
        } else if (data.startsWith("Door 2")) {
          doorId = "1";
        }

        if (!doorId) {
          return;
        }

        const doorLockedState = data.split(":")[1];
        partialDoor.isLocked = doorLockedState === "1";

        if (
          partialDoor.isLocked !== undefined &&
          partialDoor.isOpen !== undefined
        ) {
          doors.push(partialDoor as Door);
          partialDoor = undefined;
        }
      }

      if (doors.length === 2) {
        onComplete({
          alarms,
          doors,
        });
      }
    },
  });
}

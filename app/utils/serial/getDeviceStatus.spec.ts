import { parseDeviceStatus } from "./getDeviceStatus";

describe("parseDeviceStatus", () => {
  test.each([
    [
      [
        "Alarm armed state (1=armed):4",
        "Alarm siren state (1=activated):0",
        "Front door open state (0=closed):0",
        "Roll up door open state (0=closed):0",
        "Door 1 unlocked state(1=locked):1",
        "Door 2 unlocked state(1=locked):0",
      ],
      {
        alarms: [
          {
            id: "0",
            armedState: "chimeOnly",
            sirenState: "disarmed",
          },
        ],
        doors: [
          {
            id: "0",
            isLocked: true,
            isOpen: false,
          },
          {
            id: "1",
            isLocked: false,
            isOpen: false,
          },
        ],
      },
    ],

    // Sound-only
    [
      ["Alarm armed state (1=armed):0"],
      {
        alarms: [
          {
            id: "0",
            armedState: "disarmed",
          },
        ],
        doors: [],
      },
    ],
    [
      ["Alarm armed state (1=armed):1"],
      {
        alarms: [
          {
            id: "0",
            armedState: "armed",
          },
        ],
        doors: [],
      },
    ],
    [
      ["Alarm armed state (1=armed):4"],
      {
        alarms: [
          {
            id: "0",
            armedState: "chimeOnly",
          },
        ],
        doors: [],
      },
    ],

    // Siren-only
    [
      ["Alarm siren state (1=activated):0"],
      {
        alarms: [
          {
            id: "0",
            sirenState: "disarmed",
          },
        ],
        doors: [],
      },
    ],
    [
      ["Alarm siren state (1=activated):1"],
      {
        alarms: [
          {
            id: "0",
            sirenState: "activated",
          },
        ],
        doors: [],
      },
    ],
    [
      ["Alarm siren state (1=activated):2"],
      {
        alarms: [
          {
            id: "0",
            sirenState: "delayed",
          },
        ],
        doors: [],
      },
    ],

    // Door isOpen State (Named doors; "Front door" / "Roll up door")
    [
      ["Front door open state (0=closed):0"],
      {
        alarms: [],
        doors: [
          {
            id: "0",
            isOpen: false,
          },
        ],
      },
    ],
    [
      ["Front door open state (0=closed):1"],
      {
        alarms: [],
        doors: [
          {
            id: "0",
            isOpen: true,
          },
        ],
      },
    ],
    [
      ["Roll up door open state (0=closed):0"],
      {
        alarms: [],
        doors: [
          {
            id: "1",
            isOpen: false,
          },
        ],
      },
    ],

    // Door isLocked State (Numbered doors; "Door 1", "Door 2")
    [
      ["Door 1 unlocked state(1=locked):0"],
      {
        alarms: [],
        doors: [
          {
            id: "0",
            isLocked: false,
          },
        ],
      },
    ],
    [
      ["Door 1 unlocked state(1=locked):1"],
      {
        alarms: [],
        doors: [
          {
            id: "0",
            isLocked: true,
          },
        ],
      },
    ],
  ])("should parse lines %j to deviceStatus %j", (lines, deviceStatus) => {
    expect(parseDeviceStatus(lines)).toEqual(deviceStatus);
  });
});

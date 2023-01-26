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
            armed_state: "chimeOnly",
            siren_state: "disarmed",
          },
        ],
        doors: [
          {
            id: "0",
            is_locked: true,
            is_open: false,
          },
          {
            id: "1",
            is_locked: false,
            is_open: false,
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
            armed_state: "disarmed",
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
            armed_state: "armed",
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
            armed_state: "chimeOnly",
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
            siren_state: "disarmed",
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
            siren_state: "activated",
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
            siren_state: "delayed",
          },
        ],
        doors: [],
      },
    ],

    // Door is_open State (Named doors; "Front door" / "Roll up door")
    [
      ["Front door open state (0=closed):0"],
      {
        alarms: [],
        doors: [
          {
            id: "0",
            is_open: false,
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
            is_open: true,
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
            is_open: false,
          },
        ],
      },
    ],

    // Door is_locked State (Numbered doors; "Door 1", "Door 2")
    [
      ["Door 1 unlocked state(1=locked):0"],
      {
        alarms: [],
        doors: [
          {
            id: "0",
            is_locked: false,
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
            is_locked: true,
          },
        ],
      },
    ],
  ])("should parse lines %j to deviceStatus %j", (lines, deviceStatus) => {
    expect(parseDeviceStatus(lines)).toEqual(deviceStatus);
  });
});

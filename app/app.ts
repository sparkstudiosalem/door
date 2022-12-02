import express from "express";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export default function () {
  const sport = new SerialPort({ path: "/dev/ttyAMA0", baudRate: 9600 });
  const parser = new ReadlineParser();
  sport.pipe(parser);

  const lines: string[] = [];

  parser.on("data", (line: string) => {
    lines.push(line);
    console.log(line);
  });

  sport.write("?\n");

  const app = express();

  const port = 3000;

  app.get("/", (_req, res) => {
    res.send(`Hi Dude: ${JSON.stringify(lines, null, 2)}`);
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

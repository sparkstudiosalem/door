import express from "express";
import { SerialPort } from "serialport";
// import { ReadlineParser } from "@serialport/parser-readline";

export default function () {
  const lines: string[] = [];
  const errors: string[] = [];

  const sport = new SerialPort({
    path: "/dev/ttyAMA0",
    baudRate: 9600,
  }, (err) => {
    if (err) {
      errors.push(err.toString());
      console.log(`Encountered an error while opening ttyAMA0 ${err}`);
    }
  });

  // const parser = new ReadlineParser();
  // sport.pipe(parser);

  // parser.on("data", (line: string) => {
  //   lines.push(line);
  //   console.log(line);
  // });

  sport.on("data", (data) => {
    console.log(`Received data directly on the serialport ${data}`);
    lines.push(data);
  });

  sport.on("error", (err) => {
    if (err) {
      errors.push(err.toString());
      console.log(`Encountered an error event from serialport ${err}`);
    }
  });

  setInterval(() => {
    sport.write("?\n", (err) => {
      if (err) {
        errors.push(err.toString());
        console.log(`Encountered an error while writing to ttyAMA0 ${err}`);
      }
    });
  }, 5000);

  const app = express();

  const port = 3000;

  app.get("/", (_req, res) => {
    res.send(`
<html>
  <body>
    <div>Hi Dude</div>
    <pre>${JSON.stringify({ lines, errors }, null, 2)}</pre>
  </body>
</html>`
);
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

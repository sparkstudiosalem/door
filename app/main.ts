import createApp from "./createApp";
import createLogger from "./utils/createLogger";
import initialize from "./utils/serial/serial";

const log = createLogger(__filename);

const app = createApp();

const port = process.env["PORT"] || 3000;

initialize().then(() => {
  app.listen(port, () => {
    log.info(`App listening at http://localhost:${port}`);
  });
});

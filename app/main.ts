import createApp from "./createApp";

const app = createApp();

const port = process.env["PORT"] || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

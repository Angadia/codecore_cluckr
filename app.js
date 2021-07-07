const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const clucksRouter = require("./routes/clucks");
const rootRouter = require("./routes/root");

const app = express();

// setup view engine
app.set("view engine", "ejs");

// setup logger
app.use(logger("dev"));

// setup cookie-parser
app.use(cookieParser());

// epxress.urlencoded is used to parse the form inputs into a "body" property in our `req` object
app.use(express.urlencoded({ extended: true }));

// The static assets middleware will take all the files and directories
// at specified path and serve them publicly with their own URL
app.use(express.static(path.join(__dirname, 'public')));
// The above line connects our 'public' directory to express

app.use("/clucks", clucksRouter);
app.use("/", rootRouter);

// tells express to spinup a http server and listen at localhost:3000
const PORT = 3000;
const ADDRESS = "localhost";
app.listen(PORT, ADDRESS, () => {
  console.log(`listening on ${ADDRESS}:${PORT}`);
});
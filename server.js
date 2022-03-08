require("dotenv").config();

const needEnv = {
  SPHINX_DB_URL: null,
  SPHINX_TOKEN_KEY: null,
  EMAIL_USERNAME: null,
  EMAIL_PASSWORD: null,
};

Object.keys(needEnv).forEach((env_name) => {
  if (!process.env[env_name]) {
    if (needEnv[env_name] === null) {
      throw new Error("You need to provide the env variable " + env_name);
    }

    process.env[env_name] = needEnv[env_name];
    console.log(
      "Env variable " +
        env_name +
        " has been automaticly set to " +
        needEnv[env_name]
    );
  }
});

const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);

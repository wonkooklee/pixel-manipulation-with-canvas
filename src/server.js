const liveServer = require("live-server");

const params = {
  port: 4000,
  host: "0.0.0.0",
  open: true,
  root: "src",
};

liveServer.start(params);

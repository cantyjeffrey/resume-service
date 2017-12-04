const cors = require("micro-cors")();
const { router, get } = require("microrouter");
const handlers = require("./handlers");

module.exports = cors(
  router(get("/", handlers.index), get("/ping", handlers.ping))
);

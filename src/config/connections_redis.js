// const redis = require("redis");
// const client = redis.createClient({
//   port: 6379,
//   host: "127.0.0.1",
// });

// client.ping((err, pong) => {
//   console.log(pong);
// });

// module.exports = client;
const { createClient } = require("redis");
const redisConfig = require("./redis.config");

const env = process.env.NODE_ENV;
const config = redisConfig[env];

const client = createClient({
  socket: {
    host: config.host,
    port: config.port,
  },
  password: config.password,
});

// Handle connection events
client.on("error", (err) => console.error("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));
client.on("ready", () => console.log("Redis Client Ready"));

// Connect to Redis
(async () => {
  try {
    await client.connect();
    // Test connection
    const ping = await client.ping();
    console.log("Redis PING response:", ping);
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = client;

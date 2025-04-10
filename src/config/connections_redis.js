const { createClient } = require("redis");
const redisConfig = require("./redis.config");

let isRedisConnected = false;

const env = process.env.NODE_ENV;
const config = redisConfig[env];

const client = createClient({
  socket: {
    host: config.host,
    port: config.port,
    reconnectStrategy: (retries) => {
      // Maximum retry delay of 30 seconds
      const delay = Math.min(retries * 1000, 30000);
      console.log(`Redis retrying connection in ${delay}ms...`);
      return delay;
    },
  },
  password: config.password,
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
  isRedisConnected = false;
});

client.on("connect", () => {
  console.log("Redis Client Connected");
  isRedisConnected = true;
});

client.on("ready", () => console.log("Redis Client Ready"));

client.on("end", () => {
  console.log("Redis connection closed");
  isRedisConnected = false;
});

// Custom method to safely execute Redis operations
const safeRedisOperation = async (operation, fallbackValue = null) => {
  if (!isRedisConnected) {
    console.log("Redis not connected, using fallback");
    return fallbackValue;
  }

  try {
    return await operation();
  } catch (error) {
    console.error("Redis operation failed:", error.message);
    return fallbackValue;
  }
};

// Attempt to connect only once at startup
(async () => {
  try {
    await client.connect();
    const ping = await client.ping();
    console.log("Redis PING response:", ping);
  } catch (err) {
    console.error(
      "Failed to connect to Redis, continuing without Redis:",
      err.message
    );
    // Application will continue without Redis
  }
})();

// Export the client with extended functionality
module.exports = {
  client,
  isConnected: () => isRedisConnected,
  safeSet: async (key, value, options) =>
    safeRedisOperation(
      async () => await client.set(key, value, options),
      false
    ),
  safeGet: async (key) =>
    safeRedisOperation(async () => await client.get(key), null),
  safeDel: async (key) =>
    safeRedisOperation(async () => await client.del(key), 0),
};

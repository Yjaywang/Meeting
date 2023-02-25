const redis = require("ioredis");
const redisClient = redis.createClient();
const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION;

redisClient.on("connect", () => {
  console.log("connected to redis successfully!");
});

redisClient.on("error", (error) => {
  console.log("Redis connection error :", error);
});

//cache logic
function getOrSetCache(key, callBack) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) {
        return reject(error);
      }
      if (data != null) {
        //cache has data
        return resolve(JSON.parse(data));
      }
      const freshData = await callBack();
      redisClient.set(key, JSON.stringify(freshData), "EX", DEFAULT_EXPIRATION);
      resolve(freshData);
    });
  });
}

module.exports = {
  redisClient,
  getOrSetCache,
};

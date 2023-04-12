const redis = require("ioredis");
const redisClient = redis.createClient(6379, process.env.elasticache);
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

//clean cache logic if leave or off meeting
function leaveAndCleanCache(key) {
  redisClient.del(key);
}

//update cache
function updateCache(key, dataObject) {
  redisClient.set(key, JSON.stringify(dataObject), "EX", DEFAULT_EXPIRATION);
}

module.exports = {
  redisClient,
  getOrSetCache,
  leaveAndCleanCache,
  updateCache,
};

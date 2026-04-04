import Redis from "ioredis";

const redisClient = new Redis(6379, process.env.elasticache as string);
const DEFAULT_EXPIRATION = parseInt(process.env.DEFAULT_EXPIRATION || "3600", 10);

redisClient.on("connect", () => {
  console.log("connected to redis successfully!");
});

redisClient.on("error", (error) => {
  console.log("Redis connection error :", error);
});

export function getOrSetCache<T>(
  key: string,
  callBack: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) {
        return reject(error);
      }
      if (data != null) {
        return resolve(JSON.parse(data));
      }
      const freshData = await callBack();
      redisClient.set(key, JSON.stringify(freshData), "EX", DEFAULT_EXPIRATION);
      resolve(freshData);
    });
  });
}

export function leaveAndCleanCache(key: string): void {
  redisClient.del(key);
}

export function updateCache(key: string, dataObject: unknown): void {
  redisClient.set(key, JSON.stringify(dataObject), "EX", DEFAULT_EXPIRATION);
}

export { redisClient };

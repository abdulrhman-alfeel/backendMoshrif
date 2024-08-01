const redis = require("redis");
const client = redis.createClient({url:" redis://default:Zqg8w3jUpxnZO5vJOYOiH8ff2v0Thsll@redis-18508.c302.asia-northeast1-1.gce.redns.redis-cloud.com:18508"});

(async () => {
    await client.connect();
})();
client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

// client.quit();
module.exports = client;

const config = {
  port: 8080,
  corsOrigins: ["https://mushrf.com"],
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
  apiBaseUrl: "https://mushrf.com",
  worker: { concurrency: 2 },
  storage: { path: "upload" },
  cleanupTempFiles: true,
};

module.exports=  config;

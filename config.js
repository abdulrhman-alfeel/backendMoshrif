const config = {
  port: 8080,
  corsOrigins: ["http://localhost:8080"],
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
  apiBaseUrl: "http://localhost:8080",
  worker: { concurrency: 2 },
  storage: { path: "upload" },
  cleanupTempFiles: true,
};

module.exports=  config;

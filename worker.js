const {initializeWorker} = require('./function/chate/workersUpload/uploadWorker.js');
const config = require('./config');
// Run only the worker
(async function() {
  console.log('Starting upload worker process');
  const worker = initializeWorker(config);
  
  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Worker shutting down');
    await worker.close();
    process.exit(0);
  });
})();
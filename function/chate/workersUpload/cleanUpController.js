
const path = require('path');
const fs = require('fs').promises;
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');
const MAX_TEMP_STORAGE = 100 * 1024 * 1024 * 1024; // 100GB

// Helper for creating file paths
const getChunkPath = (fileId, chunkIndex) => path.join(TEMP_UPLOAD_DIR, `${fileId}_${chunkIndex}`);

// Get total directory size
const getDirSize = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) totalSize += stats.size;
    }

    return totalSize;
  } catch (err) {
    console.error(`Error getting directory size: ${err}`);
    return 0;
  }
};

// Get upload manifests sorted by last modified (oldest first)
const getUploadManifests = async () => {
  try {
    const files = await fs.readdir(TEMP_UPLOAD_DIR);
    const manifests = [];

    for (const file of files) {
      if (!file.endsWith('_manifest.json')) continue;

      const filePath = path.join(TEMP_UPLOAD_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const manifest = JSON.parse(content);

      // Skip completed uploads (no chunks to clean)
      if (manifest.status === 'completed') continue;
      // Skip 0 chunks manifest
      if (manifest.receivedChunks.length === 0) continue;

      const stats = await fs.stat(filePath);
      manifests.push({ filePath, lastModified: stats.mtimeMs });
    }

    return manifests.sort((a, b) => a.lastModified - b.lastModified);
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    return [];
  }
};

// Delete a file safely
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting ${filePath}:`, err);
  }
};

// Delete files associated with an upload
const deleteUploadFiles = async (manifestPath) => {
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Delete all chunks
    for (let i = 0; i < manifest.receivedChunks.length; i++) {
      const chunkPath = getChunkPath(manifest.fileId, i);
      await deleteFile(chunkPath);
    }

    // Remove all chunks from manifest
    manifest.receivedChunks = [];
    manifest.lastUpdated = Date.now();
    // Save updated manifest
    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  } catch (err) {
    console.error(`Error deleting upload files for manifest: ${manifestPath}`, err);
  }
};

// Main cleanup function
const performCleanup = async () => {
  console.log('Starting temp file cleanup process');

  try {
    await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });

    let totalSize = await getDirSize(TEMP_UPLOAD_DIR);
    console.log(`Current temp storage usage: ${(totalSize / (1024 * 1024 * 1024)).toFixed(2)}GB`);

    if (totalSize <= MAX_TEMP_STORAGE) {
      console.log('Storage usage is within the limit, no cleanup needed.');
      return;
    }

    let manifests = await getUploadManifests();

    let deletedFiles = 0;

    for (const { filePath } of manifests) {
      if (totalSize <= MAX_TEMP_STORAGE) break;

      await deleteUploadFiles(filePath);

      // Update total size
      totalSize = await getDirSize(TEMP_UPLOAD_DIR);
      deletedFiles++;
    }

    console.log(`Cleanup completed. Deleted ${deletedFiles} uploads.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

module.exports = { performCleanup };

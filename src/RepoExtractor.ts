import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import unzipper from 'unzipper';

export default async function extractRepo(
  githubUrl: string,
  outputPath: string,
) {
  const zipPath = path.join(outputPath, 'repo.zip');

  const response = await axios({
    url: githubUrl + '/archive/refs/heads/main.zip',
    method: 'GET',
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(zipPath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  fs.createReadStream(zipPath)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const filePath = path.join(
        outputPath,
        entry.path.replace(/^[^/]+\/(.*)/, '$1'),
      );

      if (entry.type === 'Directory') {
        fs.mkdirSync(filePath, { recursive: true });
      } else {
        entry.pipe(fs.createWriteStream(filePath));
      }
    })
    .on('close', () => {
      console.log('Extraction complete');
      fs.unlinkSync(zipPath);
    })
    .on('error', (err) => {
      console.error('Failed to extract ZIP:', err);
    });
}

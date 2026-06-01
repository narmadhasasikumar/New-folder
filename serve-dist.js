import http from 'http';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 4174;
const distDir = path.resolve(process.cwd(), 'dist');

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(distDir, urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Serve SPA entrypoint for client-side routes
      fs.readFile(path.join(distDir, 'index.html'), (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexData);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Serving dist at http://localhost:${port}`);
});

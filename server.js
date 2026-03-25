// 简单的HTTP服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const publicDir = path.join(__dirname);

const server = http.createServer((req, res) => {
  // 处理请求路径
  let filePath = path.join(publicDir, req.url);
  
  // 忽略Vite客户端路径
  if (req.url.includes('@vite')) {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end('// Vite client not available', 'utf-8');
    return;
  }
  
  try {
    // 检查文件是否存在
    const stats = fs.statSync(filePath);
    
    // 如果是目录，默认加载index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // 读取文件
    const content = fs.readFileSync(filePath);

    // 设置Content-Type
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.mp3':
      case '.m4a':
        contentType = 'audio/mpeg';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  } catch (err) {
    // 处理404错误
    res.writeHead(404);
    res.end('File not found');
    return;
  }
});

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});

console.log(`启动服务器...`);
console.log(`访问地址: http://localhost:${PORT}`);
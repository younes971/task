// src/index.js
import http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

// sample in-memory data
let items = [
  {id: 1, name: 'couch'},
  {id: 2, name: 'table'},
  {id: 3, name: 'chair'},
];

const server = http.createServer((req, res) => {
  // GET /items -> return list of items
  if (req.url === '/items' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(items));
  }

  // POST /items -> add new item
  else if (req.url === '/items' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newItem = JSON.parse(body);
      items.push(newItem);
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({message: 'Item added', items}));
    });
  }

  // DELETE /items/:id -> remove item (dummy)
  else if (req.url.startsWith('/items/') && req.method === 'DELETE') {
    const parts = req.url.split('/');
    const idStr = parts[2]; // id from /items/<id>
    const id = Number(idStr);

    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Item not found'}));
    } else {
      items.splice(idx, 1);
      res.writeHead(204, {'Content-Type': 'application/json'});
      res.end();
    }
  }

  // PUT /items/:id -> modify item
  else if (req.url.startsWith('/items/') && req.method === 'PUT') {
    const parts = req.url.split('/');
    const id = Number(parts[2]);

    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Item not found'}));
    } else {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const updatedData = JSON.parse(body);
        items[idx] = {...items[idx], ...updatedData}; // merge updates
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Item updated', item: items[idx]}));
      });
    }
  }

  // GET /hello -> simple welcome message
  else if (req.url === '/hello' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Hello and Welcome!'}));
  }

  // fallback for other routes
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

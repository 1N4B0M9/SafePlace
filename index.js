const { MongoClient } = require("mongodb");
const http = require('http');
const fs = require('fs');
const path = require('path');


// MongoDB connection string
const uri = "mongodb+srv://2005nathan2005:NOiaiXkLH9FbKxyo@safespace.bbqvc.mongodb.net/?retryWrites=true&w=majority&appName=SafeSpace";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('UserData');
    // Ensure the database is connected for future operations
  } catch (err) {
    console.error(err);
  }
}

run();

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error reading file.\n');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/reports.html') {
    const filePath = path.join(__dirname, 'public', 'reports.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error reading file.\n');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/reporting.html') {
    const filePath = path.join(__dirname, 'public', 'reporting.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error reading file.\n');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  else if (req.url === '/reports' && req.method === 'GET') {
    try {
      const database = client.db('UserData');
      const reports = await database.collection('UserDataCollection').find({}).toArray();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(reports));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Error fetching reports.\n');
    }
  } else if (req.url === '/report' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    req.on('end', async () => {
      try {
        const reportData = JSON.parse(body);
        const database = client.db('UserData');
        await database.collection('UserDataCollection').insertOne(reportData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Report submitted successfully!' }));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error saving report.\n');
      }
    });
  } else if (req.url.endsWith('.css')) { // Handle CSS files
    const filePath = path.join(__dirname, 'public', req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found\n');
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else {
    // Handle 404 for any other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
  }
});

// Listen on port 3000
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
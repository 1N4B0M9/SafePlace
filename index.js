require('dotenv').config();
const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');

// MongoDB configuration from environment variables
const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE || 'UserData';
const collectionName = process.env.MONGODB_COLLECTION || 'UserDataCollection';

let client;

async function connectToDatabase() {
  if (!client) {
    try {
      // Check if MongoDB URI is properly configured
      if (!uri || uri === 'mongodb_uri' || uri === '') {
        console.warn('MongoDB URI not configured, running in development mode');
        return null;
      }
      
      client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      // Don't throw error, return null to allow graceful fallback
      return null;
    }
  }
  return client;
}

// Helper function to read static files
function readStaticFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, 'public', filePath));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Main handler function for Vercel
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Handle static file requests
    if (req.url === '/' || req.url === '/index.html') {
      const data = readStaticFile('index.html');
      if (data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    if (req.url === '/reports.html') {
      const data = readStaticFile('reports.html');
      if (data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    if (req.url === '/about.html') {
      const data = readStaticFile('about.html');
      if (data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    if (req.url === '/reporting.html') {
      const data = readStaticFile('reporting.html');
      if (data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    if (req.url === '/style.css') {
      const data = readStaticFile('style.css');
      if (data) {
        res.setHeader('Content-Type', 'text/css');
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    if (req.url === '/test-maps.html') {
      const data = readStaticFile('test-maps.html');
      if (data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    // Handle API endpoints
    if (req.url === '/api/reports' && req.method === 'GET') {
      try {
        const dbClient = await connectToDatabase();
        if (!dbClient) {
          // MongoDB not available, return empty array
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
          return;
        }
        
        const database = dbClient.db(databaseName);
        const reports = await database.collection(collectionName).find({}).toArray();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(reports));
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Return empty array for development when DB is not available
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([]));
      }
      return;
    }

    if (req.url === '/api/report' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const reportData = JSON.parse(body);
          const dbClient = await connectToDatabase();
          
          if (!dbClient) {
            // MongoDB not available, return success message
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
            return;
          }
          
          const database = dbClient.db(databaseName);
          await database.collection(collectionName).insertOne(reportData);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Report submitted successfully!' }));
        } catch (error) {
          console.error('Error saving report:', error);
          // For development, return success even if DB is not available
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
        }
      });
      return;
    }

    // Handle legacy routes for backward compatibility
    if (req.url === '/reports' && req.method === 'GET') {
      try {
        const dbClient = await connectToDatabase();
        if (!dbClient) {
          // MongoDB not available, return empty array
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
          return;
        }
        
        const database = dbClient.db(databaseName);
        const reports = await database.collection(collectionName).find({}).toArray();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(reports));
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Return empty array for development when DB is not available
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([]));
      }
      return;
    }

    if (req.url === '/report' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const reportData = JSON.parse(body);
          const dbClient = await connectToDatabase();
          
          if (!dbClient) {
            // MongoDB not available, return success message
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
            return;
          }
          
          const database = dbClient.db(databaseName);
          await database.collection(collectionName).insertOne(reportData);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Report submitted successfully!' }));
        } catch (error) {
          console.error('Error saving report:', error);
          // For development, return success even if DB is not available
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
        }
      });
      return;
    }

    // 404 for any other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  const http = require('http');
  const port = process.env.PORT || 3000;
  
  const server = http.createServer(module.exports);
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

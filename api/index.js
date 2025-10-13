// Module initialization logging
console.log('SafePlace serverless function initializing...');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');

console.log('Dependencies loaded successfully');

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
      
      console.log('Attempting to connect to MongoDB...');
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000
      });
      await client.connect();
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      console.error('MongoDB connection error details:', error);
      // Don't throw error, return null to allow graceful fallback
      client = null; // Reset client on error
      return null;
    }
  }
  return client;
}

// Helper function to read static files
function readStaticFile(filePath) {
  try {
    // Use process.cwd() for Vercel compatibility instead of __dirname
    const basePath = process.env.VERCEL ? process.cwd() : __dirname;
    return fs.readFileSync(path.join(basePath, 'public', filePath));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Main handler function for Vercel
module.exports = async (req, res) => {
  // Basic validation
  if (!req || !res) {
    console.error('Invalid request or response object');
    return;
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Vercel environment:', process.env.VERCEL);
  
  // Set timeout to prevent hanging
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('Request timeout');
      res.writeHead(504, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request timeout' }));
    }
  }, 25000); // 25 second timeout

  // Helper function to clear timeout and send response
  const sendResponse = (statusCode, headers, body) => {
    clearTimeout(timeout);
    if (!res.headersSent) {
      res.writeHead(statusCode, headers);
      res.end(body);
    }
  };

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    sendResponse(200, {}, '');
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/api/health') {
    sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV 
    }));
    return;
  }

  try {
    // Handle static file requests
    if (req.url === '/' || req.url === '/index.html') {
      const data = readStaticFile('index.html');
      if (data) {
        sendResponse(200, { 'Content-Type': 'text/html' }, data);
      } else {
        sendResponse(404, { 'Content-Type': 'text/plain' }, 'File not found');
      }
      return;
    }

    if (req.url === '/reports.html') {
      const data = readStaticFile('reports.html');
      if (data) {
        sendResponse(200, { 'Content-Type': 'text/html' }, data);
      } else {
        sendResponse(404, { 'Content-Type': 'text/plain' }, 'File not found');
      }
      return;
    }

    if (req.url === '/about.html') {
      const data = readStaticFile('about.html');
      if (data) {
        sendResponse(200, { 'Content-Type': 'text/html' }, data);
      } else {
        sendResponse(404, { 'Content-Type': 'text/plain' }, 'File not found');
      }
      return;
    }

    if (req.url === '/reporting.html') {
      const data = readStaticFile('reporting.html');
      if (data) {
        sendResponse(200, { 'Content-Type': 'text/html' }, data);
      } else {
        sendResponse(404, { 'Content-Type': 'text/plain' }, 'File not found');
      }
      return;
    }

    if (req.url === '/style.css') {
      const data = readStaticFile('style.css');
      if (data) {
        sendResponse(200, { 'Content-Type': 'text/css' }, data);
      } else {
        sendResponse(404, { 'Content-Type': 'text/plain' }, 'File not found');
      }
      return;
    }

    if (req.url === '/test-maps.html') {
      const data = readStaticFile('test-maps.html');
      if (data) {
        sendResponse(200, { 'Content-Type': 'text/html' }, data);
      } else {
        sendResponse(404, { 'Content-Type': 'text/plain' }, 'File not found');
      }
      return;
    }

    // Handle API endpoints
    if (req.url === '/api/reports' && req.method === 'GET') {
      try {
        const dbClient = await connectToDatabase();
        if (!dbClient) {
          // MongoDB not available, return empty array
          sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify([]));
          return;
        }
        
        const database = dbClient.db(databaseName);
        const reports = await database.collection(collectionName).find({}).toArray();
        sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify(reports));
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Return empty array for development when DB is not available
        sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify([]));
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
            sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
            return;
          }
          
          const database = dbClient.db(databaseName);
          await database.collection(collectionName).insertOne(reportData);
          sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ message: 'Report submitted successfully!' }));
        } catch (error) {
          console.error('Error saving report:', error);
          // For development, return success even if DB is not available
          sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
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
          sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify([]));
          return;
        }
        
        const database = dbClient.db(databaseName);
        const reports = await database.collection(collectionName).find({}).toArray();
        sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify(reports));
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Return empty array for development when DB is not available
        sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify([]));
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
            sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
            return;
          }
          
          const database = dbClient.db(databaseName);
          await database.collection(collectionName).insertOne(reportData);
          sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ message: 'Report submitted successfully!' }));
        } catch (error) {
          console.error('Error saving report:', error);
          // For development, return success even if DB is not available
          sendResponse(200, { 'Content-Type': 'application/json' }, JSON.stringify({ message: 'Report submitted successfully! (Development mode - not saved to database)' }));
        }
      });
      return;
    }

    // 404 for any other routes
    sendResponse(404, { 'Content-Type': 'text/plain' }, '404 Not Found');

  } catch (error) {
    console.error('Server error:', error);
    console.error('Error stack:', error.stack);
    
    // Ensure response hasn't been sent already
    if (!res.headersSent) {
      clearTimeout(timeout);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal Server Error', 
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong' 
      }));
    }
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

console.log('SafePlace serverless function module loaded successfully');

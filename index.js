/*const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb+srv://2005nathan2005:NOiaiXkLH9FbKxyo@safespace.bbqvc.mongodb.net/?retryWrites=true&w=majority&appName=SafeSpace";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('UserData');
    //const movies = database.collection('movies');
    // Query for a movie that has the title 'Back to the Future'
    //const query = { title: 'Back to the Future' };
   //const movie = await movies.findOne(query);
   // console.log(movie);
    var myobj = { incident: "help", location: "Highway 37" };
    database.collection("UserDataCollection").insertOne(myobj);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

//run().catch(console.dir);

function getInformation(incident, location){
    this.incident = incident;
    this.location = location;
   

}


// Import necessary modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a server
const server = http.createServer((req, res) => {
  // Handle request for the root URL
  if (req.url === '/') {
    // Specify the path to the index.html file
    const filePath = path.join(__dirname, 'public', 'index.html');

    // Read the file and send it as a response
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file.\n');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
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


function submitCrime() {
  // Get the values from the form
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  if (!lat || !lng || !description || !date || !category) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  // Ideally, here you would send the data to your backend to save it in a database.
  console.log('Hate crime reported:', {
    lat: lat,
    lng: lng,
    description: description,
    date: date,
    category: category
  });
window.submitCrime = submitCrime;



  

  // Clear form and hide it
  document.getElementById('crime-form').reset();
  document.getElementById('crime-form').style.display = 'none';
}
*/
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

// Create a server
const server = http.createServer(async (req, res) => {
  // Handle request for the root URL
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file.\n');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/report' && req.method === 'POST') {
    let body = '';

    // Collect data from the request
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    req.on('end', async () => {
      try {
        const reportData = JSON.parse(body);

        // Insert the report into the MongoDB collection
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
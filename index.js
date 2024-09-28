const { MongoClient } = require("mongodb");
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

run().catch(console.dir);

function getInformation(incident, location){
    this.incident = incident;
    this.location = location;
   

}





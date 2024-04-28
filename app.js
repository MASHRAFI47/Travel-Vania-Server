const express = require('express');
const app = express();

require("dotenv").config()

//cors
const cors = require('cors');
app.use(cors())

//form urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iduz7rm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const touristSpotsDB = client.db("touristSpotsDB");
        const touristSpotsCollection = touristSpotsDB.collection("touristSpotsCollection");
        const usersCollection = touristSpotsDB.collection("usersCollection");
        const countriesCollection = touristSpotsDB.collection("countriesCollection");

        app.get('/tourists', async (req, res) => {
            const cursor = touristSpotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotsCollection.findOne(query);
            res.send(result)
        })

        app.post('/tourists', async (req, res) => {
            const newTouristSpot = req.body;
            const result = await touristSpotsCollection.insertOne(newTouristSpot)
            res.send(result)
        })

        app.put('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const tourist = req.body;
            const updateTourist = {
                $set: {
                    imageURL: tourist.imageURL,
                    tourists_spot_name: tourist.tourists_spot_name,
                    country_Name: tourist.country_Name,
                    location: tourist.location,
                    short_description: tourist.short_description,
                    average_cost: tourist.average_cost,
                    seasonality: tourist.seasonality,
                    travel_time: tourist.travel_time,
                    totalVisitorsPerYear: tourist.totalVisitorsPerYear
                }
            }
            const result = await touristSpotsCollection.updateOne(query, updateTourist, options)
            res.send(result)
        })

        app.delete('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotsCollection.deleteOne(query);
            res.send(result)
        })


        // app.get('/tourists/sorting', async (req, res) => {
        //     const cursor = touristSpotsCollection.find().sort({average_cost:-1});
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })



        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })




        //get individual data for individual users
        app.get('/myProduct/:email', async (req, res) => {
            const result = await touristSpotsCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        

        //countries

        app.get('/countries', async(req, res) => {
            const cursor = countriesCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        // app.post('/countries', async(req, res) => {
        //     const country = req.body;
        //     const result = await countriesCollection.insertOne(country);
        //     res.send(result)
        // })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("hello world")
})

module.exports = app;
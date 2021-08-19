const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { MongoClient, ObjectId } = require('mongodb');

require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.60vos.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload())


app.get("/", (req, res)=>{
    res.send("Hello")
})




client.connect(err => {
  const appointmentCollection = client.db("doctorPortal").collection("appointments");
  
  app.post("/addAppointment", (req, res)=>{
     const appointment = req.body;
     appointmentCollection.insertOne(appointment)
     .then(result => {
         res.send(result.acknowledged)
     })
  })

  app.post("/appointmentsByDate", (req, res)=>{
    const appointmentDate = req.body;
    appointmentCollection.find({date: appointmentDate.date})
    .toArray((err, documents)=>{
        res.send(documents)
    })
  })
 
  console.log("connected")
});

app.post("/addADoctor", (req, res)=>{
   const file = req.files.file;
   const name = req.body.name;
   const email = req.body.email;
   console.log(name, file, email);
   
   file.mv(`${__dirname}/doctors/${file.name}`, err =>{

      if(err){
        console.log(err)
        return res.status(500).send({message: "Failed to upload image"})
      }
      res.send({name: file.name, path: `${file.name}`})
   })

})


app.listen(process.env.PORT || 5000)


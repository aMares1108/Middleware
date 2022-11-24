// Mares
// Gabriel
// Fernanda
// Liz

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var express = require('express') //llamamos a Express
var app = express();

const uri = `mongodb+srv://${process.env['MONGOUSER']}:${process.env['MONGOPASS']}@cluster-sd.uhhmbgs.mongodb.net/?retryWrites=true&w=majority`;

app.get('/:id', async function(req, res) {

  const client = new MongoClient(uri);
  const database = client.db("Starlink-MW");
  const multimedia = database.collection("Multimedia");
    try {
        // Connect to the MongoDB cluster
         await client.connect();

        // Make the appropriate DB calls

        res.json({document: await get_id(multimedia,req.params.id)}) ;

    } catch (e) {
        //console.error(e);
        res.json({ ERROR: e})
    } finally {
        await client.close();
    }
})

app.put('/put', function(req, res) {
  res.json({ mensaje: 'Método delete' })
})

app.post('/post', function(req, res) {
  res.json({ mensaje: 'Método post' })
})

app.delete('/del', function(req, res) {
  res.json({ mensaje: 'Método delete' })
})

app.listen(3000, () => {
  console.log('server started');
});

async function get(multimedia) {
  try {

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      //sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      //projection: { _id: 0, title: 1, imdb: 1 },
    };

    const cursor = await multimedia.find();

    // replace console.dir with your callback to access individual elements
    await cursor.forEach(console.dir);
  } finally {
    //await client.close();
  }
}

function iterateFunc(doc) {
  console.log(JSON.stringify(doc, null, 4));
}

function errorFunc(error) {
  console.log(error);
}

async function get_id(multimedia, id) {
  try {

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      //sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      //projection: { _id: 0, title: 1, imdb: 1 },
    };

    const result = await multimedia.findOne({
      "ID_archivo": id
    });

    if (result) {
      console.log(`Found a listing in the collection with the name '${id}':`);
      console.log(result);
      return result;

    } else {
      console.log(`No listings found with the name '${id}'`);
    }
  } finally {
    //await client.close();
  }
}

async function post(multimedia, doc) {
  try {
    // create a document to insert
    /*const doc = {
      name: "Cerveza",
      description: "Record of a Shriveled Datum",
    }*/
    const result = await multimedia.insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    get_id(multimedia, doc.ID_archivo);
  } finally {
    //await client.close();
  }
}

async function del(multimedia, query) {
  try {

    // Query for a movie that has title "Annie Hall"
    //const query = { name: "Refreso" };

    const result = await multimedia.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  } finally {
    //await client.close();
  }
}

async function update(multimedia, id, update_params) {
  try {

    // create a filter for a movie to update
    const filter = { ID_archivo: id };

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    // create a document 
    const updateDoc = {
      $set:
        update_params
      ,
    };

    const result = await multimedia.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
    get_id(multimedia, id);
  } finally {
    //await client.close();
  }
}

/*async function run() {
  
  try {

    
    client.connect();

     get(multimedia);
     get_id(multimedia, 'bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze');

    let document = {
      "Dialecto": "Tzotzil",
      "Tipo_de_archivo": ".pdf",
      "Descripcion": { "Espaniol": "Hola", "Italiano": "ciao" },
      "ID_archivo": "asdfaiuyhcbdulnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze",
      "Tamanio": { "$numberInt": "10" },
      "Usuario": "Gabriel",
      "Fecha": "28/09/2010",
      "Thumbnail": "https://upload.wikimedia.org/wikipedia/commons.pdf"
    }

     post(multimedia, document);
     update(multimedia, "asdfaiuyhcbdulnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze", { Dialecto: "Italiano" })
     del(multimedia, { "ID_archivo": "asdfaiuyhcbdulnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze" });
  } finally {
     client.close();
  }
}*/
//run().catch(console.dir);

//{"Dialecto":"Tzotzil",
//"Tipo_de_archivo":".jpg",
//"Descripcion":{"Espaniol":"Adios","Tzotzil":"banmeabi"},
//"ID_archivo":"bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze",
//"Tamanio":{"$numberInt":"3"},
//"Usuario":"Mares",
//"Fecha":"23/09/2020",
//"Thumbnail":"https://alertachiapas.com/wp-content/uploads/2017/11/WhatsApp-Image-2017-11-08-at-5.33.20-PM.jpeg"}
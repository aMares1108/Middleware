// Mares
// Gabriel
// Fernanda
// Liz

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var express = require('express'); //llamamos a Express
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env['MONGOUSER']}:${process.env['MONGOPASS']}@cluster-sd.uhhmbgs.mongodb.net/?retryWrites=true&w=majority`;

app.get('/test', async function(req, res){
  res.json({
    query: req.query
  });
})

app.post('/test', (req, res) => {
  res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
})

app.delete('/test', async function(req,res){
  res.json({
    body: req.body,
    query: req.query
  })
})

app.put('/test', async function(req,res){
  res.json({
    body: req.body,
    query: req.query
  })
})

app.get('/', async function(req, res) {

  const client = new MongoClient(uri);
  const database = client.db("Starlink-MW");
  const multimedia = database.collection("Multimedia");
    try {
        // Connect to the MongoDB cluster
         await client.connect();

        // Make the appropriate DB calls
        //await multimedia.insertMany(     [{"_id":"63766bb123b230284baa64c4","Dialecto":"Tzotzil","Tipo_de_archivo":".jpg","Descripcion":{"Espaniol":"Adios","Tzotzil":"banmeabi"},"ID_archivo":"bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtj","Tamanio":3,"Usuario":"Mares","Fecha":"23/09/2020","Thumbnail":"https://alertachiapas.com/wp-content/uploads/2017/11/WhatsApp-Image-2017-11-08-at-5.33.20-PM.jpeg"},{"_id":"637fa5b04604ed09503eb49c","Dialecto":"Tzotzil","Tipo_de_archivo":".pdf","Descripcion":{"Espaniol":"Hola","Italiano":"ciao"},"ID_archivo":"asdfaiuyhcbdulnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze","Tamanio":{"$numberInt":"10"},"Usuario":"Gabriel","Fecha":"28/09/2010","Thumbnail":"https://upload.wikimedia.org/wikipedia/commons.pdf"},{"_id":"63a30eba67d8c3b6014ae256","Dialecto":"Maya","Tipo_de_archivo":".jpg","Descripcion":{"Espaniol":"adios","Maya":"tak ti' uláak' k 'iin"},"ID_archivo":"ahbcsio8eyr7fjmvfwoi48hnfriwfefyb7v","Tamanio":9,"Usuario":"Mares","Fecha":"21/12/2022","Thumbnail":"https://alertachiapas.com/wp-content/uploads/2017/11/WhatsApp-Image-2017-11-08-at-5.33.20-PM.jpeg"},{"_id":"63a30f481119ba64be6beb44","Dialecto":"Maya","Tipo_de_archivo":".jpg","Descripcion":{"Espaniol":"adios","Maya":"tak ti' uláak' k 'iin"},"ID_archivo":"ahbcsio8eyr7fjmvfwoi48hnfriwfefyb7v","Tamanio":9,"Usuario":"Mares","Fecha":"21/12/2022","Thumbnail":"https://alertachiapas.com/wp-content/uploads/2017/11/WhatsApp-Image-2017-11-08-at-5.33.20-PM.jpeg"},{"_id":"63a30fa39df0df373fea93cb","Dialecto":"Maya","Tipo_de_archivo":".jpg","Descripcion":{"Espaniol":"adios","Maya":"tak ti' uláak' k 'iin"},"ID_archivo":"ahbcsio8eyr7fjmvfwoi48hnfriwfefyb7v","Tamanio":9,"Usuario":"Mares","Fecha":"21/12/2022","Thumbnail":"https://alertachiapas.com/wp-content/uploads/2017/11/WhatsApp-Image-2017-11-08-at-5.33.20-PM.jpeg"}])

        res.json({documents: await get(multimedia)}) ;
    } catch (e) {
        //console.error(e);
        res.json({ ERROR: e})
    } finally {
        await client.close();
    }
})

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

app.put('/:id', async function(req, res) {
  const client = new MongoClient(uri);
  const database = client.db("Starlink-MW");
  const multimedia = database.collection("Multimedia");
    try {
        // Connect to the MongoDB cluster
         await client.connect();

        // Make the appropriate DB calls

        res.json({document: await update(multimedia,req.params.id,req.body)}) ;

    } catch (e) {
        //console.error(e);
        res.json({ ERROR: e})
    } finally {
        await client.close();
    }
})

app.post('/', async function(req, res) {
  var doc = {
    Dialecto: req.body.dialecto,
    Tipo_de_archivo: req.body.archivo,
    Descripcion:{
      Espaniol: req.body.espaniol
    },
    ID_archivo: req.body.id,
    Tamanio: parseInt(req.body.tam),
    Usuario: req.body.user,
    Fecha: req.body.date,
    Thumbnail: req.body.thumb
  };
  doc['Descripcion'][req.body.dialecto] = req.body.descDial;
  const client = new MongoClient(uri);
  const database = client.db("Starlink-MW");
  const multimedia = database.collection("Multimedia");
    try {
        // Connect to the MongoDB cluster
         await client.connect();

        // Make the appropriate DB calls

        res.json({document: await post(multimedia,doc)}) ;

    } catch (e) {
        //console.error(e);
        res.json({ ERROR: e})
    } finally {
        await client.close();
    }
})

app.delete('/', async function(req, res) {
  var query = {};
  query[req.query.param] = req.body.value;
  const client = new MongoClient(uri);
  const database = client.db("Starlink-MW");
  const multimedia = database.collection("Multimedia");
    try {
        // Connect to the MongoDB cluster
         await client.connect();

        // Make the appropriate DB calls

        res.json({document: await del(multimedia,query)}) ;

    } catch (e) {
        //console.error(e);
        res.json({ ERROR: e})
    } finally {
        await client.close();
    }
})

app.listen(3000, () => {
  console.log('server started');
});


// Funciones
async function get(multimedia) {
  try {

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      //sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      //projection: { _id: 0, title: 1, imdb: 1 },
    };

    const cursor = await multimedia.find();
    return cursor.toArray();
    // replace console.dir with your callback to access individual elements
    //await cursor.forEach(console.dir);
    
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
      //console.log(`Found a listing in the collection with the name '${id}':`);
      //console.log(result);
      return result;

    } else {
      return (`No listings found with the name '${id}'`);
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

    //console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return get_id(multimedia, doc.ID_archivo);
  } finally {
    //await client.close();
  }
}

async function del(multimedia, query) {
  try {
    console.log(query);
    const result = await multimedia.deleteOne(query);
    if (result.deletedCount === 1) {
      return("Successfully deleted one document.");
    } else {
      return("No documents matched the query. Deleted 0 documents.");
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
    return(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
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

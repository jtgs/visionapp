const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');
const bs = require('./blobstorage.js');
const cv = require('./vision.js');
const { CosmosClient } = require('@azure/cosmos');
const { DBClient } = require('./cosmos.js');

const app = express();

// Serve static files from 'public' directory.
app.use(express.static('public'));

// /photo endpoint - take a picture and do CV analysis on it.
app.post('/photo', function (req, res) {
    console.log('Got a request for /photo');

    // Handler for POST data
    var form = new multiparty.Form();
    var answer = "";
    form.parse(req, function(err, fields, files) {
        console.log(files);
        fs.readFile(files['image'][0].path, async function (err, data) {
            // Upload to Azure Blob Storage
            var blobRsp = await bs.uploadBlob(data);
            var blobURL = blobRsp.blockUrl;

            // Now we have the URL we can do the CV analysis on it
            answer = await cv.computerVision(blobURL);

            //Clean up the storage
            await bs.deleteContainer(blobRsp.containerName);

            // Return response to client
            res.send(answer);
        });
    });

});

const cosmosClient = new CosmosClient({
    endpoint: process.env.AZURE_COSMOS_HOST,
    key: process.env.AZURE_COSMOS_KEY
});
const dbClient = new DBClient(cosmosClient, "testCollection");
dbClient.init();

// /additem endpoint
app.post('/additem', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, async function(err, fields, files) {
        console.log(fields);
        await dbClient.addItem(fields);
    });
    res.send();
});

// /getitems endpoint
app.get('/items', async function (req, res) {
    const querySpec = {
        query: "SELECT * FROM c"
      };
 
    const items = await dbClient.find(querySpec);
    res.send(items.map(item => item['item'][0]));
})


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}
// Start the Express server
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
app.listen(port, () => console.log('Server running on port ' + port + '!'))
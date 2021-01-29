const { BlobServiceClient } = require('@azure/storage-blob');
const uuidv1 = require('uuidv1');

async function uploadBlob(blob) {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Retrieve the connection string for use with the application. The storage
    // connection string is stored in an environment variable on the machine
    // running the application called AZURE_STORAGE_CONNECTION_STRING. If the
    // environment variable is created after the application is launched in a
    // console or with Visual Studio, the shell or application needs to be closed
    // and reloaded to take the environment variable into account.
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    // Create a unique name for the container
    const containerName = 'vision' + uuidv1();

    console.log('\nCreating container...');
    console.log('\t', containerName);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container
    const createContainerResponse = await containerClient.create();
    console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);

    // Set access policy for public read access
    // var acl = containerClient.getAccessPolicy()
    containerClient.setAccessPolicy("blob");

    // Create a unique name for the blob
    const blobName = 'vision' + uuidv1() + '.png';

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('\nUploading to Azure storage as blob:\n\t', blobName);

    // Upload data to the blob
    const uploadBlobResponse = await blockBlobClient.upload(blob, blob.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

    return { 'blockUrl': blockBlobClient.url, 'containerName': containerName };
}

function deleteContainer(containerName) {
    console.log('todo');
}


module.exports = { uploadBlob }

// main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));
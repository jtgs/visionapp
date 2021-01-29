'use strict';

/* Requirements from CV tutorial */
const async = require('async');
// const fs = require('fs');
// const https = require('https');
const path = require("path");
// const createReadStream = require('fs').createReadStream;
// const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

/* dotenv needed to read server environment variables */
require("dotenv").config();

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = process.env.AZURE_CV_KEY || '0000';
const endpoint = process.env.AZURE_CV_ENDPOINT || 'https://azure.com';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

async function computerVision(describeURL) {
    // Analyze URL image
    console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
    const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
    var rsp = `This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`;
    console.log(rsp);
    return caption.text;
}

// // Formats the bounding box
// function formatRectObjects(rect) {
//     return `top=${rect.y}`.padEnd(10) + `left=${rect.x}`.padEnd(10) + `bottom=${rect.y + rect.h}`.padEnd(12)
//       + `right=${rect.x + rect.w}`.padEnd(10) + `(${rect.w}x${rect.h})`;
// }

// function objectVision(objectURL) {
//     async.series([
//         async function () {
//             // Analyze a URL image
//             console.log('Analyzing objects in image...', objectURL.split('/').pop());
//             const objects = (await computerVisionClient.analyzeImage(objectURL, { visualFeatures: ['Objects'] })).objects;
//             console.log();

//             // Print objects bounding box and confidence
//             if (objects.length) {
//             console.log(`${objects.length} object${objects.length == 1 ? '' : 's'} found:`);
//             for (const obj of objects) { console.log(`    ${obj.object} (${obj.confidence.toFixed(2)}) at ${formatRectObjects(obj.rectangle)}`); }
//             } else { console.log('No objects found.'); }
//         },
//         function () {
//             return new Promise((resolve) => {
//                 resolve();
//             })
//         }
//     ], (err) => {
//         throw (err);
//     });
// }

// // Format tags for display
// function formatTags(tags) {
//     return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
// }

// function tagsVision(tagsURL){
//     async.series([
//         async function () {
//             // Analyze URL image
//             console.log('Analyzing tags in image...', tagsURL.split('/').pop());
//             const tags = (await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] })).tags;
//             console.log(`Tags: ${formatTags(tags)}`);
//         },
//         function () {
//             return new Promise((resolve) => {
//                 resolve();
//             })
//         }
//     ], (err) => {
//         throw (err);
//     });
// }


// function brandVision(brandURLImage) {
//     async.series([
//         async function () {
//             // Analyze URL image
//             console.log('Analyzing brands in image...', brandURLImage.split('/').pop());
//             const brands = (await computerVisionClient.analyzeImage(brandURLImage, { visualFeatures: ['Brands'] })).brands;

//             // Print the brands found
//             if (brands.length) {
//             console.log(`${brands.length} brand${brands.length != 1 ? 's' : ''} found:`);
//             for (const brand of brands) {
//                 console.log(`    ${brand.name} (${brand.confidence.toFixed(2)} confidence)`);
//             }
//             } else { console.log(`No brands found.`); }
//         },
//         function () {
//             return new Promise((resolve) => {
//                 resolve();
//             })
//         }
//     ], (err) => {
//         throw (err);
//     });
// }

// // Status strings returned from Read API. NOTE: CASING IS SIGNIFICANT.
// // Before Read 3.0, these are "Succeeded" and "Failed"
// const STATUS_SUCCEEDED = "succeeded";
// const STATUS_FAILED = "failed";

// // Prints all text from Read result
// function printRecText(readResults) {
//     console.log('Recognized text:');
//     for (const page in readResults) {
//       if (readResults.length > 1) {
//         console.log(`==== Page: ${page}`);
//       }
//       const result = readResults[page];
//       if (result.lines.length) {
//         for (const line of result.lines) {
//           console.log(line.words.map(w => w.text).join(' '));
//         }
//       }
//       else { console.log('No recognized text.'); }
//     }
// }

// // Perform read and await the result from URL
// async function readTextFromURL(client, url) {
//     // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
//     let result = await client.read(url);
//     // Operation ID is last path segment of operationLocation (a URL)
//     let operation = result.operationLocation.split('/').slice(-1)[0];

//     // Wait for read recognition to complete
//     // result.status is initially undefined, since it's the result of read
//     while (result.status !== STATUS_SUCCEEDED) { await sleep(1000); result = await client.getReadResult(operation); }
//     return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
// }

// function readVision(readURL) {
//     async.series([
//         async function () {
//             console.log('Read printed text from URL...', readURL.split('/').pop());
//             const printedResult = await readTextFromURL(computerVisionClient, readURL);
//             printRecText(printedResult);
//         },
//         function () {
//             return new Promise((resolve) => {
//                 resolve();
//             })
//         }
//     ], (err) => {
//         throw (err);
//     });
// }


/* MAIN */

// const describeURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';
// const objectURL = 'https://ecom-su-static-prod.wtrecom.com/images/products/11/LN_017311_BP_11.jpg';
// const brandURLImage = 'https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/images/red-shirt-logo.jpg';

// const urls = [
//     'https://ecom-su-static-prod.wtrecom.com/images/products/11/LN_017311_BP_11.jpg',
//     'https://th.bing.com/th/id/OIP.R00rIDpFiO874Wz0WAgGbAHaEK?w=321&h=180&c=7&o=5&dpr=1.25&pid=1.7'
// ];

// urls.forEach(function (url) {
//     console.log('Checking ' + url)
//     computerVision(url);
//     objectVision(url);
//     tagsVision(url);
//     brandVision(url);
//     readVision(url);
// });

module.exports = { computerVision }
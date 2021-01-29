'use strict';

/* Requirements from CV tutorial */
const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
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

function computerVision() {
    async.series([
        async function () {
            const describeURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';
            // Analyze URL image
            console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
            const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
            console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
        },
        function () {
            return new Promise((resolve) => {
            resolve();
            })
        }
    ], (err) => {
    throw (err);
    });
}

computerVision();
const express = require('express');
const app = express();

// Serve static files from 'public' directory.
app.use(express.static('public'));

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'))
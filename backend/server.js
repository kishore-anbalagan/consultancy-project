const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { port } = require('./config/appConfig');
const { connectDB } = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    // Prefer Atlas URI when provided, otherwise fall back to local
    const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI;
    await connectDB(mongoUri);
    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

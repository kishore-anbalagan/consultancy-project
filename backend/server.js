const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { port } = require('./config/appConfig');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

const express = require('express');
const dotenv = require('dotenv');
const shorturlRoutes = require('./routes/shorturl.routes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/', shorturlRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

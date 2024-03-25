const express = require('express');
const cors = require('cors');
const app = express();

const https = require('https');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(cors());

app.use(express.static('public'));

const UserRoutes = require('./routes/userroutes');
const FoodRoutes = require('./routes/foodroutes');
const OrderRoutes = require('./routes/orderroutes');

app.use('/orders', OrderRoutes);
app.use('/users', UserRoutes);
app.use('/foods', FoodRoutes);

const options = {
  key: fs.readFileSync(path.join(__dirname, './certificate/private.key')),
  cert: fs.readFileSync(path.join(__dirname, './certificate/certificate.crt')),
};

const port = 2005;

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Rodando na porta ${port} (HTTPS)`);
});

// const express = require('express');
// const cors = require('cors');
// const app = express();
// //const db = require ('./db')

// app.use(express.json());
// app.use(cors());

// app.use(express.static('public'));

// const UserRoutes = require('./routes/userroutes');
// const FoodRoutes = require('./routes/foodroutes');
// const OrderRoutes = require('./routes/orderroutes');

// app.use('/orders', OrderRoutes);
// app.use('/users', UserRoutes);
// app.use('/foods', FoodRoutes);

// app.listen(2005, () => {
//   console.log('Rodando na porta 2005');
// });

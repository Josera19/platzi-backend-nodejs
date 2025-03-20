const express = require('express');
const cors = require('cors');
const expressAsyncErrors = require('express-async-errors');
const routerAPI = require('./routers/index');
const { errorHandler, logErrors, boomErrorHandler } = require('./middlewares/errorHandler');
const app = express();

const port = 3001;

const whiteList = ['http://localhost:8080', 'https://myapp.com'];
const options = {
  origin : (origin, callback) => {
    if(whiteList.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error('Not Allowed'));
    }
  }
}

app.use(cors(options));
app.use(express.json());

app.get('/' , (req, res) => {
  res.send('My first app in express');
});

routerAPI(app);
// Utilizamos los middleware. Siempre deben ir después del routing:
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('App listening at http://localhost:'+port);
})

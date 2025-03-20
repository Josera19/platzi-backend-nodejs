const express = require('express');
const cors = require('cors');
const expressAsyncErrors = require('express-async-errors');
const routerAPI = require('./routers/index');
const { errorHandler, logErrors, boomErrorHandler } = require('./middlewares/errorHandler');
const app = express();

const port = process.env.PORT || 3001;

const whiteList = ['http://localhost:3001/api', 'https://platzi-backend-nodejs.vercel.app/'];
const options = {
  origin : (origin, callback) => {
    console.log('origin', origin);
    if(whiteList.includes(origin) || !origin){
      callback(null, true);
    } else {
      callback(new Error('Not Allowed'));
    }
  }
}


app.use(express.json());

app.get('/api/' , (req, res) => {
  res.send('My first app in express');
});

routerAPI(app);
//si colocas el : app.use(cors(options)); antes de la línea : routerApi(app); bloquea todo, hasta la petición desde el localhost:3000/api/v1/products
app.use(cors(options));
// Utilizamos los middleware. Siempre deben ir después del routing:
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('App listening at http://localhost:'+port);
})

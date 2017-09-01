let express=require('express');
let massive=require('massive');
let config=require('./config');
let session = require('express-session');
let endpoints=require('./server/endpoints.js')
const {json}=require('body-parser');

let port=config.port || 3001;


let app=express();

app.use(json());

app.use(session({
  secret:config.secret,
  saveUninitialized:false,
  resave:false
}))


massive({
  host:'127.0.0.1',
  port:5432,
  database:'postgres',
  user:'postgres',
  password:'asdf'
}).then(dbInstance=>{
  app.set('db',dbInstance);
  endpoints.setDB(dbInstance);
})


app.get('/api/getMoney/:playerId',endpoints.getMoney);
app.post('/api/addHand',endpoints.addHand)
//put playerId, and then need a query money=newVal
app.put('/api/updateMoney/:playerId', endpoints.setMoney);
app.delete('/api/deleteGameHistory/:gameId',endpoints.deleteGame);
app.delete('/api/deleteAllHistory/:playerId',endpoints.deleteHistory);

app.use(express.static('./assets'));
app.listen(port,()=>console.log(`Listening on port ${port}`));























//

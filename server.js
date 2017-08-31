let express=require('express');
let massive=require('massive');
let config=require('./config');
const {json}=require('body-parser');

let port=config.port || 3001;


let app=express();


app.use(json());

massive({
  host:'127.0.0.1',
  port:5432,
  database:'postgres',
  user:'postgres',
  password:'asdf'
}).then(dbInstance=>{
  app.set('db',dbInstance);
  dbInstance.getAll().then(response=>console.log(response))
})

app.get('/api/games',(req,res)=>{
  console.log("At least it's hitting this, right?");
  req.app.get('db').getGames()
    .then(response=>res.status(200).json(response))
    .catch(err=>res.status(500).json(err));
})

app.post('/api/addGame',(req,res)=>{
  const {game, price, stars,id}=req.body;
  req.app.get('db').postVal([price,game,stars,id])
    .then(response=>res.status(200).json(response))
    .catch(err=>res.status(500).json(err));

})

app.get('/api/beta',(req,res)=>{
  console.log(req.query)
  console.log(req.params);
  res.json("That was FAST!!!");
})

app.post('/api/test',(req,res)=>{
  const {name, age, location}=req.body;
  req.app.get('db').postTest([name, age, location])
    .then(response=>res.status(200).json(response))
    .catch(err=>res.status(500).json(err));
})

app.post('/api/addHand',(req,res)=>{
  const {bet, count, followedChart}=req.body;
  console.log("Here we are!!!");
  console.log(`Bet: ${bet}`);
  console.log(`count: ${count}`);
  console.log(`Followed: ${followedChart}`);
  console.log();
  res.status(200).json("DONE!!!")

})
//
// app.get('/api/beta/:id',(req,res)=>{
//   console.log(req.query)
//   console.log(req.params);
//   res.json("That was FAST!!!");
// })




app.use(express.static('./assets'));
app.listen(port,()=>console.log(`Listening on port ${port}`));

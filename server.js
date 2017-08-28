let express=require('express');
let config=require('./config');

let port=config.port || 3001;


let app=express();

app.use(express.static('./assets'));






app.listen(port,()=>console.log(`Listening on port ${port}`));

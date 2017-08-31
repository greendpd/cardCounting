module.exports={
  addHand:function(req,res){
    const {bet,count,followedChart}=req.body;
    console.log(`count: ${count}`);
    console.log(`Followed: ${followedChart}`);
    console.log(`bet: ${bet}`);
    console.log();
    res.status(200).json("DONE!!!")
  }
}

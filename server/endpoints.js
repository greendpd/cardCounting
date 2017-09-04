let database = null;
let gameNum = null;
let currentPlayerId = null;
module.exports = {
  addHand: function(req, res) {
    const {
      bet,
      count,
      followedChart
    } = req.body;

    if (database === null) {
      console.log("Database not yet initialized");
      return;
    }

    if (currentPlayerId === null) {
      let playerName = "bob";
      database.createPlayer([playerName]).then((response) => {
        currentPlayerId = response[0].id;
        getGameNumber();
      });
    } else if (gameNum === null) {
      getGameNumber();
    } else {
      handToSQL();
    }

    function getGameNumber() {
      let day = new Date();
      let dateToWrite = "'" + day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + "'";
      database.makeGame([currentPlayerId, dateToWrite]).then((response) => {
        gameNum = response[0].gameid;
        handToSQL();
      });
    }

    function handToSQL() {
      database.postHand([gameNum, count, bet, followedChart]);
      res.status(200).json("success");
    }
  },

  getMoney:function(req,res){
    database.getMoney([req.params.playerId]).then((response)=>res.status(200).json(response));
  },

  setMoney:function(req,res){
    database.updateMoney([req.params.playerId,req.query.money]);
    res.status(200).json("success");
  },

  deleteGame:function(req,res){
    database.deleteGame([req.params.gameId]).then((response)=>res.json(response));
  },

  deleteHistory:function(req,res){
    database.deleteHistory([req.params.playerId]).then((response)=>res.json(response));
  },
  getStats:function(req,res){
    database.getStats([req.params.id]).then((response)=>res.json(response));
  },

  setDB: function(db) {
    database = db;
    console.log("Setting the database");
  }
}

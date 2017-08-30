app.service('gameSrvc', function(deckSrvc) {
  let m_numPlayers = 0;
  let m_numDecks = 8;
  let m_players = [];
  let m_dealerHand = [];
  let m_currentPlayer = 0;
  let gameLive=false;
  const MINREMAININGPERPLAYER = 5;

  /*
  ---Outward Facing Functions:
  addPlayer(name, money)
  getPlayers()
    Unformatted cards
  removePlayer
    pops
  changeNumDecks(newNum)
  deal()
  dealerTopCard()
    This is unformatted, could be 51, could be 0
  getCurrentPlayer--returns index
  hit
  stand
  double
  split
  canHit
  canDouble
  canSplit
  totalValue(cards)
  isSoft(cards)
  getNumberAndSuit(card)
  chartMove
    returns:
      0: stand
      1: hit
      2: double
      3: split
  */
  function Player(name, money, seat) {
    this.name = name;
    this.money = money;
    this.seat = seat;
    this.isHuman = (seat === 0);
    this.bet = 0;
    this.cards = [
      []
    ];
    this.currentHand = 0;
    this.blackjack = false;
  }

  this.setBet = function(player, bet) {
    if (m_players.length <= player) {
      console.log("Attempted to set a bet outside of the player array");
      return;
    }
    if (m_players)
      m_players[player].bet = bet;
  }

  this.addPlayer = function(name, money) {
    m_players.push(new Player(name, money, m_players.length));
    if (m_players.length > 1) {
      m_players[m_players.length - 1].bet = 500;
    }
  }

  this.getPlayers = function() {
    return m_players;
  }

  this.removePlayer = function() { //~~~Still need to handle computers going bankrupt
    if (m_players.length <= 1) {
      return;
    } else(m_players.pop());
  }

  function resetPlayer(aPlayer) {
    aPlayer.cards = [
      []
    ];
    aPlayer.currentHand = 0;
    aPlayer.blackjack = false;
  }

  this.changeNumDecks = function(numDecks) {
    if (numDecks === deckSrvc.getNumDecks) {
      return;
    }
    deckSrvc.changeNumDecks(numDecks);
  }

  this.deal = function() {

    m_dealerHand = [];
    if (deckSrvc.cardsRemaining <= MINREMAININGPERPLAYER * m_numPlayers + 1) {
      deckSrvc.shuffle();
    }

    for (var current of m_players) {
      resetPlayer(current);
      if (current.bet <= 0) {
        console.log("Can't deal if player makes no bet");
        return;
      }
      current.cards[0].push(deckSrvc.draw())
      current.cards[0].push(deckSrvc.draw())
      if (total(current.cards[0]) === 21) {
        current.blackjack = true;
      }
    }

    m_dealerHand.push(deckSrvc.draw());
    m_dealerHand.push(deckSrvc.draw());
    if (total(m_dealerHand) === 21) { //If a blackjack, game's over!
      resolveGame();
    }


    m_currentPlayer = 0;
    gameLive=true;
  }

  this.getNumberAndSuit = function(card) {
    return [card % 13 + 1, Math.floor(card % 13)];
  }

  this.dealerTopCard = function() {
    if (m_dealerHand.length > 0) {
      return m_dealerHand[0];
    }
  }

  this.getCurrentPlayer = function() {
    return m_currentPlayer;
  }

  this.hit = function() {
    if (!prescreen("HIT")) {
      return;
    }

    m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand].push(deckSrvc.draw());
    let toRet = total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]);
    if (toRet >= 21) {
      incrementPlayer;
    }
    return toRet;
  }

  this.stand = function() {
    incrementPlayer();
  }

  this.double = function() {
    if (!prescreen("DOUBLE")) {
      return;
    }
    if (!this.canDouble()) { //remember, not allowing doubling on split hands!
      console.log("attempted to double when not allowed");
      return;
    }
    m_players[m_currentPlayer].bet *= 2;

    m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand].push(deckSrvc.draw());
    let toRet = total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]);
    incrementPlayer();
  }

  this.split = function() {
    prescreen("SPLIT");
    if (!this.canSplit()) {
      return "Allowed split when not allowed";
    }
    let currPlayer = m_players[m_currentPlayer];
    let currentHand = currPlayer.cards[currPlayer.currentHand];
    let newHand = [];
    newHand.push(currentHand.splice(1, 1));
    currPlayer.cards.push(newHand);
  }

  this.canStand=function(){
    return gameLive;
  }

  this.canHit = function() {
    if(!gameLive){
      return false;
    }
    if (m_currentPlayer >= m_players.length) {
      return false;
    }
    return (total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]) < 21)
  }

  this.canDouble = function() { //No doubling after a split
    if(!gameLive){
      return false;
    }
    if (m_currentPlayer >= m_players.length) {
      return false;
    }
    return (m_players[m_currentPlayer].money >= m_players[m_currentPlayer].bet * 2 && m_players[m_currentPlayer].cards.length === 1);
  }

  this.canSplit = function() {
    if(!gameLive){
      return false;
    }
    if (m_currentPlayer >= m_players.length) {
      return false;
    }
    let currPlayer = m_players[m_currentPlayer];
    let currentHand = currPlayer.cards[currPlayer.currentHand];
    if (currentHand.length != 2) {
      return false;
    }
    if (cardValue(currentHand[0]) !== cardValue(currentHand[1])) {
      return false;
    }
    if (currPlayer.cards.length > 3) { //allow only 4 hands
      return false;
    }
    return true;
  }

  function incrementPlayer() {
    if (m_currentPlayer >= m_players.length) {
      if (m_currentPlayer > m_players.length) {
        console.log("Game ended on a player outside of the index");
        return;
      }
      resolveGame();
      return;
    }
    if (m_players[m_currentPlayer].currentHand + 1 < m_players[m_currentPlayer].cards.length) {
      m_players[m_currentPlayer].currentHand++;
    } else {
      m_currentPlayer++;
    }
    if(m_currentPlayer===m_players.length){
      resolveGame();
    }
  }

  function cardValue(card) {
    toRet = card % 13 + 1;
    if (toRet > 10) {
      return 10;
    }
    return toRet;
  }

  function total(cards) {
    let hasAce = false;
    let total = 0;
    cards.forEach(function(cur, i, arr) {
      let temp = cardValue(cur);
      if (temp === 1) {
        hasAce = true;
      }
      total += temp;
    })
    if (hasAce && total <= 11) {
      total += 10;
    }
    return total;
  }

  this.totalValue = function(cards) {
    return total(cards);
  }

  this.isSoft = function(cards) {
    let hasAce = false;
    let total = 0;
    cards.forEach(function(cur, i, arr) {
      let temp = cardValue(cur);
      if (temp === 1) {
        hasAce = true;
      }
      total += temp;
    })
    if (hasAce && total <= 11) {
      return true;
    }
    return false;
  }

  function resolveGame() {
    let dealerTotal = total(m_dealerHand)
    if (m_dealerHand.length == 2 && dealerTotal == 21) {
      m_players.forEach(function(cur, i, arr) {
        if (!cur.blackjack) { //They can't have split yet, so we're safe ignoring other possible hands
          cur.money -= Number(cur.bet);
        }
      })
      return;
    }

    while (total(m_dealerHand) < 17) {
      m_dealerHand.push(deckSrvc.draw());
    }
    dealerTotal = total(m_dealerHand);
    console.log("dealer value: " + dealerTotal);

    m_players.forEach((cur, i, arr) => {
      if (cur.blackjack) {
        cur.money += Number(cur.bet) * 1.5;
      } else {
        cur.cards.forEach((hand) => {
          console.log(cur.name+": Card value: "+total(hand));
          console.log("\tBet: "+cur.bet);
          if (total(hand) > 21) {
            console.log("OVER");
            cur.money -=Number(cur.bet);
            console.log(cur.money);
          } else if (dealerTotal > 21) {
            cur.money += Number(cur.bet);
          } else if (total(hand) > dealerTotal) {
            cur.money += Number(cur.bet);
          } else if (total(hand) < dealerTotal) {
            cur.money -= Number(cur.bet);
          }
        })
      }
    })
    gameLive=false;

  }

  function prescreen(caller) {
    caller = caller.toUpperCase();

    if (m_currentPlayer >= m_players.length) {
      console.log("error in gameSrvc, trying to " + caller + " on an out-of-index player");
      return false;
    }
    if (m_players[m_currentPlayer].cards.length === 0) {
      console.log(`No cards array ${caller}`);
      return false;
    }
    if (m_players[m_currentPlayer].cards[0].length == 0) {
      console.log(`no hand is dealt ${caller}`);
      return false;
    }
    if (m_players[m_currentPlayer].bet <= 0) {
      console.log("Player placed no bet and yet is performing " + caller);
      return false;
    }
    if (m_players[m_currentPlayer].bet > m_players[m_currentPlayer].money) {
      console.log("Player is allowed to bet more money than they have in: " + caller);
      return false;
    }
    if (total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]) >= 21) {
      console.log("gamesrvc: player allowed to " + caller + " when at or over 21");
      return false;
    }
    return true;
  }

  this.chartMove = function() {
    //0:stand
    //1:hit
    //2:double
    //3:stand
    let hand = m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand];
    let handVal = total(hand);
    let soft = isSoft(hand);
    let canDouble = this.canDouble();
    let canSplit = this.canSplit();
    let dealerTop = cardValue(dealerTopCard())
    if (handVal >= 19) {
      return 0;
    }

    if (canSplit) { //need to handle this first, so we don't find soft 16 doing it's stuff...
      let myCard = cardValue(hand[0]);
      if (myCard === 1 || myCard === 8) {
        return 3;
      }
      if (myCard === 2 || myCard === 3) {
        if (dealerTop >= 8 || dealerTop === 1) {
          return 1;
        }
        return 3;
      }
      if (myCard === 4) {
        if (dealerTop === 5 || dealerTop === 6) {
          return 3;
        }
        return 1;
      }
      if (myCard === 5) {
        if (dealerTop === 10 || dealerTop === 1) {
          return 1;
        }
        return 2;
      }
      if (myCard === 6) {
        if (dealerTop >= 2 && dealerTop <= 6) {
          return 3;
        }
        return 1;
      }
      if (myCard === 7) {
        if (dealerTop >= 2 && dealerTop <= 7) {
          return 3;
        }
        return 1;
      }
      if (myCard === 9) {
        if (dealerTop === 7 || dealerTop === 10 || dealerTop === 1) {
          return 0;
        }
        return 3;
      }
      if (myCard === 10) {
        return 0;
      }
    }

    if (soft) {
      if (handVal === 18) {
        if (dealerTop === 2 || dealerTop === 7 || dealerTop === 8) {
          return 0;
        }
        if (dealerTop >= 3 && dealerTop <= 6) {
          return 2;
        }
        return 1;
      }
      if (handVal === 17) {
        if (dealerTop >= 3 && dealerTop <= 6) {
          return 2;
        }
        return 1;
      }
      if (handVal === 16 || handval === 15) {
        if (dealerTop >= 4 && dealerTop <= 6) {
          return 2;
        }
        return 1;
      }
      if (handVal === 14 || handval === 13) {
        if (dealerTop === 5 || dealerTop === 6) {
          return 2;
        }
        return 1;
      }
    }

    if (handVal === 17) {
      return 0;
    }
    if (handVal >= 13 && handVal <= 16) {
      if (dealerTop >= 2 && dealerTop <= 6) {
        return 0;
      }
      return 1;
    }
    if (handVal === 12) {
      if (dealerTop >= 4 && dealerTop <= 6) {
        return 0;
      }
      return 1;
    }
    if (handVal === 11) {
      if (dealerTop >= 2 && dealerTop <= 10) {
        return 2;
      }
      return 1;
    }
    if (handVal === 10) {
      if (dealerTop >= 2 && dealerTop <= 9) {
        return 2;
      }
      return 1;
    }
    return 1;
  }
})









//

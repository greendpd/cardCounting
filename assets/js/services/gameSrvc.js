app.service('gameSrvc', function(deckSrvc, $http) {
  const CARDBACK = 56 //Represents the number that is the back of the cards
  let m_numPlayers = 0;
  let m_numDecks = 8;
  let m_players = [];
  let m_dealerHand = [];
  let m_currentPlayer = 0;
  let gameLive = false;
  let m_humanDone = false;
  let m_gameStartCount = 0;
  let m_dealerStyles = [];
  const MINREMAININGPERPLAYER = 5;
  let m_forceResultToChart = false;
  let m_dealerValue="";
  let m_highlightCountCards=false;
  let m_willShuffle=false;

  //For styling
  const TOTALSIZE = 1000;
  let s_cardWidth = Math.floor(TOTALSIZE / 14.01);
  let s_initialWidthOffset = Math.floor(TOTALSIZE / 136.35);
  let s_initialHeightOffset = Math.floor(TOTALSIZE / 176.46);
  let s_spaceBetweenCards = Math.floor(TOTALSIZE / 187.4);
  let s_cardHeight = Math.floor(TOTALSIZE / 9.374);
  let s_spaceHeightBetween = Math.floor(TOTALSIZE / 176.46)
  let s_borderRadius = Math.floor(TOTALSIZE / 176.46)
  let s_minWidth = Math.floor(TOTALSIZE / 65);


  /*
  ---Outward Facing Functions:
  addPlayer(name, money)
  getPlayers()
  removePlayer
    pops
  changeNumDecks(newNum)
  deal()
  humanDealerCard
  getDealerTopStyle(card)
  getCurrentPlayer--returns index
  hit
  stand
  double
  split
  canStand
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

  this.clearAllPlayers = function() {
    m_players = [];
    m_currentPlayer = 0;
    m_dealerHand = [];
    m_numPlayers = 0;
    gameLive = false;
    m_humanDone = false;
    m_gameStartCount = 0;
    m_dealerStyles = [];
    deckSrvc.shuffle();
    m_dealerValue="";
    m_highlightCountCards=false;
    m_willShuffle=false;

  }

  this.setHighlight=function(highlightCountCards){
    m_highlightCountCards=highlightCountCards;
  }

  this.getDealerValue=function(){
    if(m_dealerValue===0){
      return "";
    }
    if(m_dealerValue>21){
      return "Busted!"
    }
    return m_dealerValue;
  }

  function Player(name, money, seat) {
    this.name = name;
    this.money = money;
    this.seat = seat;
    this.isHuman = (seat === 0);
    this.bet = 0;
    this.cards = [
      []
    ];
    this.humanCards = [
      []
    ];
    this.currentHand = 0;
    this.blackjack = false;
    this.isDoubled = false;
    this.followedChart = true;
    this.styles = [
      []
    ];
    this.total = [];
    this.soft = [];
    this.wonGame = null;
  }

  function addCard(card, player) {
    if (player === undefined) {
      m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand].push(card);
      m_players[m_currentPlayer].humanCards[m_players[m_currentPlayer].currentHand].push(makeHuman(card));
      m_players[m_currentPlayer].styles[m_players[m_currentPlayer].currentHand].push(setStyle(card));
      m_players[m_currentPlayer].total[m_players[m_currentPlayer].currentHand] = total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]);
      m_players[m_currentPlayer].soft[m_players[m_currentPlayer].currentHand] = isSoft(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]);
      return;
    }
    player.cards[player.currentHand].push(card);
    player.humanCards[player.currentHand].push(makeHuman(card));
    player.styles[player.currentHand].push(setStyle(card));
    if (player.total.length <= player.currentHand) {
      player.total.push(total(player.cards[0]));
      player.soft.push(isSoft(player.cards[0]));
    } else {
      player.total[player.currentHand] = total(player.cards[player.currentHand]);
      player.soft[player.currentHand] = isSoft(player.cards[player.currentHand]);
    }
  }

  this.getCount=function(){
    return deckSrvc.getAbsoluteCount();
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

  this.setForceResult = function(forceResult) {
    m_forceResultToChart = forceResult;
  }

  this.removePlayer = function() { //~~~Still need to handle computers going bankrupt
    if (m_players.length <= 1) {
      return;
    } else(m_players.pop());
  }

  function setStyle(card,notLast) {
    //Returns the style that is appropriate for the card
    let cardNum = card % 13
    let suit = Math.floor(card / 13);
    let border="";
    if(m_highlightCountCards && card<52){
      let cardVal=cardValue(card);
      if(cardVal==10 ||cardVal==1){
        border="border: 4px solid black;";
      }else if(cardVal>=2 && cardVal<=6){
        border="border: 4px solid blue;";
      }
    }
    if(notLast){
      return `width:${s_minWidth}px; height:${s_cardHeight}px; background:url('../images/cards.svg') -${s_initialWidthOffset+cardNum*(s_spaceBetweenCards+s_cardWidth)}px -${s_initialHeightOffset+suit*(s_spaceHeightBetween+s_cardHeight)}px;background-size:${TOTALSIZE}px auto;border-radius: ${s_borderRadius}px 0px 0px ${s_borderRadius}px;${border}`
    }
    return `width:${s_cardWidth}px; height:${s_cardHeight}px; background:url('../images/cards.svg') -${s_initialWidthOffset+cardNum*(s_spaceBetweenCards+s_cardWidth)}px -${s_initialHeightOffset+suit*(s_spaceHeightBetween+s_cardHeight)}px;background-size:${TOTALSIZE}px auto;border-radius:${s_borderRadius}px;${border}`
  }

  this.getDealerStyles = function() {
    return m_dealerStyles;
  }

  function resetPlayer(aPlayer) {
    aPlayer.cards = [
      []
    ];
    aPlayer.humanCards = [
      []
    ];
    aPlayer.currentHand = 0;
    aPlayer.blackjack = false;
    if (aPlayer.isDoubled) {
      aPlayer.bet /= 2;
    }
    aPlayer.isDoubled = false;
    aPlayer.followedChart = true;
    aPlayer.styles = [
      []
    ];
    aPlayer.total = [];
    aPlayer.soft = [];
    aPlayer.wonGame = null;
  }

  this.changeNumDecks = function(numDecks) {
    if (numDecks === deckSrvc.getNumDecks) {
      return;
    }
    deckSrvc.changeNumDecks(numDecks);
  }

  this.getWillShuffle=function(){
    return m_willShuffle;
  }

  this.deal = function(forceShuffle, noDealerBlackJack) { //args are for training
    m_dealerValue=0;
    m_humanDone = false;
    m_dealerHand = [];
    m_dealerStyles = [];
    if ((deckSrvc.cardsRemaining <= MINREMAININGPERPLAYER * m_numPlayers + 1) || forceShuffle === true) {
      deckSrvc.shuffle();
    }
    m_willShuffle=false;

    m_gameStartCount = deckSrvc.getAbsoluteCount();

    for (var current of m_players) {
      resetPlayer(current);
      if (current.bet <= 0) {
        console.log(`Can't deal if player ${current.name} makes no bet`);
        return;
      }
      addCard(deckSrvc.draw(), current);
      addCard(deckSrvc.draw(), current);
      if (total(current.cards[0]) === 21) {
        current.blackjack = true;
      }
    }
    gameLive = true;

    let dealerFirstCard = deckSrvc.draw();
    m_dealerHand.push(dealerFirstCard);
    let dealerSecondCard = deckSrvc.draw();

    if (noDealerBlackJack) {
      if (dealerFirstCard % 13 === 0) {
        while (dealerSecondCard % 13 >= 9) {
          dealerSecondCard = deckSrvc.draw();
        }
      }
      if (dealerFirstCard % 13 >= 9) {
        while (dealerSecondCard % 13 === 0) {
          dealerSecondCard = deckSrvc.draw();
        }
      }
    }
    m_dealerHand.push(dealerSecondCard);

    matchDealerStylesWithHand(true);

    if (total(m_dealerHand) === 21) { //If a blackjack, game's over!
      resolveGame();
    }

    m_currentPlayer = 0;
    if (m_players[0].blackjack) { //Hard-coding since only one human
      incrementPlayer();
    }
  }

  this.getNumberAndSuit = function(card) {
    return [card % 13 + 1, Math.floor(card % 13)];
  }

  function dealerTopCard() {
    if (m_dealerHand.length > 0) {
      return m_dealerHand[0];
    }
    console.log("Attempted to get the dealer top card when none had been dealt");
  }

  this.humanDealerCard = function() {
    let temp = dealerTopCard();
    return [temp % 13 + 1, Math.floor(temp / 13)];
  }

  this.getCurrentPlayer = function() {
    return m_currentPlayer;
  }

  this.hit = function() {
    hit();
  }

  function hit() {
    if (!prescreen("HIT")) {
      return;
    }
    if (chartMove() !== 1) {
      m_players[m_currentPlayer].followedChart = false;
    }

    if (m_forceResultToChart && m_currentPlayer === 0) { //Make sure this only happens with the human player
      let currentValue = m_players[0].total[m_players[0].currentHand];
      let lastHand = m_players[0].currentHand === m_players[0].total.length - 1;
      let cardToAdd = -1;
      if (m_players[0].followedChart) {
        let possibilities = [];
        for (let x = 1; x <= 12; x++) {
          let xVal = x + 1;
          if (xVal > 10) {
            xVal = 10;
          }
          if (currentValue + xVal <= 21) {
            if (!lastHand) {
              if (currentValue < 21) {
                possibilities.push(x);
              }
            } else {
              possibilities.push(x)
            }
          }
        }
        cardToAdd = possibilities[Math.floor(Math.random() * possibilities.length)];
        cardToAdd += 13 * (Math.floor(Math.random() * 4));
        addCard(cardToAdd);
      } else {
        let possibilities = [];

        for (let x = 1; x <= 12; x++) {
          let xVal = x + 1;
          if (xVal > 10) {
            xVal = 10;
          }
          if (currentValue + xVal != 21) {
            possibilities.push(x)
          }
        }

        cardToAdd = possibilities[Math.floor(Math.random() * possibilities.length)];
        cardToAdd += 13 * (Math.floor(Math.random() * 4));
        addCard(cardToAdd);
      }

    } else {
      addCard(deckSrvc.draw());
    }
    let toRet = total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]);
    if (toRet >= 21) {
      incrementPlayer();
    }
    return toRet;
  }

  function stand() {
    if (chartMove() !== 0) {
      m_players[m_currentPlayer].followedChart = false;
    }
    incrementPlayer();
  }

  this.stand = function() {
    stand();
  }

  this.double = function() {
    double();
  }

  function double() {
    if (!prescreen("DOUBLE")) {
      return;
    }
    if (!canDouble()) { //remember, not allowing doubling on split hands!
      console.log("attempted to double when not allowed");
      return;
    }
    if (chartMove() !== 2) {
      m_players[m_currentPlayer].followedChart = false;
    }

    m_players[m_currentPlayer].bet *= 2;
    m_players[m_currentPlayer].isDoubled = true;

    if (m_forceResultToChart && m_currentPlayer === 0) { //Make sure this only happens with the human player
      let currentValue = m_players[0].total[m_players[0].currentHand];
      let lastHand = m_players[0].currentHand === m_players[0].total.length - 1;
      let cardToAdd = -1;
      if (m_players[0].followedChart) {
        let possibilities = [];
        for (let x = 1; x <= 12; x++) {
          let xVal = x + 1;
          if (xVal > 10) {
            xVal = 10;
          }
          if (currentValue + xVal <= 21) {
            if (!lastHand) {
              if (currentValue < 21) {
                possibilities.push(x);
              }
            } else {
              possibilities.push(x)
            }
          }
        }
        cardToAdd = possibilities[Math.floor(Math.random() * possibilities.length)];
        cardToAdd += 13 * (Math.floor(Math.random() * 4));
        addCard(cardToAdd);
      } else {
        let possibilities = [];
        for (let x = 1; x <= 12; x++) {
          let xVal = x + 1;
          if (xVal > 10) {
            xVal = 10;
          }
          if (currentValue + xVal != 21) {
            possibilities.push(x)
          }
        }
        cardToAdd = possibilities[Math.floor(Math.random() * possibilities.length)];
        cardToAdd += 13 * (Math.floor(Math.random() * 4));
        addCard(cardToAdd);
      }

    } else {
      addCard(deckSrvc.draw());
    }

    let toRet = total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]);
    incrementPlayer();
  }

  function split() {
    prescreen("SPLIT");
    if (!canSplit()) {
      return "Allowed split when not allowed";
    }
    if (chartMove() !== 3) {
      m_players[m_currentPlayer].followedChart = false;
    }
    let currPlayer = m_players[m_currentPlayer];
    let currentHand = currPlayer.cards[currPlayer.currentHand];
    currPlayer.cards.push(currentHand.splice(1, 1));
    currPlayer.humanCards.push(currPlayer.humanCards[currPlayer.currentHand].splice(1, 1));
    currPlayer.styles.push(currPlayer.styles[currPlayer.currentHand].splice(1, 1));
    currPlayer.total = [];
    currPlayer.soft = [];
    currPlayer.cards.forEach((cur, i) => {
      currPlayer.total.push(total(cur));
      currPlayer.soft.push(isSoft(cur));

    })
  }

  this.split = function() {
    split();
  }

  function canStand(playerNumber) {

    if (playerNumber !== undefined && m_currentPlayer != playerNumber) {
      return false;
    }
    return gameLive;
  }

  this.canStand = function(playerNumber) {
    return canStand(playerNumber);
  }

  this.canHit = function(playerNumber) {
    if (playerNumber !== undefined && m_currentPlayer != playerNumber) {
      return false;
    }

    if (!gameLive) {
      return false;
    }
    if (m_currentPlayer >= m_players.length) {
      return false;
    }
    return (total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]) < 21)
  }

  this.canDouble = function(playerNumber) { //No doubling after a split
    return canDouble(playerNumber);
  }

  function canDouble(playerNumber) {
    if (playerNumber !== undefined && m_currentPlayer != playerNumber) {
      return false;
    }

    if (!gameLive) {
      return false;
    }
    if (m_currentPlayer >= m_players.length) {
      return false;
    }
    if (total(m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand]) >= 21) {
      return false;
    }
    return (m_players[m_currentPlayer].money >= m_players[m_currentPlayer].bet * 2 && m_players[m_currentPlayer].cards.length === 1);
  }

  this.canSplit = function(playerNumber) {
    return canSplit(playerNumber);
  }

  function canSplit(playerNumber) {
    if (playerNumber !== undefined && m_currentPlayer != playerNumber) {
      return false;
    }

    if (!gameLive) {
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

    if (m_currentPlayer === m_players.length) {
      resolveGame();
      return;
    }

    if (m_currentPlayer != 0 && !m_humanDone) {
      m_humanDone = true;
      runHandWithComputer();
    }
  }

  this.gameIsLive = function() {
    return gameLive;
  }

  function runHandWithComputer() {
    //The way this will play out will be pretty convoluted:
    //if it stands, then stand will call increment, which will then call this function
    let currHand = m_players[m_currentPlayer].currentHand;
    while (gameLive) {
      let temp = chartMove();
      if (temp === 0) {
        stand();
      } else if (temp === 1) {
        hit();
      } else if (temp === 2) {
        double();
      } else if (temp === 3) {
        split();

      }
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

  function makeHuman(card) {
    return [card % 13 + 1, Math.floor(card / 13)];
  }

  this.totalValue = function(cards) {
    return total(cards);
  }

  this.isHandSoft = function(cards) {
    return isSoft(cards);
  }

  function isSoft(cards) {
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

  function resolveGame() { //forceResult true makes it so the result matches whether the chart was followed, unless there is a dealer blackjack
    if (!gameLive) {
      console.log("trying to resolve on a not-live game");
    }
    gameLive = false;

    let dealerTotal = total(m_dealerHand)
    if (m_dealerHand.length == 2 && dealerTotal == 21) {
      matchDealerStylesWithHand(false);
      m_players.forEach(function(cur, i, arr) {
        if (!cur.blackjack) { //They can't have split yet, so we're safe ignoring other possible hands
          cur.money -= Number(cur.bet);
          cur.wonGame = -1;
        }
        if (cur.isDoubled) { //Need to handle here so that if a player bets again, it won't be halved by resetPlayer
          cur.bet /= 2;
          cur.isDoubled = false;
        }
      })
      m_willShuffle= ((deckSrvc.cardsRemaining <= MINREMAININGPERPLAYER * m_numPlayers + 1) || forceShuffle === true)

      return;
    }
    //Currently NOT calling to DB on dealer blackjacks, instead going to put in a certain pecentage of the games as being dealer blackjacks
    putHandToDB();

    if (m_forceResultToChart && total(m_dealerHand) >= 17 && total(m_dealerHand) <= 21) {
      let humanPlayer = m_players[0];
      if (humanPlayer.followedChart) { //if they are at 17 or higher, pop until they're not, then the next section will fix it up
        let minHand = null;
        for (let x of humanPlayer.total) {
          if (minHand === null || x < minHand) {
            minHand = x;
          }
        }
        while (total(m_dealerHand) >= 17) {
          if (m_dealerHand.length <= 1) {
            console.log(`Dealer registered as higher than 17 with ${m_dealerHand.length} cards`);
          }
          m_dealerHand.pop();
        }
      } else if (!humanPlayer.followedChart) {
        let maxHand = null;
        for (let x of humanPlayer.total) {
          if (maxHand === null || (x > maxHand && maxHand <= 21)) {
            maxHand = x;
          }
        }
        if (maxHand === 21) {
          console.log("Player got 21 without following chart");
        }
      }
    }

    while (total(m_dealerHand) < 17) {
      let nextDealerCard = (deckSrvc.draw())
      if (m_forceResultToChart) {
        let humanPlayer = m_players[0];
        if (humanPlayer.followedChart) {
          let dealerUnder = null;
          for (let x of humanPlayer.total) {
            if (x > 21) {
              console.log(`Player followed chart but went over`);
            }
            if (dealerUnder === null || dealerUnder > x) {
              dealerUnder = x;
            }
          }

          let currDealerTotal = total(m_dealerHand);
          let nextCardPossibilities = [];
          for (let i = 1; i <= 12; i++) {
            let val = i + 1;
            if (val > 10) {
              val = 10;
            }
            if (!(val + currDealerTotal >= 17 && val + currDealerTotal >= dealerUnder && val + currDealerTotal <= 21)) {
              nextCardPossibilities.push(i);
            }
          }
          if (!(currDealerTotal + 1 >= 17 && currDealerTotal + 1 >= dealerUnder && currDealerTotal + 1 <= 21)) { //can we put in an ace?
            if (!(currDealerTotal + 11 >= 17 && currDealerTotal + 11 >= dealerUnder && currDealerTotal + 11 <= 21)) {
              nextCardPossibilities.push(0);
            }
          }
          if (nextCardPossibilities.length === 0) {
            console.log("No possibilities for forcing win");
            return;
          }

          nextDealerCard = nextCardPossibilities[Math.floor(Math.random() * nextCardPossibilities.length)];
          nextDealerCard += 13 * Math.floor(Math.random() * 4);

        } else {
          let currDealerTotal = total(m_dealerHand);
          let dealerOver = null;
          for (let x of humanPlayer.total) {
            if (dealerOver === null || dealerOver < x) {
              if (x < 21) {
                dealerOver = x;
              }
              if (x === 21) {
                console.log("Player didn't follow chart and got a 21");
                return;
              }
            }
          }
          if (dealerOver === null) {
            dealerOver = 0;
          }
          let nextCardPossibilities = [];
          for (let i = 1; i <= 12; i++) {
            let val = i + 1;
            if (val > 10) {
              val = 10;
            }
            if (val + currDealerTotal >= 17 && val + currDealerTotal >= dealerOver && val + currDealerTotal <= 21) {
              nextCardPossibilities.push(i);
            } else if (val + currDealerTotal < 17) {
              nextCardPossibilities.push(i);
            }
          }
          if (currDealerTotal + 1 >= 17 && currDealerTotal + 1 > dealerOver && currDealerTotal + 1 <= 21) { //can we put in an ace?
            nextCardPossibilities.push(0);
          } else if (currDealerTotal + 11 >= 17 && currDealerTotal + 11 > dealerOver && currDealerTotal + 11 <= 21) {
            nextCardPossibilities.push(0);
          } else if (currDealerTotal + 1 < 17 && (currDealerTotal + 11 > 21 || currDealerTotal + 11 < 17)) {
            nextCardPossibilities.push(0);
          }

          if (nextCardPossibilities.length === 0) {
            console.log("No possibilities for forcing loss");
            return;
          }

          nextDealerCard = nextCardPossibilities[Math.floor(Math.random() * nextCardPossibilities.length)];
          nextDealerCard += 13 * Math.floor(Math.random() * 4);

        }
      }
      console.log("The next dealer card is: "+nextDealerCard +"\nAnd value is: "+(nextDealerCard%13+1));
      m_dealerHand.push(nextDealerCard);
    }
    dealerTotal = total(m_dealerHand);
    m_dealerValue=dealerTotal;
    console.log("dealer value: " + dealerTotal);
    matchDealerStylesWithHand(false);
    m_players.forEach((cur, i, arr) => {
      if (cur.blackjack) {
        cur.money += Number(cur.bet) * 1.5;
        cur.wonGame = 2;
      } else {
        cur.cards.forEach((hand) => {
          console.log(cur.name + ": Card value: " + total(hand));
          console.log("\tBet: " + cur.bet);
          if (total(hand) > 21) {
            console.log("OVER");
            cur.money -= Number(cur.bet);
            cur.wonGame = -1;
            console.log(cur.money);
          } else if (dealerTotal > 21) {
            cur.money += Number(cur.bet);
            cur.wonGame = 1;
          } else if (total(hand) > dealerTotal) {
            cur.money += Number(cur.bet);
            cur.wonGame = 1;
          } else if (total(hand) < dealerTotal) {
            cur.money -= Number(cur.bet);
            cur.wonGame = -1;
          }
        })
      }
      if (cur.isDoubled) {
        cur.bet /= 2;
        cur.isDoubled = false;
      }
    })
    m_willShuffle= ((deckSrvc.cardsRemaining <= MINREMAININGPERPLAYER * m_numPlayers + 1))

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

  function matchDealerStylesWithHand(hideOne) {
    if (m_dealerHand.length == 0) {
      console.log("Trying to set dealer styles with no cards in dealer's hand");
      return;
    }
    while (m_dealerStyles.length > 0) {
      m_dealerStyles.pop();
    }
    if (hideOne) {
      m_dealerStyles.push(setStyle(m_dealerHand[0]));
      m_dealerStyles.push(setStyle(CARDBACK)); //That number represents the
      return;
    }
    m_dealerHand.forEach((cur) => {
      m_dealerStyles.push(setStyle(cur));
    })
  }



  this.getChartMove = function() {
    return chartMove();
  }

  function putHandToDB() {
    let theHuman = m_players[0];
    let bet = theHuman.bet;
    if (theHuman.isDoubled) {
      bet /= 2;
    }
    let count = m_gameStartCount;
    let followedChart = theHuman.followedChart;
    $http({
      method: "POST",
      url: "/api/addHand",
      data: {
        bet: bet,
        count: count,
        followedChart: followedChart
      }
    })
  }

  function chartMove() {
    //0:stand
    //1:hit
    //2:double
    //3:stand
    if (m_currentPlayer >= m_players.length) {
      console.log("chartMove called outside of player index");
      return;
    }
    if (m_players[m_currentPlayer].cards.length <= m_players[m_currentPlayer].currentHand) {
      console.log("chartMove is being called on a non-existent hand for an existing player");
      return;
    }
    let hand = m_players[m_currentPlayer].cards[m_players[m_currentPlayer].currentHand];
    let handVal = total(hand);
    let soft = isSoft(hand);
    let playerCanDouble = canDouble();
    let playerCanSplit = canSplit();
    let dealerTop = cardValue(dealerTopCard())
    if (handVal >= 19) {
      return 0;
    }

    if (canSplit()) { //need to handle this first, so we don't find soft 16 doing it's stuff...
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
        if (playerCanDouble) {
          return 2;
        } else {
          return 1;
        }
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
        if (dealerTop >= 3 && dealerTop <= 6 && playerCanDouble) {
          return 2;

        }
        return 1;
      }
      if (handVal === 17) {
        if (dealerTop >= 3 && dealerTop <= 6 && playerCanDouble) {
          return 2;
        }
        return 1;
      }
      if (handVal === 16 || handVal === 15) {
        if (dealerTop >= 4 && dealerTop <= 6 && playerCanDouble) {
          return 2;
        }
        return 1;
      }
      if (handVal === 14 || handVal === 13) {
        if (playerCanDouble && (dealerTop === 5 || dealerTop === 6)) {
          return 2;
        }
        return 1;
      }
    }

    if (handVal >= 17) {
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
      if (dealerTop >= 2 && dealerTop <= 10 && playerCanDouble) {
        return 2;
      }
      return 1;
    }
    if (handVal === 10) {
      if (dealerTop >= 2 && dealerTop <= 9 && playerCanDouble) {
        return 2;
      }
      return 1;
    }
    if (handVal === 9) {
      if (dealerTop >= 3 && dealerTop <= 6 && playerCanDouble) {
        return 2;
      }
    }
    return 1;
  }
})









//

app.service('gameSrvc', function(deckSrvc) {
  let m_numPlayers = 0;
  let m_numDecks = 8;
  let m_deckCount = 0;
  let m_players = [];
  let m_dealerHand = [];
  let m_currentPlayer = 0;
  const MINREMAININGPERPLAYER = 5;

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

  this.addPlayer = function(name, money) {
    m_players.push(new Player(name, money, m_players.length));
  }

  this.removePlayer = function() { //~~~Still need to handle computers going bankrupt
    if (m_players.length <= 1) {
      return;
    } else(m_players.pop());
  }

  function resetPlayer(aPlayer) {
    this.cards = [
      []
    ];
    this.currentHand = 0;
    this.blackjack = false;
  }

  this.changeNumDecks = function(numDecks) {
    if (numDecks === deckSrvc.getNumDecks) {
      return;
    }
    deckSrvc.changeNumDecks(numDecks);
  }

  this.deal = function() {
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
    m_currentPlayer = 0;
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
    processTurnEnd();
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

  this.canDouble = function() { //No doubling after a split
    return (m_players[m_currentPlayer].money >= m_players[m_currentPlayer].bet * 2 && m_players[m_currentPlayer].cards.length === 1);
  }

  this.canSplit = function() {
    let currPlayer = m_players[m_currentPlayer];
    let currentHand = currPlayer.cards[currPlayer.currentHand];
    if (currentHand.length != 2) {
      return false;
    }
    if (cardValue(currentHand[0]) !== cardValue(currentHand[1])) {
      return false;
    }
  }

  function incrementPlayer() {
    if (m_players[m_currentPlayer].currentHand + 1 < m_players[m_currentPlayer].cards.length) {
      m_players[m_currentPlayer].currentHand++;
    } else {
      m_currentPlayer++;
      if (m_currentPlayer >= m_players.length) {
        if (m_currentPlayer > m_players.length) {
          console.log("Game ended on a player outside of the index");
          return;
        }
        resolveGame();
      }
    }
  }

  function cardValue(card) {
    toRet = card % 13 + 1;
    if (card > 10) {
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

  function resolveGame() {
    let dealerTotal = total(m_dealerHand)
    if (m_dealerHand.length == 2 && dealerTotal == 21) {
      m_players.forEach(function(cur, i, arr) {
        if (!cur.blackjack) { //They can't have split yet, so we're safe ignoring other possible hands
          cur.money -= cur.bet;
        }
      })
      return;
    }

    m_players.forEach((cur, i, arr) => {
      if (cur.blackjack) {
        cur.money += cur.bet * 1.5;
      } else {
        cur.cards.forEach((hand) => {
          if (total(hand) > dealerTotal) {
            cur.money += cur.bet;
          } else if (total(hand) < dealerTotal) {
            cur.money -= cur.bet;
          }
        })
      }
    })
  }

  function prescreen(caller) {
    caller = caller.toUpperCase();
    if (m_currentPlayer >= m_players.length) {
      console.log("error in gameSrvc, trying to " + caller + " on an out-of-index player");
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
      console.console.log("gamesrvc: player allowed to " + caller + " when at or over 21");
      return false;
    }
    return true;
  }

})

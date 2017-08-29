app.service('deckSrvc',function(){
  let deck=[];
  let numDecks=8;//Default value
  let count=0;

  this.changeNumDecks=function(decks){
    numDecks=decks;
    this.shuffle();
  }

  this.shuffle=function(){
    deck=[];
    let temp=[];
    for(let i=0; i<numDecks*52; i++){
      temp.push(i%52);
    }
    while(temp.length>0){
      deck.push(temp.splice(Math.random()*temp.length,1)[0]);
    }
    count=0;
  }

  this.draw=function(){
    toRet=deck.pop();
    let temp=toRet%13;
    if(toRet>=1 && toRet<=5){
      count++;
    }
    if(toRet==0 || toRet>=9){
      count--;
    }
    return toRet;
  }

  this.cardsRemaining=function(){
    return deck.length;
  }

  this.getCount=function(){
    return count/numDecks;
  }

  this.getNumDecks=function(){
    return numDecks;
  }

})

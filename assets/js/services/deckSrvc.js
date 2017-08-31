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
  };

  this.draw=function(){
    if(deck.length===0){
      this.shuffle();
    }
    toRet=deck.pop();
    let temp=toRet%13;
    if(temp>=1 && temp<=5){
      count++;
    }
    if(temp==0 || temp>=9){
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

  this.getAbsoluteCount=function(){
    return count;
  }

  this.getNumDecks=function(){
    return numDecks;
  }

})

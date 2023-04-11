
var dealerSum = 0; // 10:25  This will keep track of the total point value of dealer's cards
var yourSum = 0;

var dealerAceCount =0; //10:45 this keeps track the of the number of Aces the Dealer Has
var yourAceCount = 0;// We want to keep track of aces so that we can determine how many times
                    // we can  subrtact 10 from  yourSum to avoid going over 21


var hidden;// this keeps track of the dealer's hiddend card
var deck;

var canHit = true; // this allows the player to draw while yourSum is less or equal to 21 , 12:00

window.onload = function(){

    buildDeck();
    shuffleDeck();//15:53
    startGame();

}

function buildDeck(){

    let values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

    let types = ["C", "D", "H", "S"];

    deck = []; // this is the array that will hold the cards, represented by elements of strings 


    for (let i = 0; i < types.length; i++){
        for(let j=0; j <values.length; j++){

            deck.push(values[j] + "-" + types[i]); //13:58 this will populate the deck[] array with 54 cards of corresponding type-value

        }

    }
    //console.log(deck);
}

function shuffleDeck(){

    for(let i = 0; i< deck.length ; i++){
        
        //Math.random method will give us a nubmer between 0 and 1 (including zero, excluding 1)
        //Multiply by 52, this will give us a range of numbers from  zero to 51
        //the Total number  will be 52 because we start at index zero
        // Math.floor rounds down the decimal to nearest  lower integer
        //the line below takes a random number "j"
        let j = Math.floor(Math.random()*deck.length); //(0-1)*(52) =>(0-51.999) ,16:17

        let temp = deck[i]; // this  puts the  card in deck position i in a temporary holding 
        deck[i] = deck[j]; // card in deck[i] is replaced with random card from position deck[j]
        deck[j] = temp; // the original card  now takes the place of the  random card's original position

    }
    console.log(deck); //16:54

}

function  startGame(){

        hidden =deck.pop(); // removes last element of deck "array" and stores that value in "hidden" variable
        dealerSum += getValue(hidden);//18:08 this passes the value of popped  element to getValue function
        dealerAceCount += checkAce(hidden); //20:57 checks if hidden is and Ace

        //console.log(hidden);
        //console.log(dealerSum);//21:27

        //21:58 deal a card to the dealer unless they have sum equal to 17

        while(dealerSum <=17){

            let cardImg = document.createElement("img");// create img tag element
            let card = deck.pop(); //pop the last card in the deck and store its value in "card" variable 
            cardImg.src =  "./cards/" + card + ".png"; // 22:49 assign the source (src) to created CardImg element
                                                       // take from the  cards folder, name of image is card  which is  types[index]-values[index]
                                                       // concatenation is cardsfolder + filename + filetype(in this case .png)
            dealerSum += getValue(card);// the dealer sum is incremented
            dealerAceCount += checkAce(card);// the dealer ace count is incremented
            document.getElementById("dealer-cards").append(cardImg); //23:28  the popped card is appened to "dealer-cards" <div> see line 14 of index.html
                                                                     //<img src = "./cards/4-c/png">-- created and appended to <div>                                   
        }
        console.log(dealerSum);//24:29

        //deal cards for yourself 25:53
        for(let i =0; i<2; i++){
            let cardImg = document.createElement("img");
            let card = deck.pop(); 
            cardImg.src =  "./cards/" + card + ".png";                                           
            yourSum += getValue(card);
            yourAceCount += checkAce(card);
            document.getElementById("your-cards").append(cardImg); //25:56
                                                                   // this will pop 2 random cards and  append them to <div id ="your-cards"> 

        }

        console.log(yourSum);//26:07
        document.getElementById("hit").addEventListener("click",hit); // 26:56  identify the button and 
                                                                      // add a listener that will listen for a click then call a fuction named hit
        document.getElementById("stay").addEventListener("click",stay);//31:20 implement stay fucntion
}

function hit(){  // 27:06
    if(!canHit){  //if canHit is false,  button does nothing , return out of hit function
        return;
    }// 27:35 else if canHit is true deal player a card
    
    let cardImg = document.createElement("img");
    let card = deck.pop(); 
    cardImg.src =  "./cards/" + card + ".png";                                           
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg); //27:35

    if(reduceAce(yourSum,yourAceCount)>21){// 28:34reduceAce function will take yourSum and yourAce count and check if it is greater than 21
    
        canHit = false;  // if reduceAce function is greater than 21 you cant take another card(hit)
                         // example if you draw and A,J, K -> 11+ 10+10 consider Ace as 1 = 1+10+10
                        // A,J, 8 -> 11+10+8 => 1+10+8 = 19, you can take another hit, 29:30
    
                        }
}

function stay(){ //31:40
   
    // when you hit the stay button you total up the  sums of the dealer cards and your cards
    // taking in to consideration the number of aces, where they can be 11 or 1 depending if you exceed 21 or not
    // because we want the dealer and the player to stay within the game if possible
    dealerSum = reduceAce(dealerSum,dealerAceCount);
    yourSum =reduceAce(yourSum,yourAceCount)
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png" //33:03 this will reveal the dealer's card

    //this will display the message 33:11
    let message ="";
    if(yourSum > 21){
        message = " Yo Busted!!!"
    }
    else if(dealerSum> 21){
        message ="You Win!!"

    }
    else if(yourSum ==dealerSum){//both you and dealer <=21
        message ="It's a Tie."
    }   
    else if(yourSum >dealerSum){
        message ="You Win!!"
    }  
    else if(yourSum <dealerSum){
        message ="You Lose!!"
    }
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;  

    document.getElementById("results").innerText = message;//35:06, This inserts the value of the message variable into
                                                           // the <p> (paragraph) element with the "result" id
}

function getValue(card){  //recieves the  value of popped card in the form of string element "types[index]-values[index]"
        let data = card.split("-"); // "4-C" -> by calling split on a dash we are splitting the values "4" and "C"
                                    // this gives us an array ["4","C"]
        let value = data[0]; // this stores the  first element of  array "data" to variable "value"
        
        
        if (isNaN(value)){  // if "value" is (NaN) NOT A NUMBER, This coditon returns true

                if (value  == "A"){  // this converts the string into a numerical value a
                    return 11; //if the  card is and Ace the value returned is 11
                }
                return 10; // 19:59 However if the card is not and Ace(i.e. Face Card), the value returned is 10

        }
        //eLse if the "value"IS A NUMBER
        return parseInt(value); // 20:08 return the value if it is a number
                               //Note to Larry: parseInt converts any variable to an integer


}

function checkAce(card){

    if(card[0]== "A"){// apparently this parses the string automatically into an array? ,maybe
        return 1;
    }
    return 0;

}

function reduceAce(playerSum, playerAceCount){ //29:30

        while (playerSum > 21 && playerAceCount >0){ // this function will repeat until playerSum  is less than 21 or player runs out of Aces

            playerSum -=10;  //30:07 reduces the player sum by 10
            playerAceCount -= 1; //reduces the Ace count by 1, effectively demoting the ace from 11 to a 1
        }                       
        return playerSum;

}
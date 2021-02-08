document.querySelector("#hit").addEventListener("click", blackjackHit);

let blackjackGame = {
    'You': { 'scoreSpan': '#user-score', 'div': '#user-box', 'score': 0 },
    'Dealer': { 'scoreSpan': '#dealer-score', 'div': '#dealer-box', 'score': 0 },
    'Cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],
    'CardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': [1, 11], 'J': 10, 'K': 10, 'Q': 10 },
    'Wins': 0,
    'Losses': 0,
    'Draws': 0,
    'isHit': false,
    'isStand': false,
    'turnsOver': false,

};
const YOU = blackjackGame['You'];
const DEALER = blackjackGame['Dealer'];

const hitsound = new Audio('sounds/hit.m4a');
const winsound = new Audio('sounds/cash.mp3');
const losssound = new Audio('sounds/aww.mp3');

function blackjackHit() {
    if (blackjackGame['isStand'] == false) {

        let card = randomCard();
        // let card = '2'
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }
    blackjackGame['isHit'] = true;
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['Cards'][randomIndex];
}
function showCard(activeUser, card) {
    if (activeUser['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activeUser['div']).appendChild(cardImage);
        hitsound.play();
    }
}

document.querySelector('#deal').addEventListener('click', blackjackDeal);

function blackjackDeal() {
    if (blackjackGame['turnsOver'] == true) {

        let yourImages = document.querySelector('#user-box').querySelectorAll('img');
        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#user-score').textContent = 0;
        document.querySelector('#dealer-score').textContent = 0;

        document.querySelector('#user-score').style.color = 'black';
        document.querySelector('#dealer-score').style.color = 'black';

        document.querySelector('#intro').textContent = 'Lets Play!!!'
        document.querySelector('#intro').style.color = 'black'
    }

    blackjackGame['isStand'] = false;
    blackjackGame['turnsOver'] = false;
    blackjackGame['isHit'] = false;


}

function updateScore(card, activePlayer) {
    // activePlayer can be You or Dealer 
    if (card == 'A') {
        // We will decide whether we should add 1 or 11
        if (activePlayer['score'] + blackjackGame['CardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['CardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGame['CardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGame['CardsMap'][card];
    }

}

function showScore(activePlayer) {
    if (activePlayer['score'] <= 21) {

        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}
// Computer's logic
document.querySelector('#stand').addEventListener('click', computer);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function computer() {
    // to use sleep function the funcion should be asynchronous
    if (blackjackGame['isHit'] == true) {

        blackjackGame['isStand'] = true;
        while (DEALER['score'] < 16 || YOU['score']>DEALER['score'] && YOU['score']<22) {
            let card = randomCard();
            showCard(DEALER, card);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }

        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
    }
}
// compute winner 
function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {

            blackjackGame['Wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['Losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] == DEALER['score']) {
            blackjackGame['Draws']++;
            console.log('You drew');
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['Losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['Draws']++;
        console.log('You drew');
    }
    // console.log('winner is '+ winner);
    console.log(blackjackGame);
    return winner;
}
function showResult(winner) {
    if (blackjackGame['turnsOver'] == true) {

        let message, messageColor;
        if (winner == YOU) {
            message = 'You Won';
            messageColor = 'green';
            winsound.play();
            document.querySelector('#wins').textContent = blackjackGame['Wins'];

        }
        else if (winner == DEALER) {
            message = 'You Lost';
            messageColor = 'red';
            losssound.play();
            document.querySelector('#losses').textContent = blackjackGame['Losses'];

        }
        else {
            message = 'You Drew';
            messageColor = 'Black';
            document.querySelector('#draws').textContent = blackjackGame['Draws'];
        }
        document.querySelector('#intro').textContent = message;
        document.querySelector('#intro').style.color = messageColor;
    }
}

/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

let roundScore, scores, activePlayer, gameStatus , totalScore, playersClick ,click = 0;
init();

let dom = document.getElementById('scorelimit');
totalScore = 50;
document.querySelector('.btn-roll').addEventListener('click',function(){
    if(gameStatus){
        click += 1;

        let dice1 = Math.floor((Math.random() * 6) + 1);
        let dice2 = Math.floor((Math.random() * 6) + 1);

        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        document.querySelector('#dice-1').src = 'dice-'+dice1+'.png';
        document.querySelector('#dice-2').src = 'dice-'+dice2+'.png';

        document.getElementById('click-'+activePlayer).textContent = click;

        //checking for 2 consecutive 6 clicks 
        if(players[activePlayer].click >= 6 && click >= 6){
            document.getElementById('current-'+activePlayer).textContent = 0;
            nextPlayer();
        }

        if(dice1 !== 1 && dice2 !== 1){
            roundScore += (dice1 + dice2);
            document.getElementById('current-'+activePlayer).textContent = roundScore;
        } else {
            setTimeout(() => {
                document.getElementById('current-'+activePlayer).textContent = 0;
                nextPlayer();
            },500);
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click',function(){
    if(gameStatus){

        if(dom.value){
            totalScore = dom.value;
        }

        players[activePlayer].score += roundScore;
        document.getElementById('score-'+activePlayer).textContent = players[activePlayer].score;
        document.getElementById('current-'+activePlayer).textContent = 0;

        if(players[activePlayer].score >= totalScore){
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.getElementById('name-'+activePlayer).textContent = 'Winner!';
            gameStatus = false;
        } else {
            nextPlayer();
        }
    }
});

document.querySelector('.btn-new').addEventListener('click',init);

function init(){
    roundScore = 0;
    activePlayer = 0;
    players = [{ score : 0, click : 0},
             { score : 0, click : 0} ];
    gameStatus = true;
    click = 0;
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('click-1').textContent = 0;
    document.getElementById('click-0').textContent = 0;
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}

function nextPlayer(){
    //saved the number of clicks
    players[activePlayer].click = click;

    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;
    click = 0;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}
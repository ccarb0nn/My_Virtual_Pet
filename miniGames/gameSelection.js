// import Pet from './pet/pet.js'; 
import Player from '../player.js';

export function selectGame(){
    // Player
    let storedPlayerName = localStorage.getItem('playerName');
    let allFood = localStorage.getItem('allFood');
    let xp = localStorage.getItem('xp');
    let lvl = localStorage.getItem('lvl');

    //Pet
    let storedPet = JSON.parse(localStorage.getItem('selectedPet'));
    let hunger = localStorage.getItem('hunger');
    let mood = localStorage.getItem('mood');
    let energy = localStorage.getItem('energy');

    if(energy <= 10){
        alert("Your Pet Does Not Have Enough Energy To Play A Game Right Now...");
        console.log("Redirecting to Runner MiniGame...");
        // Redirect to runner.html
        window.location.href = "./home.html";
    }
    else{
        let randomGame = getRandomNum(1, 3);
        switch(randomGame){
            case 1:
                // Select/Start (Dodge Ball Game)
                // Player Stats
                localStorage.setItem('playerName', storedPlayerName);
                localStorage.setItem('allFood', allFood);

                // Pet Stats 
                localStorage.setItem('hunger', hunger);
                localStorage.setItem('mood', mood);
                localStorage.setItem('energy', energy);
                console.log("Redirecting to DodgeBall MiniGame...");
                // Redirect to dodgeBall.html
                window.location.href = "./miniGames/dodgeBall/dodgeBall.html";
                break;
            case 2:
                // Select/Start (Runner Game)
                // PLayer Stats
                localStorage.setItem('playerName', storedPlayerName);
                localStorage.setItem('allFood', allFood);
                localStorage.setItem('xp', xp);
                localStorage.setItem('lvl', lvl);

                // Pet Stats
                localStorage.setItem('selectedPet', JSON.stringify(storedPet));
                localStorage.setItem('hunger', hunger);
                localStorage.setItem('mood', mood);
                localStorage.setItem('energy', energy);
                console.log("Redirecting to Runner MiniGame...");
                // Redirect to runner.html
                window.location.href = "./miniGames/runner/runner.html";
                break;
            case 3:
                // Select/Start (Runner Game)
                // PLayer Stats
                localStorage.setItem('playerName', storedPlayerName);
                localStorage.setItem('allFood', allFood);
                localStorage.setItem('xp', xp);
                localStorage.setItem('lvl', lvl);
    
                // Pet Stats
                localStorage.setItem('selectedPet', JSON.stringify(storedPet));
                localStorage.setItem('hunger', hunger);
                localStorage.setItem('mood', mood);
                localStorage.setItem('energy', energy);
                console.log("Redirecting to Wall Escape MiniGame...");
                // Redirect to runner.html
                window.location.href = "./miniGames/wallEscape/wallEscape.html";
                break;
        }
    }
}
function getRandomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.selectGame = selectGame;
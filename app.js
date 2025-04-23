import Pet from './pet.js';
import Player from './player.js';

export let player;
export let myPet;

document.addEventListener("DOMContentLoaded", function () {
    // Ask for player name once the page is loaded
    startGame();
});

window.addEventListener("pageshow", () => {
    if (localStorage.getItem("petCaught") === "true") {
        catchPet();
        localStorage.removeItem("petCaught");
    }
});

function startGame() {
    // Player
    let storedPlayerName = localStorage.getItem('playerName');
    let allFood = localStorage.getItem('allFood');
    let xp = localStorage.getItem('xp');
    let lvl = localStorage.getItem('lvl');

    // Pet
    let storedPet = JSON.parse(localStorage.getItem('selectedPet'));
    let hunger = localStorage.getItem('hunger');
    let mood = localStorage.getItem('mood');
    let energy = localStorage.getItem('energy');

    if (storedPlayerName && storedPet) {
        // If player name and pet are stored, use them
        myPet = new Pet(storedPet.name, storedPet.type);
        myPet.startTimer();
        myPet.hunger = parseInt(hunger);
        myPet.happiness = parseInt(mood);
        myPet.energy = parseInt(energy);
        myPet.updateUI();
        window.myPet = myPet;

        player = new Player(storedPlayerName);
        player.addPet(myPet);
        player.food = parseInt(allFood);
        player.level = parseInt(lvl);
        player.stats.xp = parseInt(xp);
        player.updateUI();
    } else {
        // If no player name or pet is stored, ask for details
        const playerName = prompt("Enter your name:");
        if (playerName) {
            // Player
            localStorage.setItem('playerName', playerName);
            localStorage.setItem('allFood', 0);
            localStorage.setItem('xp', 0);
            localStorage.setItem('lvl', 1);
            player = new Player(playerName);
        } else {
            alert("You must enter a name to play!");
            return;
        }
        localStorage.setItem('firstLogin', false);
        createPet(); // Start new pet selection process
    }
}

function createPet() {
    const petType = prompt("What pet do you want? (dog, cat, or monk)").toLowerCase();
    switch (petType) {
        case 'dog':
            myPet = new Pet('CLOUD', petType);
            break;
        case 'cat':
            myPet = new Pet('GARF', petType);
            break;
        case 'monk':
            myPet = new Pet('FUDGE', petType);
            break;
        case 'rex':
            myPet = new Pet('REX', petType);
            break;
        case 'turt':
            myPet = new Pet('TURT', petType);
            break;
        default:
            alert("Invalid choice! Defaulting to a dog.");
            myPet = new Pet('CLOUD', 'dog');
    }
    
    player.addPet(myPet);
    myPet.startTimer();
    window.myPet = myPet;
    myPet.updateUI();
    player.updateUI();

    // Store selected pet in localStorage
    localStorage.setItem('selectedPet', JSON.stringify({ name: myPet.name, type: myPet.type }));
    localStorage.setItem('hunger', myPet.hunger);
    localStorage.setItem('mood', myPet.happiness);
    localStorage.setItem('energy', myPet.energy);
}

function renamePet() {
    const newName = prompt("Enter a new name for your pet:");
    if (newName) {
        myPet.rename(newName);
        myPet.updateUI();  // Update name in UI
    }
}

function resetGame() {
    localStorage.removeItem('playerName');
    localStorage.removeItem('lvl');
    localStorage.removeItem('xp');
    localStorage.removeItem('selectedPet');
    localStorage.removeItem('hunger');
    localStorage.removeItem('mood');
    localStorage.removeItem('energy');
    localStorage.removeItem('firstLogin');
    localStorage.setItem('firstLogin', "true");

    // PETS BOUGHT RESET
    localStorage.setItem("rexPhoto", "./petPhotos/Rex-Lock-Pet.png");
    localStorage.setItem("rexBought", "false");
    localStorage.setItem("turtPhoto", "./petPhotos/Turt-Lock-Pet.png");
    localStorage.setItem("turtBought", "false");
    
    alert("Game reset! Reloading...");
    window.location.href = "home.html"; // Reload the page
}

window.renamePet = renamePet;
window.resetGame = resetGame;
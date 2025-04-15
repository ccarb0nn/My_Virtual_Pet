import Pet from './pet.js'; 
import Player from './player.js';

document.addEventListener("DOMContentLoaded", function () {
    alert("The Pet Ran Behind One of The Doors, Guess Which One To Catch It!");
});

// Retrieve player from localStorage (if exists)
let storedPlayerName = localStorage.getItem('playerName');
let player = storedPlayerName ? new Player(storedPlayerName) : new Player("Default");


export function catchPet(guess){
    let newPet;
    const randomPet = getRandomNum(1, 3);
    const randomType = getRandomNum(1, 5);
    
    if(guess === randomPet){
        const newPetName = prompt("CONGRATS! You caught the pet, What would you like to name your new pet?");
        switch(randomType){
            case 1:
                newPet = new Pet(newPetName, 'dog');  // Create a new pet
                break;
            case 2:
                newPet = new Pet(newPetName, 'cat');  // Create a new pet
                break;
            case 3:
                newPet = new Pet(newPetName, 'monk');  // Create a new pet
                break;
            case 4:
                newPet = new Pet(newPetName, 'rex');  // Create a new pet
                unlockPet(4);
                break;
            case 5:
                newPet = new Pet(newPetName, 'turt');  // Create a new pet
                unlockPet(5);
                break;
        }
        player.addPet(newPet);  // Add new pet to the player's collection
        alert(`You caught a new pet named ${newPetName}!`);

        localStorage.setItem('selectedPet', JSON.stringify({ name: newPet.name, type: newPet.type }));
    }
    else{
        alert("Oh no! The pet fled before you could find it!");  // Pet fled, notify the user
    }

    // Redirect to home.html
    console.log("Redirecting to home.html...");
    window.location.href = "home.html";  
}
function getRandomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function unlockPet(randomType){
    switch(randomType){
        case 4: 
            // Unlock Pet (Rex)
            localStorage.setItem("rexPhoto", "./petPhotos/Rex-Pet.png");
            localStorage.setItem("rexBought", "true");
            break;
        case 5: 
            // Unlock Pet (Turt)
            localStorage.setItem("turtPhoto", "./petPhotos/Turt-Pet.png");
            localStorage.setItem("turtBought", "true");
            break;
    }
}

window.catchPet = catchPet;
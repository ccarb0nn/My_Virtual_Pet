// Player
const playerName = localStorage.getItem('playerName');  
let allFood = localStorage.getItem('allFood');
allFood = parseInt(allFood);
let xp = localStorage.getItem('xp');
xp = parseInt(xp);
let lvl = localStorage.getItem('lvl');
let hasFunds;

let bought = localStorage.getItem('petBought');
let boughtT = localStorage.getItem('tBought');

// Pet
let storedPet = JSON.parse(localStorage.getItem('selectedPet'));
const hunger = localStorage.getItem('hunger');
const mood = localStorage.getItem('mood');
const energy = localStorage.getItem('energy');


document.addEventListener("DOMContentLoaded", function () {
    const rexPhoto = localStorage.getItem("rexPhoto") || "./petPhotos/Rex-Lock-Pet.png";
    const rexBought = localStorage.getItem("rexBought") === "true";

    const petImage = document.getElementById("pet-image-rex-lock");
    const buyButton = document.getElementById("buyRex");

    petImage.src = rexPhoto;

    if (rexBought) {
        buyButton.innerText = "Select Pet";
        buyButton.onclick = function () {
            changePet(3);
        };
    } 
    else {
        buyButton.innerText = "Buy: 400🍎";
        buyButton.onclick = function () {
            buyPet(3);
        };
    }

    const turtPhoto = localStorage.getItem("turtPhoto") || "./petPhotos/Turt-Lock-Pet.png";
    const turtBought = localStorage.getItem("turtBought") === "true";

    const turtImage = document.getElementById("pet-image-turt-lock");
    const turtButton = document.getElementById("buyTurt");

    turtImage.src = turtPhoto;

    if (turtBought) {
        turtButton.innerText = "Select Pet";
        turtButton.onclick = function () {
            changePet(4);
        };
    } 
    else {
        turtButton.innerText = "Buy: 250🍎";
        turtButton.onclick = function () {
            buyPet(4);
        };
    }
});

let petName; 
let notSet = false; // Did user name pet 
let petType;

export function buyPet(petIndex) {
    switch (petIndex) {
        case 0:
            petType = 'dog';  // Dog selected
            if(notSet){
                petName = 'CLOUD';
            }
            break;
        case 1:
            petType = 'cat';  // Cat selected
            if(notSet){
                petName = 'GARF';
            }
            break;
        case 2:
            petType = 'monk'; // Monkey selected
            if(notSet){
                petName = 'FUDGE';
            }
            break;
        case 3:
            hasFunds = allFood - 400;
            if(hasFunds > 0){
                alert("You Bought Rex For 400🍎");
                allFood -= 400; // Subtract Cost From User
                localStorage.setItem('allFood', allFood);  
                bought = true;
                updatePetImage();

                getName();
                petType = 'rex'; // Rex selected
                if(notSet){
                    petName = 'REX';
                }
                storedPet.name = petName;
                storedPet.type = petType;
            }
            else{
                alert("You Do Not Have Enough Food To Purchase Rex, Rex Costs 400🍎");
                bought = false; 
            }
            break;
        case 4:
            hasFunds = allFood - 1;
            if(hasFunds > 0){
                alert("You Bought Turt For 250🍎");
                allFood -= 250; // Subtract Cost From User
                localStorage.setItem('allFood', allFood);  
                boughtT = true;
                updatePetImage();

                getName();
                petType = 'turt';
                if(notSet){
                    petName = 'TURT';
                }
                storedPet.name = petName;
                storedPet.type = petType;
            }
            else{
                alert("You Do Not Have Enough Food To Purchase Turt, Turt Costs 250🍎");
                boughtT = false; 
            }
            break;
    } 
    // Save the selected pet in localStorage
    localStorage.setItem('selectedPet', JSON.stringify(storedPet));

    // Redirect to home.html
    window.location.href = "home.html"; 
}

function getName(){
    petName = prompt("What would you like to name your pet?");
    if (petName === null || petName.trim() === ""){
        notSet = true;
    }
}

function updatePetImage() {
    const petImage = document.getElementById("pet-image-rex-lock");
    const buyButton = document.getElementById("buyRex");

    if(bought === true){
        const newImage = './petPhotos/Rex-Pet.png';
        petImage.src = newImage;

        buyButton.innerText = "Select Pet";
        buyButton.onclick = function() {
            changePet(3);
        };

        localStorage.setItem("rexPhoto", newImage);
        localStorage.setItem("rexBought", true);
    }
    else{
        petImage.src = './petPhotos/Rex-Lock-Pet.png';
    }

    const turtImage = document.getElementById("pet-image-turt-lock");
    const turtButton = document.getElementById("buyTurt");
    if(boughtT === true){
        const tImage = './petPhotos/Turt-Pet.png';
        turtImage.src = tImage;

        turtButton.innerText = "Select Pet";
        turtButton.onclick = function() {
            changePet(4);
        };

        localStorage.setItem("turtPhoto", tImage);
        localStorage.setItem("turtBought", true);
    }
    else{
        petImage.src = './petPhotos/Turt-Lock-Pet.png';
    }
}

window.buyPet = buyPet;
import Player from "./player.js";

let storedPet = localStorage.getItem('selectedPet');
        let hunger = localStorage.getItem('hunger');
        let mood = localStorage.getItem('mood');
        let energy = localStorage.getItem('energy');
        let firstLogin = localStorage.getItem('firstLogin');

export default class Pet {
    constructor(name, type){

        if(firstLogin){
            this.name = name;
            this.type = type || 'dog';
            this.level = 1;
            this.xp = 0;
            this.hunger = 100;      // 100 = Full & 0 = Starving 
            this.happiness = 100;   // 100 = Happy & 0 = Sad 
            this.energy = 100;      // 100 = Rested & 0 = Tired
        }
        else{
            this.name = storedPet.name || name;
            this.type = storedPet.type || type;
            this.level = 1;
            this.xp = 0;
            this.hunger = hunger;      // 100 = Full & 0 = Starving 
            this.happiness = mood;   // 100 = Happy & 0 = Sad 
            this.energy = energy;      // 100 = Rested & 0 = Tired

        }
        
        this.timer = null;
        this.updateUI();
    }

    startTimer() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.decreaseStats();
            }, 5000); // Decrease stats every 5 seconds
        }
    }

    decreaseStats() {
        this.hunger = Math.max(0, this.hunger - 5);
        this.happiness = Math.max(0, this.happiness - 2);
        // Increase energy when pet is not doing anything 
        if(this.hunger == 0){
            this.energy = Math.max(0, this.energy - 3);
        }
        else if(this.energy >= 100){
            this.energy = 100;
        }
        else{
            this.energy = Math.max(0, this.energy + 3);
        }

        console.log(`Hunger: ${this.hunger}, Happiness: ${this.happiness}, Energy: ${this.energy}`);

        localStorage.setItem('hunger', this.hunger);
            localStorage.setItem('mood', this.happiness);
            localStorage.setItem('energy', this.energy);

        // Update UI if needed
        this.updateUI();
    }

    updateUI() {
        const petNameElem = document.getElementById("pet-name");
        const hungerElem = document.getElementById("hunger");
        const happinessElem = document.getElementById("happiness");
        const energyElem = document.getElementById("energy");

        if (petNameElem && hungerElem && happinessElem && energyElem) {
            petNameElem.innerText = this.name;
            hungerElem.innerText = `Hunger: ${this.hunger}`;
            happinessElem.innerText = `Happiness: ${this.happiness}`;
            energyElem.innerText = `Energy: ${this.energy}`;
        }

        this.updatePetImage(); // Make sure the correct pet image updates
    }

    updatePetImage() {
        const petImage = document.getElementById("pet-image");
        let petType = this.type;
        if(petType === 'dog'){
            // If hunger is low, show a sad face 
            // If all stats are 0, show the dead image first
            if(this.hunger === 0 && this.happiness === 0 && this.energy === 0){
                petImage.src = './petPhotos/Dog-Pet-Dead.png'; // Use an image where the pet looks dead
            }
            // If any stat is low (<= 40), show the sad image
            else if (this.hunger <= 35 || this.happiness <= 35 || this.energy <= 45) {
                petImage.src = './petPhotos/Dog-Pet-Sad.png'; // Use an image where the pet looks hungry
            }
            // If all stats are healthy (>= 35), show the regular image
            else {
                petImage.src = './petPhotos/Dog-Pet.png'; // Use the regular image when the pet is healthy
            }
        }
        else if (petType === 'cat'){
            // If hunger is low, show a sad face 
            // If all stats are 0, show the dead image first
            if(this.hunger === 0 && this.happiness === 0 && this.energy === 0){
                petImage.src = './petPhotos/Cat-Pet-Dead.png'; // Use an image where the pet looks dead
            }
            // If any stat is low (<= 40), show the sad image
            else if (this.hunger <= 35 || this.happiness <= 35 || this.energy <= 35) {
                petImage.src = './petPhotos/Cat-Pet-Mad.png'; // Use an image where the pet looks hungry
            }
            // If all stats are healthy (>= 35), show the regular image
            else {
                petImage.src = './petPhotos/Cat-Pet.png'; // Use the regular image when the pet is healthy
            } 
        }
        else if (petType === 'monk'){
            // If hunger is low, show a sad face 
            // If all stats are 0, show the dead image first
            if(this.hunger === 0 && this.happiness === 0 && this.energy === 0){
                petImage.src = './petPhotos/Monk-Pet-Dead.png'; // Use an image where the pet looks dead
            }
            // If any stat is low (<= 40), show the sad image
            else if (this.hunger <= 35 || this.happiness <= 35 || this.energy <= 35) {
                petImage.src = './petPhotos/Monk-Pet-Sad.png'; // Use an image where the pet looks hungry
            }
            // If all stats are healthy (>= 35), show the regular image
            else {
                petImage.src = './petPhotos/Monk-Pet.png'; // Use the regular image when the pet is healthy
            } 
        }
        else if (petType === 'rex'){
            // If hunger is low, show a sad face 
            // If all stats are 0, show the dead image first
            if(this.hunger === 0 && this.happiness === 0 && this.energy === 0){
                petImage.src = './petPhotos/Rex-Pet-Dead.png'; // Use an image where the pet looks dead
            }
            // If any stat is low (<= 40), show the sad image
            else if (this.hunger <= 35 || this.happiness <= 35 || this.energy <= 35) {
                petImage.src = './petPhotos/Rex-Pet-Sad.png'; // Use an image where the pet looks hungry
            }
            // If all stats are healthy (>= 35), show the regular image
            else {
                petImage.src = './petPhotos/Rex-Pet.png'; // Use the regular image when the pet is healthy
            } 
        }
        else if (petType === 'turt'){
            // If hunger is low, show a sad face 
            // If all stats are 0, show the dead image first
            if(this.hunger === 0 && this.happiness === 0 && this.energy === 0){
                petImage.src = './petPhotos/Turt-Pet-Dead.png'; // Use an image where the pet looks dead
            }
            // If any stat is low (<= 40), show the sad image
            else if (this.hunger <= 35 || this.happiness <= 35 || this.energy <= 35) {
                petImage.src = './petPhotos/Turt-Pet-Sad.png'; // Use an image where the pet looks hungry
            }
            // If all stats are healthy (>= 35), show the regular image
            else {
                petImage.src = './petPhotos/Turt-Pet.png'; // Use the regular image when the pet is healthy
            } 
        }
        
    }

    checkStats() {
        if (this.hunger <= 0 || this.happiness <= 0 || this.energy <= 0) {
            clearInterval(this.timer); // Stop game if pet is in bad condition
            alert(`${this.name} is too weak! Game Over!`);
        }
    }

    addXP(amount) {
        this.xp += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        if (this.xp >= 100) {  // Example: Level up every 100 XP
            this.level++;
            this.xp = 0;
            console.log(`${this.name} leveled up to Level ${this.level}!`);
        }
    }

    feed() {
        // Player
        let allFood = localStorage.getItem('allFood');
        let playerName = localStorage.getItem('playerName');
        let playerXP = localStorage.getItem('xp');
        let playerlvl = localStorage.getItem('lvl');
        let player = new Player(playerName, playerlvl);
        player.food = parseInt(allFood);
        player.level = parseInt(playerlvl);
        player.stats.xp = parseInt(playerXP);


        if(player.food === 0){
            alert("You Do Not Have Enough Food To Feed Your Pet Right Now...");
        }
        else if(player.food < 20){
            // Feed Pet and Take food from player
            player.food -= 5;
            this.hunger += 5;
            
            // If pets hunger after being fed would be greater than 100, then return the extra food back to user. (else dont compensate the player)
            let totalHunger = this.hunger;
            let returnFood = totalHunger - 100;
            console.log("FOOD: ", returnFood);
            if (returnFood > 0){
                player.food += returnFood;
            } 
        }
        else {
            // Feed Pet and Take food from player
            player.food -= 20;
            this.hunger += 20;
            
            // If pets hunger after being fed would be greater than 100, then return the extra food back to user. (else dont compensate the player)
            let totalHunger = this.hunger;
            let returnFood = totalHunger - 100;
            console.log("FOOD: ", returnFood);
            if (returnFood > 0){
                player.food += returnFood;
            } 
        }
        let food = player.food;
            localStorage.setItem('allFood', food);
            localStorage.setItem('xp', playerXP);
            localStorage.setItem('lvl', playerlvl);
            if (this.hunger > 100) this.hunger = 100;
            player.updateUI();
            this.updateUI();
    }

    play() {
        if(this.energy <= 10){
            alert("Pet Does Not Have Enough ENERGY To Play Right Now...");
        }
        else{
            this.happiness += 15;
            this.energy -= 10; // Playing makes the pet tired
            if (this.happiness > 100) this.happiness = 100;
            this.updateUI();
        }
    }

    sleep() {
        this.energy += 30;
        if (this.energy > 100) this.energy = 100;
        this.updateUI();
    }

    rename(newName) {
        this.name = newName;
        localStorage.setItem('selectedPet', JSON.stringify({ name: this.name, type: this.type }));
        this.updateUI(); // Update the name in the HTML
    }
}
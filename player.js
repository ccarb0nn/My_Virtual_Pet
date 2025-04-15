class Player {
    constructor(name, level) {
        this.name = name;
        this.level = level || 1;
        this.pets = [];
        this.stats = { xp: 0, gamesWon: 0, petsCollected: 0};
        this.food = 0;
    }

    increaseStats(points, xp) {
        this.food = points;
        this.addXP(xp);

        console.log(`Food: ${this.food}, Level: ${this.level}`);

        // Update UI if needed
        this.updateUI();
    }

    updateUI() {
        const playerName = document.getElementById("player-name");
        const foodPoints = document.getElementById("food");
        const playerLevel = document.getElementById("player-level");
        const playerXP = document.getElementById("player-xp");

        if (playerName && foodPoints && playerLevel) {
            playerName.innerText = this.name;
            foodPoints.innerText = `Food: ${this.food}`;
            playerLevel.innerText = `Level: ${this.level}`;
            playerXP.innerText = `XP: ${this.stats.xp}`;
        }
    }

    addXP(amount) {
        this.stats.xp += amount;
        this.checkLevelUp();
        if(this.stats.xp >= 100){
            this.checkLevelUp();
        }
    }

    checkLevelUp() {
        if (this.stats.xp >= 100) {  // Example: Level up every 100 XP
            this.level++;
            this.stats.xp -= 100;
            console.log(`${this.name} leveled up to Level ${this.level}!`);
        }
    }

    getStats() {
        console.log(`Player: ${this.name} | Level: ${this.level} | XP: ${this.stats.xp} | Games Won: ${this.stats.gamesWon} | Pets Collected: ${this.stats.petsCollected}`);
    }

    addPet(pet) {
        this.pets.push(pet);  // Adds a new pet to the player's collection
    }

    getPet(petName) {
        return this.pets.find(pet => pet.name === petName);  // Find a pet by name
    }

    getPets(){
        return this.pets;
    }
}

export default Player;
import Player from '../../player.js';
import { catchPet } from '../catchPet.js';
// ---------------[ Gather USER/PET Info ] ----------------------|
// Player
const playerName = localStorage.getItem('playerName'); 
let allFood = localStorage.getItem('allFood');
let xp = localStorage.getItem('xp');
let lvl = localStorage.getItem('lvl');
xp = parseInt(xp);

// Pet
let storedPet = JSON.parse(localStorage.getItem('selectedPet'));
const hunger = localStorage.getItem('hunger');
const mood = localStorage.getItem('mood');
const energy = localStorage.getItem('energy');

// ---------------[ Alert Player When Page Loads With Message ] ----------------------|

// Check if player has already tried to catch a pet for the day 
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("dailyCatch") === "true") {
        alert("YOU HAVE ALREADY TRIED TO CATCH THE PET TODAY, try again later...");
         // Redirect to home.html
        console.log("Redirecting to home.html...");
        window.location.href = "../home.html";
    }
    else{
        alert("(GOAL: Get Food For Your Pet & Level Up!)");
    }
});

// START the GAME when the start BUTTON is CLICKED
document.getElementById("start-button").addEventListener("click", function () {
    // Hide the start button
    this.style.display = "none";

    // Create a new Phaser game after the button click
    const game = new Phaser.Game(config);
});

// -----------------------------------------------------------------------------------------------------------------------------

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let score = 0;
let scoreText;
let timeLeft = 30;
let timerText;
let cursors;
let space;
let enter;
let randomItem = 0;
let enterPressed = false;
// Kep track of items found
let itemsFound = [];
let keyFound = false; 
let chestOpened = false;
let petFound = false;

// ------ MAP to TRACK LOCATIONS SEARCHED ------
const itemSpots = new Map();
itemSpots.set("bag", false);    // Bag by stone wall
itemSpots.set("chest", false);  // Chest
itemSpots.set("barrel", false); // barrel by cart 
itemSpots.set("bucket", false); // bucket -> by house1
itemSpots.set("pot", false);    // Pot -> by house2
itemSpots.set("wagon", false);  // Wagon 
itemSpots.set("crow", false);   // Scarecrow  
itemSpots.set("rockA", false);  // Rock bottom-L
itemSpots.set("rockB", false);  // Rock bottom-R
itemSpots.set("rockC", false);  // Rock L
itemSpots.set("rockD", false);  // Rock Top-L
itemSpots.set("bush", false);   // Bush by the stone wall 
itemSpots.set("water", false);  // Water / Bridge 
itemSpots.set("house1", false); // House / L
itemSpots.set("house2", false); // House / M
itemSpots.set("house3", false); // House / R
itemSpots.set("tree1", false);  // TREE -> M-L
itemSpots.set("tree2", false);  // TREE -> R
itemSpots.set("log", false);  // LOG STACK -> L1

function preload(){
    // Load your tilemap and tileset image
    this.load.image('map', './PetMap.png');

    // Load player image based on selected Pet
    switch(storedPet.type){
        case 'dog':
            this.load.image('player', '../petPhotos/Dog-Pet.png');
            break;
        case 'cat':
            this.load.image('player', '../petPhotos/Cat-Pet.png');
            break;
        case 'monk':
            this.load.image('player', '../petPhotos/Monk-Pet.png');
            break;
        case 'rex':
            this.load.image('player', '../petPhotos/Rex-Pet.png');
            break;
        case 'turt':
            this.load.image('player', '../petPhotos/Turt-Pet.png');
            break;
        default:
            this.load.image('player', '../petPhotos/Dog-Pet.png');
            break;
    }

}

function create() {
    // MAP SPAWN
    this.add.image(0, 0, 'map').setOrigin(0, 0);

    this.cameras.main.setBounds(0, 0, 960, 640);
    this.physics.world.setBounds(0, 0, 960, 640);


    // Create the player sprite
    player = this.physics.add.sprite(160, 570, 'player');
    // Resize image based on the pet/image selected
    switch(storedPet.type){
        case 'dog':
            player.setScale(0.04); // Shrinks player image
            break;
        case 'cat':
            player.setScale(0.06); // Shrinks player image 
            break;
        case 'monk':
            player.setScale(0.08); // Shrinks player image
            break;
        case 'rex':
            player.setScale(0.12); // Shrinks player image
            break;
        case 'turt':
            player.setScale(0.1); // Shrinks player image 
            break;
        default:
            player.setScale(0.04); // Shrinks player image
            break;
    }
    player.setCollideWorldBounds(true); // Keep the player inside the world bounds
    this.cameras.main.startFollow(player, true, 0.05, 0.05); // Camera follows player

    // Enable the keyboard input
    cursors = this.input.keyboard.createCursorKeys();  // Phaser's built-in cursor keys
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // ----- [ ON SCREEN TEXT ] -----
    // Creating the TIMER text at the top left corner of the screen
    timerText = this.add.text(740, 545, `${timeLeft}s`, {fontSize: '24px', fontStyle: 'bold', fill: '#000'});
    timerText.setScrollFactor(0);
    // Starting the COUNTDOWN TIMER (decreases every second)
    this.enemyTimer = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    })
    // Scorebored for coins collected by player
    scoreText = this.add.text(30, 545, 'SCORE: 0', {fontSize: '24px', fontStyle: 'bold', fill: '#000'});
    scoreText.setScrollFactor(0);

    // ----- Map Boarder & Object Collision ------
    spawnBariers(player, this);
    // Spawn secret locations
    spawnLocations(player, this);
}

function update() {
    // Reset velocity
    player.setVelocity(0);

    // Normal Mevment 
    // Move left/right
    if (cursors.left.isDown) {
        player.setVelocityX(-100);
    } else if (cursors.right.isDown) {
        player.setVelocityX(100);
    }
    // Move up/down
    if (cursors.up.isDown) {
        player.setVelocityY(-100);
    } else if (cursors.down.isDown) {
        player.setVelocityY(100);
    }

    // Movement boost
    // Move left/right
    if (cursors.left.isDown && space.isDown) {
        player.setVelocityX(-150);
    } else if (cursors.right.isDown && space.isDown) {
        player.setVelocityX(150);
    }
    // Move up/down
    if (cursors.up.isDown && space.isDown) {
        player.setVelocityY(-150);
    } else if (cursors.down.isDown && space.isDown) {
        player.setVelocityY(150);
    }

    // Check if player is searching (pressing enter)
    if(enter.isDown && enterPressed == false){
        randomItem = getRandomNum(1, 4); // generate the random item 
        enterPressed = true;
    }
    else if(enter.isUp){
        enterPressed = false; 
    }
}

function spawnBariers(player, scene){
    // ----- Map Boarder & Object Collision ------
    let blockers = scene.physics.add.staticGroup();

    // STONE WALL (left to right)
    blockers.create(70, 470, null).setSize(100, 2).setVisible(false); 
    blockers.create(260, 470, null).setSize(100, 1).setVisible(false); 
    blockers.create(320, 470, null).setSize(100, 2).setVisible(false); 
    blockers.create(440, 470, null).setSize(100, 2).setVisible(false); 

    // GARDEN FENCE (left to right)
    blockers.create(60, 140, null).setSize(90, 5).setVisible(false); 
    blockers.create(180, 140, null).setSize(60, 5).setVisible(false);
    blockers.create(210, 90, null).setSize(5, 110).setVisible(false);

    // HOUSES (left to right)
        // House 1
    blockers.create(410, 90, null).setSize(5, 110).setVisible(false);
    blockers.create(470, 155, null).setSize(110, 5).setVisible(false);
    blockers.create(530, 90, null).setSize(5, 110).setVisible(false);
        // House 2
    blockers.create(605, 90, null).setSize(5, 110).setVisible(false);
    blockers.create(665, 155, null).setSize(110, 5).setVisible(false);
    blockers.create(725, 90, null).setSize(5, 110).setVisible(false);
        // House 3
    blockers.create(800, 90, null).setSize(5, 110).setVisible(false);
    blockers.create(875, 155, null).setSize(130, 5).setVisible(false);
    blockers.create(920, 90, null).setSize(5, 110).setVisible(false);

    // WATER / BRIDGE  
        // Bridge bottom
    blockers.create(730, 480, null).setSize(155, 2).setVisible(false);
    blockers.create(730, 495, null).setSize(155, 2).setVisible(false);
    blockers.create(730, 520, null).setSize(150, 1).setVisible(false);
    blockers.create(658, 515, null).setSize(150, 1).setVisible(false);
    blockers.create(670, 540, null).setSize(175, 2).setVisible(false);
        // Bridge top
    blockers.create(785, 410, null).setSize(155, 2).setVisible(false);
    blockers.create(785, 380, null).setSize(155, 2).setVisible(false);
    blockers.create(820, 362, null).setSize(155, 2).setVisible(false);
    blockers.create(820, 380, null).setSize(155, 2).setVisible(false);
    blockers.create(785, 355, null).setSize(155, 2).setVisible(false);
    blockers.create(807, 330, null).setSize(130, 2).setVisible(false);
    blockers.create(774, 290, null).setSize(65, 3).setVisible(false);

    // ROCKS 
        // Large Rocks - (left to right && bottom to top)
    blockers.create(500, 575, null).setSize(5, 1).setVisible(false);
    blockers.create(880, 555, null).setSize(5, 2).setVisible(false);
    blockers.create(367, 75, null).setSize(5, 2).setVisible(false);
        // Medium Rocks 
    blockers.create(195, 395, null).setSize(15, 1).setVisible(false);

    // TREES (left to right)
        // Top left tree
    blockers.create(355, 160, null).setSize(1, 35).setVisible(false);
        // Middle left tree
    blockers.create(465, 360, null).setSize(6, 35).setVisible(false);
    blockers.create(465, 350, null).setSize(45, 35).setVisible(false);
    blockers.create(465, 320, null).setSize(35, 15).setVisible(false);
    blockers.create(465, 310, null).setSize(10, 15).setVisible(false);
        // Middle riht tree
    blockers.create(640, 320, null).setSize(1, 45).setVisible(false);
    blockers.create(640, 320, null).setSize(40, 30).setVisible(false);
        // Top right tree 
    blockers.create(910, 220, null).setSize(1, 45).setVisible(false);
    blockers.create(910, 215, null).setSize(60, 40).setVisible(false);

    // LOGs (left to right)
    blockers.create(360, 245, null).setSize(16, 4).setVisible(false);
    blockers.create(553, 175, null).setSize(16, 4).setVisible(false);
    blockers.create(745, 175, null).setSize(12, 4).setVisible(false);

    // OTHER (left to right)
        // Barrel 
    blockers.create(145, 320, null).setSize(10, 1).setVisible(false);
        // Cart
    blockers.create(65, 250, null).setSize(60, 1).setVisible(false);
        // Scare-Crow 
    blockers.create(65, 40, null).setSize(4, 40).setVisible(false);
        // Chest 
    blockers.create(890, 395, null).setSize(10, 2).setVisible(false);

    // MAP WALLS/FENCES 
        // Left side wall barier 
    blockers.create(15, 225, null).setSize(1, 800).setVisible(false);
        // Bottom wall barier 
    blockers.create(485, 620, null).setSize(900, 1).setVisible(false);
        // Righ side wall barier 
    blockers.create(940, 225, null).setSize(1, 800).setVisible(false);
    // NO NEED FOR -> Top wall barier since the player cant go above the fence and it visually looks fine
    

    // Add collision between player and blockers^
    scene.physics.add.collider(player, blockers);
}

// Create locations where the user must search for the items 
function spawnLocations(player, scene){
    // ----- SECRET LOCATIONS --> [ Pet, Food, Key ] ------
    let locations = scene.physics.add.staticGroup();
    // Locations 
    let bag = locations.create(275, 490, null).setSize(2, 2).setVisible(false);
    let chest = locations.create(890, 415, null).setSize(6, 6).setVisible(false);
    let water = locations.create(780, 425, null).setSize(8, 6).setVisible(false);
    let barrel = locations.create(145, 325, null).setSize(12, 14).setVisible(false);
    let bucket = locations.create(490, 210, null).setSize(1, 1).setVisible(false);
    let pot = locations.create(695, 210, null).setSize(1, 1).setVisible(false);
    let wagon = locations.create(65, 240, null).setSize(8, 8).setVisible(false);
    let crow = locations.create(65, 55, null).setSize(8, 25).setVisible(false);

    let house1 = locations.create(455, 165, null).setSize(8, 6).setVisible(false);
    let house2 = locations.create(645, 165, null).setSize(8, 6).setVisible(false);
    let house3 = locations.create(835, 165, null).setSize(8, 6).setVisible(false);

    let bush = locations.create(485, 490, null).setSize(10, 2).setVisible(false);
    let tree1 = locations.create(465, 385, null).setSize(10, 8).setVisible(false);
    let tree2 = locations.create(910, 255, null).setSize(10, 8).setVisible(false);
    let log = locations.create(360, 250, null).setSize(25, 8).setVisible(false);

    let rockA = locations.create(500, 585, null).setSize(8, 6).setVisible(false);
    let rockB = locations.create(880, 560, null).setSize(6, 6).setVisible(false);
    let rockC = locations.create(195, 398, null).setSize(35, 14).setVisible(false);
    let rockD = locations.create(370, 80, null).setSize(16, 6).setVisible(false);


    // Add overlap detection between PLAYER & SECRET LOCATIONS (Pet hiding spots & FOOD / KEY)
    scene.physics.add.overlap(player, bag, () => checkObject("bag"), checkInteraction, null, this);
    scene.physics.add.overlap(player, chest, () => checkObject("chest"), checkInteraction, null, this);
    scene.physics.add.overlap(player, water, () => checkObject("water"), checkInteraction, null, this);
    scene.physics.add.overlap(player, barrel, () => checkObject("barrel"), checkInteraction, null, this);
    scene.physics.add.overlap(player, bucket, () => checkObject("bucket"), checkInteraction, null, this);
    scene.physics.add.overlap(player, pot, () => checkObject("pot"), checkInteraction, null, this);
    scene.physics.add.overlap(player, wagon, () => checkObject("wagon"), checkInteraction, null, this);
    scene.physics.add.overlap(player, crow, () => checkObject("crow"), checkInteraction, null, this);
    scene.physics.add.overlap(player, house1, () => checkObject("house1"), checkInteraction, null, this);
    scene.physics.add.overlap(player, house2, () => checkObject("house2"), checkInteraction, null, this);
    scene.physics.add.overlap(player, house3, () => checkObject("house3"), checkInteraction, null, this);
    scene.physics.add.overlap(player, bush, () => checkObject("bush"), checkInteraction, null, this);
    scene.physics.add.overlap(player, tree1, () => checkObject("tree1"), checkInteraction, null, this);
    scene.physics.add.overlap(player, tree2, () => checkObject("tree2"), checkInteraction, null, this);
    scene.physics.add.overlap(player, tree2, () => checkObject("tree2"), checkInteraction, null, this);
    scene.physics.add.overlap(player, log, () => checkObject("log"), checkInteraction, null, this);
    scene.physics.add.overlap(player, rockA, () => checkObject("rockA"), checkInteraction, null, this);
    scene.physics.add.overlap(player, rockB, () => checkObject("rockB"), checkInteraction, null, this);
    scene.physics.add.overlap(player, rockC, () => checkObject("rockC"), checkInteraction, null, this);
    scene.physics.add.overlap(player, rockD, () => checkObject("rockD"), checkInteraction, null, this);
}
// Check if user pressed enter when 
function checkInteraction(){
    if(enterPressed){
        enterPressed = false;
        return true;
    }
    return false
}

function checkObject(loc){
    // Check if location has already been searched 
    if(itemSpots.get(loc) == false){

        // Check if user can acsess the chest (needs key) 
        if(loc == "chest" && keyFound == true && chestOpened == false){
            chestOpened = true; 
            alert("YOU FOUND TONS OF FOOD!");
            console.log("U FOUND TONS OF FOOD");
            score += 150; // Add this to users account
            scoreText.setText('SCORE: ' + score);
        }
        else if(loc == "chest" && keyFound == false){
            alert("YOU NEED A KEY TO UNLOCK THIS CHEST");
            console.log("U NEED THE KEY");
        }
        else if(loc == "chest" && chestOpened == true){
            alert("YOU ALREADY OPENED THIS CHEST");
            console.log("CHEST WAS ALREADY OPENED");
        }
        else{
            // Set Secret-Location as SEARCHED 
            itemSpots.set(loc, true);
            // Generate the random Item (check if item is a one time collectable)
            if( itemsFound.includes(4) && itemsFound.includes(3)){
                randomItem = getRandomNum(1, 2);
            }
            else if(itemsFound.includes(4)){
                randomItem = getRandomNum(1, 3);
                console.log("ITEM ALREADY FOUND, generated new item: ", randomItem);
            }
            else if(itemsFound.includes(3)){
                while(randomItem == 3){
                    randomItem = getRandomNum(1, 4);
                }
            }
            // Generate the random item for the location
            getItem(randomItem)
        }
    }
    // User has already searched this Secret-Location 
    else{
        console.log("U CHECKED THIS LOCATION ALREADY");
    }
}
function getRandomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add XP as a item that can be obtained
function getItem(randomItem){
    // Give Item to user and mark as found 
    itemsFound.push(randomItem);
        switch(randomItem){
            case 1:
                alert("YOU FOUND FOOD");
                console.log("U FOUND FOOD");
                // Update player score 
                score += 10;
                scoreText.setText('SCORE: ' + score);
                break;
            case 2:
                alert("YOU FOUND NOTHING...");
                console.log("U FOUND NOTHING");
                break;
            case 3:
                alert("YOU FOUND THE KEY");
                keyFound = true;
                console.log("U FOUND A KEY");
                break;
            case 4:
                alert("YOU FOUND THE PET!");
                petFound = true;
                console.log("U FOUND THE PET");
                break;
        }
}

function updateTimer(){
    if (timeLeft <= 0){
        timeLeft = 0;
        console.log("Timer ended, searching over...");
        gameOver();
    }
    else{
        timeLeft--;
        timerText.setText(`${timeLeft}s`) // Update text/number
    }
}

function gameOver(){
    // Storing player/pet info 
    localStorage.setItem('playerName', playerName);
    allFood = parseInt(allFood); 
    allFood += score;
    localStorage.setItem('allFood', allFood);
    localStorage.setItem('xp', xp);
    localStorage.setItem('lvl', lvl);

    localStorage.setItem('selectedPet', JSON.stringify(storedPet));
    localStorage.setItem('hunger', hunger);
    localStorage.setItem('mood', 100);
    localStorage.setItem('energy', energy);

    if(petFound){
        localStorage.setItem('petCaught', 'true');
    }
    else{
        alert("Oh no! The pet fled before you could find it!");  // Pet fled, notify the user
    }

    
    // Redirect to home.html
    console.log("Redirecting to home.html...");
    window.location.href = "../home.html";
}
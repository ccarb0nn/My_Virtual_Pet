import Player from '../../player.js';
// ---------------[ Gather USER/PET Info ] ----------------------|
// Player
const playerName = localStorage.getItem('playerName'); 
const allFood = localStorage.getItem('allFood');
let xp = localStorage.getItem('xp');
let lvl = localStorage.getItem('lvl');
xp = parseInt(xp);

// Pet
let storedPet = JSON.parse(localStorage.getItem('selectedPet'));
const hunger = localStorage.getItem('hunger');
const mood = localStorage.getItem('mood');
const energy = localStorage.getItem('energy');

// ---------------[ Alert Player When Page Loads With Message ] ----------------------|
document.addEventListener("DOMContentLoaded", function () {
    alert("(GOAL: Get Food For Your Pet & Level Up!)");
});

// START the GAME when the start BUTTON is CLICKED
document.getElementById("start-button").addEventListener("click", function () {
    // Hide the start button
    this.style.display = "none";

    // Create a new Phaser game after the button click
    const game = new Phaser.Game(config);
});

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
let cursors;
let space;

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
    this.cameras.main.startFollow(player, true, 0.05, 0.05);

    // Enable the keyboard input
    cursors = this.input.keyboard.createCursorKeys();  // Phaser's built-in cursor keys
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ----- Map Boarder & Object Collision ------
    let blockers = this.physics.add.staticGroup();
    // brick wall (left to right)
    blockers.create(70, 470, null).setSize(100, 2).setVisible(false); 
    blockers.create(255, 470, null).setSize(100, 1).setVisible(false); 
    blockers.create(320, 470, null).setSize(100, 2).setVisible(false); 
    blockers.create(440, 470, null).setSize(100, 2).setVisible(false); 
    // garden fence (left to right)
    blockers.create(60, 140, null).setSize(90, 5).setVisible(false); 
    blockers.create(180, 140, null).setSize(60, 5).setVisible(false);
    blockers.create(210, 90, null).setSize(5, 110).setVisible(false);
    // Houses (left to right)
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
    blockers.create(880, 155, null).setSize(130, 5).setVisible(false);
    blockers.create(920, 90, null).setSize(5, 110).setVisible(false);
    // Water/Ponf 
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
    // Rocks (large only) 
    blockers.create(880, 555, null).setSize(5, 2).setVisible(false);
    this.physics.add.collider(player, blockers);
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
}

import Player from '../../player.js';

let game;
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



document.addEventListener("DOMContentLoaded", function () {
    alert("(GOAL: Get Food For Your Pet & Level Up!)");
});

document.getElementById("start-button").addEventListener("click", function(){
    // Hide the button once the game begins
    this.style.display = "none";

    // Create a new Phaser game
    game = new Phaser.Game(config);
});



// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800, // 80% of the screen width
    height: 600, // 80% of the screen height
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {gravity: {y: 0}}
    },
    scene: {preload, create, update}
};

let player;
let enemies = [];
let cursors;

let timerText;
let timeLeft = 20; // 20-second timer

let coin;
let score = 0;
let scoreText;
let level = 1;
let levelText; // Declare levelText globally
let space; 
let gameOver;
let stats; 

function preload() {
    // Load a simple player sprite
    // Load player image based on selected Pet
    switch(storedPet.type){
        case 'dog':
            this.load.image('player', '../../petPhotos/Dog-Pet.png');
            break;
        case 'cat':
            this.load.image('player', '../../petPhotos/Cat-Pet.png');
            break;
        case 'monk':
            this.load.image('player', '../../petPhotos/Monk-Pet.png');
            break;
        case 'rex':
            this.load.image('player', '../../petPhotos/Rex-Pet.png');
            break;
        case 'turt':
            this.load.image('player', '../../petPhotos/Turt-Pet.png');
            break;
        default:
            this.load.image('player', '../../petPhotos/Dog-Pet.png');
            break;
    }
    // Load an enemy sprite 
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/red_ball.png');
    // Load coin sprite (players objective)
    this.load.image('coin', 'https://labs.phaser.io/assets/sprites/apple.png'); 
}

function create() {
    // ----- [ SPRITE LOCATION ] -----
    // Add player at the center
    player = this.physics.add.sprite(400, 300, 'player');
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
    player.setCollideWorldBounds(true); // Prevent going outside the game area
    // Add coin (random location)
    coin = this.physics.add.sprite(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'coin');
    coin.setImmovable(true);
    coin.setScale(0.5); // Coin is scaled down to 50% of its original size 
    // Adding enemies based on level 
    createEnemies(this, level);

    // ----- [ COLLISION LOGIC ] -----
    // Collision between PLAYER & ENEMY
    this.physics.add.collider(player, enemies, hitEnemy, null, this); 
    // Collision between ENEMY & ENEMY
    this.physics.add.collider(enemies, enemies);
    // Collision between PLAYER & COIN
    this.physics.add.overlap(player, coin, collectCoin, null, this);
    // Collision between ENEMY & COIN
    this.physics.add.collider(enemies, coin);

    // ----- [ ON SCREEN TEXT ] -----
    // Creating the TIMER text at the top left corner of the screen
    timerText = this.add.text(20, 20, `${timeLeft}s`, {fontSize: '24px', fill: '#fff'});
    // Starting the COUNTDOWN TIMER (decreases every second)
    this.enemyTimer = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    })
    // Scorebored for coins collected by player
    scoreText = this.add.text(20, 560, 'SCORE: 0', {fontSize: '24px', fill: '#fff'});
    // Current Level the player is on
    levelText = this.add.text(665, 20, 'LEVEL: 1', {fontSize: '24px', fill: '#fff'});

    // ----- [ KEYBOARD ] -----
    // Enable keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
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
        player.setVelocityX(-200);
    } else if (cursors.right.isDown && space.isDown) {
        player.setVelocityX(200);
    }
    // Move up/down
    if (cursors.up.isDown && space.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown && space.isDown) {
        player.setVelocityY(200);
    }
}

function createEnemies(scene, level){
    console.log(`Creating enemies for level ${level}...`);
    // Clear previous enemies 
    enemies.forEach(enemy => enemy.destroy());
    enemies = [];

    // Adding enemies based on level
    // Spawn enemies at a radom location on the edges of the screen
    for (let i = 0; i < level * 5; i++){
        let edge = Phaser.Math.Between(0, 3); // Random edge
        let x, y;
        if (edge === 0) {
            // Top edge
            x = Phaser.Math.Between(0, 800);
            y = 0;
        } else if (edge === 1) {
            // Bottom edge
            x = Phaser.Math.Between(0, 800);
            y = 600;
        } else if (edge === 2) {
            // Left edge
            x = 0;
            y = Phaser.Math.Between(0, 600);
        } else {
            // Right edge
            x = 800;
            y = Phaser.Math.Between(0, 600);
        }
        let enemy = scene.physics.add.sprite(x, y, 'enemy');
        enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100)); // Random movement (horixontal speed) (vertical speed)
        enemy.setBounce(1); // Enemies bounce off walls
        enemy.setCollideWorldBounds(true);
        enemies.push(enemy);
    }
    scene.physics.add.collider(enemies, enemies);
}

function updateTimer(){
    timeLeft--;
    timerText.setText(`${timeLeft}s`) // Update text/number

    if (timeLeft <= 0){
        console.log("Timer ended, calling nextLevel()...");
        nextLevel(this); // Move to next level when timer reaches 0
    }
}

function hitEnemy(player, enemy){
    console.log("Collision detected!");
    player.scene.physics.pause(); // Stop all movement
    player.setTint(0xff0000); // Change player color to red
    endGame(player.scene);
}

function collectCoin(player, coin){
    console.log("COIN COLLECTED!");
    coin.disableBody(true, true); // Removes coin once collected
    score += 5;
    scoreText.setText('SCORE: ' + score);
    // Create a new coin at a new location
    coin.enableBody(true, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), true, true);
}

function nextLevel(scene){
    console.log("Starting next level...");
    level++; // Increase level count
    levelText.setText('LEVEL: ' + level); // Update level on screen
    timeLeft = 20; // Reset timer
    timerText.setText(`${timeLeft}s`);
    scene.physics.resume();
    // Create new enemies for the current level
    createEnemies(scene, level);
    // ----- [ COLLISION LOGIC ] -----
    // Collision between PLAYER & ENEMY
    scene.physics.add.collider(player, enemies, hitEnemy); 
    // Collision between ENEMY & ENEMY
    scene.physics.add.collider(enemies, enemies);
    // Collision between ENEMY & COIN
    scene.physics.add.collider(enemies, coin);

}

// When the game ends do this:
    // Pass the points earned to the players account (to main game)
    // Transition player to  home.html (alert them this is occuring)
function endGame(scene) {
    player.scene.physics.pause();
    scene.enemyTimer.remove();

    // Game over text
    gameOver = scene.add.text(330, 180, 'GAME OVER', {fontSize: '24px', fill: '#fff'});
    gameOver.alpha = 0;

    // Fade in the 'GAME OVER' text
    scene.tweens.add({
        targets: gameOver,
        alpha: 1,
        duration: 1000,
        ease: 'Power2'
    });


    // Players Game Stats 
    stats = scene.add.text(150, 240, 'LEVEL REACHED:' + level + " & FOOD COLLECTED: " + score, {fontSize: '24px', fill: '#fff'});
    stats.alpha = 0;

    // Fade in the stats text
    scene.tweens.add({
        targets: stats,
        alpha: 1,
        duration: 1000,
        ease: 'Power2'
    });

    // Restart Button
    let restartButton = scene.add.text(400, 350, 'Click to Finish', {fontSize: '24px', fill: '#3498db'}).setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
        scene.tweens.add({
            targets: [gameOver, stats, restartButton],
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                let food = parseInt(allFood);
                food += score;
                console.log(`food: ${food}`);

                // Player
                let plyr = new Player(playerName, lvl);
                plyr.stats.xp += xp;
                xp = score/2;
                plyr.addXP(xp);
                localStorage.setItem('playerName', playerName);
                localStorage.setItem('allFood', food);
                localStorage.setItem('xp', plyr.stats.xp);
                localStorage.setItem('lvl', plyr.level);

                // Pet
                localStorage.setItem('selectedPet', JSON.stringify(storedPet));
                localStorage.setItem('hunger', hunger);
                localStorage.setItem('mood', 100);
                localStorage.setItem('energy', energy-10);
                // Redirect to home.html if the button is pressed
                window.location.href = "../../home.html"; 
            }
        })
    })
}
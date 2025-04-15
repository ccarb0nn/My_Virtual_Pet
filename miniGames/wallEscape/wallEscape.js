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
// ---------------------------------------------------- [ GAME STARTS ] ------------------------------------------- //
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
let enemies;
let enemy;
let wait;
let coin;
let score = 0;
let scoreText;
let timeSurvived = 0;
let timeText;
let playerSpeed = 80;
let boost = 100;
let boostText;
let cursors;
let space;

// Preload assets
function preload() {
    // Load player and enemy images
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
    
    this.load.image('wall', '../../otherPhotos/Wall.png');
    // Load coin sprite (players objective)
    this.load.image('coin', 'https://labs.phaser.io/assets/sprites/apple.png'); 
}

// Create the game objects
function create() {
    // Create the player sprite
    player = this.physics.add.sprite(400, 500, 'player');
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

    coin = this.physics.add.sprite(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'coin');
    coin.setImmovable(true);
    coin.setScale(0.5); // Coin is scaled down to 50% of its original size 

    // Create the enemies group
    enemies = this.physics.add.group();

    // Enable the keyboard input
    cursors = this.input.keyboard.createCursorKeys();  // Phaser's built-in cursor keys
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Add collision detection between player and enemies
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    // Collision between ENEMY & ENEMY
    this.physics.add.collider(enemies, enemies);
    // Collision between PLAYER & COIN
    this.physics.add.overlap(player, coin, collectCoin, null, this);

    // Survival TIMER for time survived
    this.timer = setInterval(() => {
        timeSurvived++;
    }, 1000);

    // Start spawning enemies after a delay
    this.enemyTimer = this.time.addEvent({
        delay: 700,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });    
    

    // Timer Display for player survival time
    timeText = this.add.text(20, 20, 'TIME: 0', {fontSize: '24px', fill: '#fff'});
    timeText.setDepth(1);
    // Scorebored for coins collected by player
    scoreText = this.add.text(20, 560, 'SCORE: 0', {fontSize: '24px', fill: '#fff'});
    scoreText.setDepth(1);
    // Current Level the player is on
    boostText = this.add.text(645, 20, 'Boost: 100', {fontSize: '24px', fill: '#fff'});
    boostText.setDepth(1);
}

// Update the game objects every frame
function update() {
    // Time Display (counts up)
    timeText.setText('TIME: ' + timeSurvived + 's');

    let isBoosting = space.isDown && boost > 0;
    let boosting = false;

    // Check if user has boost to use 
    if(isBoosting){
        decreaseBoost();
        boosting = true;
    }
    else{
        increaseBoost();
    }

    let currentSpeed = (space.isDown && boost > 0 && isBoosting) ? playerSpeed + 70 : playerSpeed;


    // Handle player movement using Phaser's cursors
    if (cursors.up.isDown) {
        player.setVelocityY(-currentSpeed);
    } else if (cursors.down.isDown) {
        player.setVelocityY(currentSpeed);
    } else {
        player.setVelocityY(0); // Stop vertical movement
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-currentSpeed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(currentSpeed);
    } else {
        player.setVelocityX(0); // Stop horizontal movement
    }
}

function decreaseBoost(){
    if(boost !== 0){
        boost -= 1;
    }
    boostText.setText('BOOST: ' + boost); // Update level on screen
}

function increaseBoost(){
    if(boost < 100){
        boost += 1;
    }
    else if(boost >= 100){
        boost = 100;
    }
    boostText.setText('BOOST: ' + boost); // Update level on screen
}

// Spawn an enemy at a random edge of the screen
function spawnEnemy() {
    enemy = enemies.create(Phaser.Math.Between(0, 800), 0, 'wall'); // Top
    enemy.setVelocityY(100);
    enemy.setScale(0.02);
    // Enable physics for the enemy
    this.physics.world.enable(enemy);

    // If Player Has Survived longer than 20s then introduce a second enemy to avoid
    if (timeSurvived > 30){
        let enemy2 = enemies.create(Phaser.Math.Between(0, 800), 0, 'wall'); // Top
        enemy2.setVelocityY(100);
        enemy2.setScale(0.02);
        // Enable physics for the enemy
        this.physics.world.enable(enemy2);
    }
}

// Handle collision between player and enemies
function hitEnemy(player, enemy) {
    // Game Over logic
    alert("Game Over! You were caught by an enemy!");
    // Change to gameOver
    gameOver(this);
}

function collectCoin(player, coin){
    console.log("COIN COLLECTED!");
    coin.disableBody(true, true); // Removes coin once collected
    if(timeSurvived > 30){
        score += 10;
    }
    else{
        score += 5;
    }
    scoreText.setText('SCORE: ' + score);
    // Create a new coin at a new location
    coin.enableBody(true, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), true, true);
}

// Reset the game state
function gameOver(scene) {
    // Stop timer 
    clearInterval(scene.timer);
    player.setPosition(400, 300); // Reset player position
    enemies.clear(true, true); // Remove all enemies
    scene.enemyTimer.remove(); // Stop enemys from spawning 
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

    // Players Game Stats (Time Survived: Coins Collected)
    let stats = scene.add.text(150, 240, 'TIME SURVIVED:' + timeSurvived + "s & FOOD COLLECTED: " + score, {fontSize: '24px', fill: '#fff'});
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
                
                // Debugging 
                console.log(`food: ${food}`);
                console.log(`xp: ${xp}`);

                // Player XP/Level Increase 
                let plyr = new Player(playerName, lvl);
                plyr.stats.xp += xp;
                xp = score/2;
                console.log(`xp: ${xp}`);
                plyr.addXP(xp);
                //Bonus Food For User
                let bonusFood = plyr.level * 5;  // (REPLACE) Add the number of bonus food based on time survuved like seconds
                food += bonusFood;
                // Save Player
                localStorage.setItem('playerName', playerName);
                localStorage.setItem('allFood', food);
                localStorage.setItem('xp', plyr.stats.xp);
                localStorage.setItem('lvl', plyr.level);
                // Save Pet
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
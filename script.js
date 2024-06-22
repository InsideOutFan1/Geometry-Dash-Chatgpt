const player = document.getElementById('player');
const obstaclesContainer = document.getElementById('obstacles');
let gameSpeed = 3;
let isJumping = false;

function update() {
    // Move obstacles
    let obstacles = document.getElementsByClassName('obstacle');
    for (let obstacle of obstacles) {
        obstacle.style.left = parseInt(obstacle.style.left) - gameSpeed + 'px';
        
        // Remove obstacles that have gone off screen
        if (parseInt(obstacle.style.left) < -40) {
            obstaclesContainer.removeChild(obstacle);
        }
        
        // Check collision with player
        if (isColliding(player, obstacle)) {
            gameOver();
            return;
        }
    }
    
    // Generate new obstacle randomly
    if (Math.random() < 0.02) {
        createObstacle();
    }
    
    // Move player forward
    player.style.bottom = parseInt(player.style.bottom) + gameSpeed + 'px';
    
    // Check if player is out of bounds
    if (parseInt(player.style.bottom) > 400 || parseInt(player.style.bottom) < 0) {
        gameOver();
    }
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = '800px'; // Start from the right edge
    obstacle.style.bottom = '50px'; // Height above ground (adjustable)
    obstaclesContainer.appendChild(obstacle);
}

function isColliding(player, obstacle) {
    let playerRect = player.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();
    
    return !(playerRect.right < obstacleRect.left || 
             playerRect.left > obstacleRect.right || 
             playerRect.bottom < obstacleRect.top || 
             playerRect.top > obstacleRect.bottom);
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpHeight = 100; // Adjustable jump height
        let jumpDuration = 500; // Adjustable jump duration
        
        let startTime = Date.now();
        let initialBottom = parseInt(player.style.bottom);
        
        function jumpStep() {
            let elapsedTime = Date.now() - startTime;
            if (elapsedTime < jumpDuration) {
                let progress = (elapsedTime / jumpDuration);
                let newBottom = initialBottom + jumpHeight * Math.sin(progress * Math.PI);
                player.style.bottom = newBottom + 'px';
                requestAnimationFrame(jumpStep);
            } else {
                isJumping = false;
            }
        }
        
        jumpStep();
    }
}

function gameOver() {
    alert('Game Over!');
    // You can add more game over logic here
    // For example, restart the game
    location.reload();
}

// Event listeners
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') { // Spacebar for jumping
        jump();
    }
});

// Game loop
setInterval(update, 1000 / 60); // 60 FPS

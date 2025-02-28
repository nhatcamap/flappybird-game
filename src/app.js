const flappyBirdGame = (gameID) =>{
    let boardGame = document.querySelector(gameID.gameContainer);
    if(boardGame){
        let boardWidth = boardGame.getBoundingClientRect().width;
        let boardHeight = boardGame.getBoundingClientRect().height;
        let board = boardGame.querySelector(gameID.canvasId);
        if(board){
            board.width = boardWidth;
            board.height = boardHeight;
            let context = board.getContext('2d');

            // Tạo đối tượng con chim
            let bird = {
                x: Math.floor(board.width / 4),
                y: Math.floor(board.height / 2),
                radius: 10,
                width: 34,
                height: 24,
                imgs: [
                    new Image(),
                    new Image(),
                    new Image(),
                    new Image()
                ],
                dy: 0,
                fly: -4,
                isGameOver: false
            };

            // Vẽ đối tượng con chim
            bird.imgs[0].src = 'https://raw.githubusercontent.com/ImKennyYip/flappy-bird/refs/heads/master/flappybird0.png';
            bird.imgs[1].src = 'https://raw.githubusercontent.com/ImKennyYip/flappy-bird/refs/heads/master/flappybird1.png';
            bird.imgs[2].src = 'https://raw.githubusercontent.com/ImKennyYip/flappy-bird/refs/heads/master/flappybird2.png';
            bird.imgs[3].src = 'https://raw.githubusercontent.com/ImKennyYip/flappy-bird/refs/heads/master/flappybird3.png';
            let frameIndex = 0;
            let frameCounter = 0;
            let angle = 0;
            const drawBird = () => {
                context.beginPath();
                context.save();
                context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
                context.rotate(angle);
                context.drawImage(bird.imgs[frameIndex], -bird.width / 2, -bird.height / 2, bird.width, bird.height);
                context.restore();
                context.closePath();
                if(frameCounter % 20 == 0){
                    frameIndex++
                }
                if(frameIndex == bird.imgs.length){
                    frameIndex = 0;
                }
                frameCounter++;      
            }
            let i = 0;
            var birdFly = setInterval(() =>{
                i++
                context.beginPath();
                context.drawImage(bird.imgs[i], bird.x, bird.y, bird.width, bird.height);
                context.closePath();
                if(i == 3){
                    i = -1;
                }
            }, 100)

            // Chim rơi
            const fallingBirds = () => {
                bird.y += bird.dy;
                let g = 0.1;
                let maxG = 4;
                bird.dy += g;
                if(bird.dy > maxG){
                    bird.dy = maxG;
                }
                if(bird.y > board.height - bird.height){
                    bird.isGameOver = true;
                } 
                if(bird.y < 0){
                    bird.y = 0;
                    bird.dy = 0;
                    bird.fly = 0;
                    angle = 90 * Math.PI / 180;
                }
            }

            // Tạo đối tượng ống
            let pipe = {
                x: board.width,
                yTop : 0,
                hTop: '',
                gap: 150,
                space: Math.floor(board.width / 3),
                yBottom: '',
                width: 64,
                hBottom: '',
                imgTop: new Image(),
                imgBottom: new Image(),
                dx: -1,
                passed: false,
                score: 0,
                array: []
            } 

            // Vẽ ống
            const drawPipe = (x, hTop, yBottom, hBottom) => {
                context.beginPath();
                pipe.imgTop.src = 'https://raw.githubusercontent.com/ImKennyYip/flappy-bird/refs/heads/master/toppipe.png';
                context.drawImage(pipe.imgTop, x, pipe.yTop, pipe.width, hTop);
                context.closePath();

                context.beginPath();
                pipe.imgBottom.src = 'https://raw.githubusercontent.com/ImKennyYip/flappy-bird/refs/heads/master/bottompipe.png';
                context.drawImage(pipe.imgBottom, x, yBottom, pipe.width, hBottom);
                context.closePath();
            }

            // Tạo các mức ống ngẫu nhiên
            const randomPipe = () =>{
                pipe.hTop = Math.floor(Math.random() * (board.height - pipe.gap * 3)) + pipe.gap;
                pipe.yBottom = pipe.hTop + pipe.gap;
                pipe.hBottom = board.height - pipe.yBottom;
                return {
                    hTop: pipe.hTop,
                    yBottom: pipe.yBottom,
                    hBottom: pipe.hBottom   
                }
            }

            // Hàm tạo ống mới
            const createPipe = () => {
                let pipeRandom = randomPipe();
                pipe.array.push({
                    x: pipe.x,
                    hTop: pipeRandom.hTop,
                    yBottom: pipeRandom.yBottom,
                    hBottom: pipeRandom.hBottom
                });  
            }

            // Tạo 3 ống ban đầu
            for(let i = 0; i < 3; i ++){
                let pipeRandom = randomPipe();
                pipe.array.push({
                    x: pipe.x + i * pipe.space,
                    hTop: pipeRandom.hTop,
                    yBottom: pipeRandom.yBottom, 
                    hBottom: pipeRandom.hBottom
                })
            }

            // Hàm chạy game
            const activiteBird = () => {
                if(bird.isGameOver){
                    pauseGame();
                }
                else{
                    context.clearRect(0, 0, board.width, board.height);
                    fallingBirds();
                    pipe.array.forEach((p) => {
                        drawPipe(p.x, p.hTop, p.yBottom, p.hBottom);
                        p.x += pipe.dx;
                        if(p.x < 0 - pipe.width){
                            pipe.array.shift();
                            createPipe();
                            pipe.score++; 
                        }
                        if(bird.y < p.hTop && (bird.x + bird.width > p.x) && (bird.x < p.x + pipe.width)){
                            bird.dy = 3;
                            bird.fly = 0;
                            angle = 90 * Math.PI / 180;
                        }
                        if((bird.y + bird.height) > p.yBottom && (bird.x + bird.width > p.x) && (bird.x < p.x + pipe.width)){
                            bird.fly = 0;
                            angle = 90 * Math.PI / 180;
                        } 
                    })
                    drawBird();
                    requestAnimationFrame(activiteBird);
                } 
            }

            // Hàm khởi động game
            let isGameStarted = false;
            const startGame = () => {
                if(!isGameStarted){
                    isGameStarted = true;
                    clearInterval(birdFly);
                    activiteBird();
                }
            }

            // Load game
            window.onload = function(){ 
                pipe.array.forEach((p) => {
                    drawPipe(p.x, p.hTop, p.yBottom, p.hBottom);
                });
                document.addEventListener('keydown', e => {
                    if(e.code === 'Space' || e.code === 'ArrowUp'){
                        bird.dy += bird.fly;
                        startGame();
                    }   
                })
                board.addEventListener('click', () =>{
                    bird.dy += bird.fly;
                    startGame();
                })
                for (let index = 0; index < 80; index++) {
                    let leftSnow = Math.floor(Math.random() * boardWidth);
                    let topSnow = Math.floor(Math.random() * boardHeight);
                    let sizeSnow = Math.floor(Math.random() * 16);
                    let timeSnow = Math.floor(Math.random() * 5) + 5;
                    let blurSnow = Math.floor(Math.random() * 10);
                    let div = document.createElement('div');
                    div.classList.add('snow');
                    div.style.right = leftSnow + 'px';
                    div.style.top = topSnow + 'px';
                    div.style.width = sizeSnow + 'px';
                    div.style.height = sizeSnow + 'px';
                    div.style.filter = 'blur(' + blurSnow + 'px)';
                    div.style.animationDuration = timeSnow + 's';
                    boardGame.appendChild(div);   
                }
            }

            // Hàm tạm dừng game
            let restartButton = boardGame.querySelector(gameID.restartBtn);
            const pauseGame = () => {
                context.fillStyle = "rgba(0, 0, 0, 0.7)";
                context.fillRect(0, 0, board.width, board.height);
                context.fillStyle = "#fff";
                context.font = "30px Arial";
                context.textAlign = "center";
                context.fillText("Game Over", board.width / 2, board.height / 3);
                context.fillText("Score: " + pipe.score, board.width / 2, board.height / 2);
                restartButton.style.display = "block";    
            };
            if(restartButton){
                restartButton.onclick = () =>{
                    window.location.reload();   
                }
            } 
        }
    }
}




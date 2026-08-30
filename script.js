/*
const canvas = document.getElementById('board');
const context = board.getContext('2d');

const myImage = new Image();
myImage.src = "Mario.png";
myImage.onload = function () {
    context.drawImage(myImage,10,10,120,120)
} */


//เริ่มสร้าง

//ตั้งค่าหน้าจอเกม
let board;
let boardWidth =  800;
let boardHeight = 300;
let context;

//ตั้งค่าตัวละครเกม
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = 215;
let playerImg;
let player = {
    x:playerX,
    y:playerY,
    width:playerWidth,
    height:playerHeight
}

let gameOver = false;
let score = 0;
let time = 0;

let lives = 3;
let lifeImg;
let gameOverReason = "";

//สร้างอุปสรรค์
let boxImg;
let FloatImg;
let boxWidth = 65; //ขนาดแดง
let boxHeight = 75;
let boxX = 700;
let boxY = 220;

let FloatWidth = 65; //ขนาดผี
let FloatHeight = 75;
let FloatX = 700;
let FloatY = 125;

// setting อุปสรรค์
let boxesArray = [];
let boxSpeed = -3; //ความเร้ว

//Gravity & Velocity
let velocityY = 0;
let gravity = 0.25;

console.log(player);

//กำหนดเหตการดริ่มต้นเกม

window.onload = function() {
    //Display
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    //player
    playerImg = new Image();
    playerImg.src = "Mario.png";
    playerImg.onload = function() {
        context.drawImage(playerImg , player.x , player.y , player.width , player.height); //player.x, player.y, player.width, player.height
    }

    //requst animation frame
    requestAnimationFrame(update);

    //การดักจับการกระโดด
    document.addEventListener("keydown", movePlayer);

    //สร้างBox
    boxImg = new Image();
    boxImg.src = "Red.png";

    FloatImg = new Image();
    FloatImg.src = "Float.png";

    lifeImg = new Image();
    lifeImg.src = "life.png"

    createRandomBox();
}

//function Update
function update() {
    requestAnimationFrame(update);

    if(time >= 60 && !gameOver) {
        gameOver = true;
        gameOverReason = "Game Over!";
    }

    if(gameOver) { //ตรวจสอบส่าเกม 0ver มั้ย
        //แจ้งเตื่อนผู้เล่น
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText(gameOverReason,boardWidth/2 , boardHeight/2);

        context.font = "normal bold 30px Arial";
        context.fillText("Score :" + (score) , boardWidth/2 , 200);

        context.font = "normal bold 20px Arial";
        context.fillText("Time :" + time.toFixed(2) , boardWidth/2 , 250);
        return;
    }

    context.clearRect(0, 0, board.width, board.height); //clear ภาพซ้อน
    velocityY += gravity;

    //create play objact
    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg , player.x , player.y , player.width , player.height);

    for(let i = 0 ; i < lives ; i++) {
        context.drawImage(lifeImg, 10 + (i * 35), 40, 30, 30);
    }

    //Create Array Box
    for(let i = 0 ; i < boxesArray.length ; i++) {
        let box = boxesArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img , box.x , box.y , box.width , box.height);

        //ตรสวจสอบเงื่อนไขการชนของอุปสรรค์
        if(onCollision(player,box)) {
            lives--;
            boxesArray.splice(i, 1); 
            i--;

            if(lives <= 0) {
                gameOver = true;
                gameOverReason = "I'm watching you from the window!"
                let btn = document.getElementById("restartBtn");
                btn.disabled = true;
                btn.style.backgroundColor = "gray";
                btn.style.cursor = "not-allowed"
            }
        }
    }

    //นับคะแนน
    score++;
    context.font = "normal bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Score :" + score , 10 , 30);

    //นับเวลา
    time += 0.01;
    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time :" + (time.toFixed(2)) , 765 , 30);

}

// Funtion เคลื่อนตัวละคร
function movePlayer(e) {
    if(gameOver) {
        return;
    }

    if(e.code == "Space" && player.y == playerY) {
        velocityY = -10;
    }
}

function createRandomBox() {
    if(gameOver) {
        return;
    }

    let selectedImg = (Math.random() < 0.5) ? boxImg : FloatImg;

    let currentWidth = (selectedImg === FloatImg) ? FloatWidth : boxWidth;
    let currentHeight = (selectedImg === FloatImg) ? FloatHeight : boxHeight;
    let currentX = (selectedImg === FloatImg) ? FloatX : boxX;
    let currentY = (selectedImg === FloatImg) ? FloatY : boxY;

    let box = {
        img:selectedImg,
        x:currentX,
        y:currentY,
        width:currentWidth,
        height:currentHeight
    }

    boxesArray.push(box);

    if(boxesArray.length > 5) {
        boxesArray.shift;
    }

    let randomTime = Math.floor(Math.random() * 1000) + 2000;
    setTimeout(createRandomBox, randomTime);
}

function onCollision(obj1 , obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
            (obj1.x + obj1.width) > obj2.x //ชนกันแนวนอน
            &&
            obj1.y < (obj2.y + obj2.height) &&
            (obj1.y + obj1.height) > obj2.y //ชนกันแนวต้ัง
}

function restartGame() {
    location.reload();
}



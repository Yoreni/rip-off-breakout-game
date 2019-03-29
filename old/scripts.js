/*
	TODO
	1.more levels
	2.remake in a web games libary to gain more controll
	3.powerups
	4.fix bugs (DONE)
	5.make a leader board
	6.screens like a play screen or a game over screen
	7.use mutiple classes
	8.better paddel phicsyis (DONE)
*/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var levels =
[
[[]],	
[["1111111111111111"],["1111111111111111"],["1111111111111111"],["1111111111111111"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],
[["1111111111111111"],["1111111111111111"],["2222222222222222"],["1111111111111111"],["1111111111111111"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],  
[["2121212121212121"],["2121212121212121"],["2121212121212121"],["2121212121212121"],["2121212121212121"],["2121212121212121"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]]

]

var rightPressed = false;
var leftPressed = false;
var debug = false;
var playing = true;


var score = 0;
var lives = 5;
var level = 1;
var streak = 0;

var ball = {
    "x": canvas.width / 2,
    "y": canvas.height - 30,
    "radius": 10,
    "Xvel": 2,
    "Yvel": -2
}

var paddle = {
	"height": 10,
	"width": 90,
	"x": (canvas.width - 90) / 2
}

var bricks = [];
var brickRowCount = 10;
var brickColumnCount = 16;
var brickWidth = 77;
var brickHeight = 20;
var brickPadding = 8;
var brickOffsetTop = 35;
var brickOffsetLeft = 0;
var brickColour = ["","#00ffed","#00ff26","#e1ff00","#ff8c00","#ff0000"]

function createLevel(level)
{
	var creating = levels[level]
	bricks = [];
	for(var c=0; c<brickColumnCount; c++) 
	{
		bricks[c] = [];
		for(var r=0; r<brickRowCount; r++) 
		{
			//alert("Row:" + r + " Colloum:" + c + "  ID:" + (r * brickRowCount) + c)
			bricks[c][r] = { x: 0, y: 0 , hp: Number(String(creating[r])[c])};
		}
	}
}

 createLevel(1);

function draw() 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(playing)
	{
		//Draws a ball
		ctx.beginPath();
		ctx.arc(ball.x, ball.y,ball.radius,0,Math.PI*2);
		ctx.fillStyle = "#4AEE00";
		ctx.fill();
		ctx.closePath();
		//Colsion Dection
		if(ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.Yvel > canvas.height - ball.radius - 10) 
		{
			//this is the paddel colision detection
			ball.Xvel = (((ball.x - paddle.x) / (paddle.width)) - 0.5) * 13;
			ball.Yvel = -ball.Yvel;
			ball.Yvel -= 0.1;
			streak = 0;
		}
		if(ball.y + ball.Yvel < ball.radius) 
		{
			ball.Yvel = -ball.Yvel;
		}
		else if(ball.y + ball.Yvel > canvas.height - ball.radius + 25)
		{
			streak = 0;
			ball.Yvel = 2;
			lives--;
			if(lives == 0)
			{
				alert("GAME OVER");
				//document.location.reload();
				playing = false;
				var name = prompt("Enter your name to go on the leaderboard or enter nothing if you dont want to");
				if(name.replace(" ","") != "")
				{
					writeTextFile("scores.txt",name + ":" + score)
				}
			}
			else
			{
				ball.Yvel = -ball.Yvel;
			}
		}
		if(ball.x + ball.Xvel < ball.radius || ball.x + ball.Xvel > canvas.width - ball.radius) 
		{
			ball.Xvel = -ball.Xvel;
		}
		//Moves ball
		ball.x += ball.Xvel;
		ball.y += ball.Yvel;
		//Draws paddel
		ctx.beginPath();
		ctx.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width,paddle.height);
		ctx.fillStyle = "#4AEE00";
		ctx.fill();
		ctx.closePath();
		//moves paddel
		if(rightPressed && paddle.x < canvas.width - paddle.width) 
		{
			paddle.x += 8;
		}	
		else if(leftPressed && paddle.x > 0) 
		{
			paddle.x -= 8;
		}
		//draws bricks
		for(var c=0; c<brickColumnCount; c++) 
		{
			for(var r=0; r<brickRowCount; r++) 
			{
				bricks[c][r].x = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
				bricks[c][r].y = (r * (brickHeight+brickPadding)) + brickOffsetTop;
				if(bricks[c][r].hp > 0)
				{
					ctx.beginPath();
					ctx.rect(bricks[c][r].x,bricks[c][r].y,brickWidth,brickHeight);
					ctx.fillStyle = brickColour[bricks[c][r].hp];
					ctx.fill();
					ctx.closePath();
				}
			}
		}
		//bricks collsion detection
		for(var c=0; c < brickColumnCount; c++) 
		{
			for(var r=0; r < brickRowCount; r++) 
			{
				var brick = bricks[c][r];
				if(ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) 
				{
					if(brick.hp > 0)
					{
						streak++;
						score += (brick.hp * 10) * (Math.abs(ball.Yvel) - 1) * ((streak / 5) + 0.8)
						brick.hp -= 1;
						ball.Yvel = -ball.Yvel;
						//ball.Xvel = -(1 / ball.Xvel);
						ball.y += ball.Yvel;
						if(brick.hp == 0)
						{
							if(hasWon(bricks))
							{
								level++;
								lives++;
								createLevel(level);
								if(levels.length == level)
								{
									alert("YOU WIN, CONGRATULATIONS!");
									//document.location.reload();
									playing = false;
								}
							}
						}						
					}
				}
			}
		}
		//draws the score and lives
		ctx.font = "16px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillText("Level: "+ level, 8 ,580);
		ctx.fillText("Score: "+ (Math.floor(score)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 8 ,600);
		ctx.fillText("Lives: "+ "❤️".repeat(lives), 8, 620);
		if(debug)
		{
			ctx.fillText("Debug:" + ball.Xvel, 8, 20);
		}
	}
	else
	{
		ctx.beginPath();
		ctx.rect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
		ctx.font = "48px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillText("GAME OVER!",550,100);
		ctx.font = "24px Arial";
		ctx.fillText("Your score:" + (Math.floor(score)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),600,125);
	}
}

document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function hasWon(bricks)
{
	var won = true;
    for(var c=0; c<brickColumnCount; c++) 
	{
        for(var r=0; r<brickRowCount; r++) 
		{
			if(bricks[c][r].hp != 0) won = false;
		}
	}
	return won;
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

var interval = setInterval(draw,10);
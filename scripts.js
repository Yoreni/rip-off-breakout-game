/*
	TODO
	1.more levels
	2.remake in a web games libary to gain more controll (DONE)
	3.powerups (DONE)
	4.fix bugs (DONE)
	5.make a leader board
	6.screens like a play screen or a game over screen
	7.use mutiple classes (DONE)
	8.better paddel phicsyis (DONE)
*/

var game = new Phaser.Game(1350,640, Phaser.CANVAS, null, 
{
    "preload": preload, 
	"create": create, 
	"update": update
});

var score = 0;
var lives = 5;
var level = 1;
var streak = 0;
var muti = 1;

var ball;
var paddle;

var bricks;
var newBrick;
var brickInfo;

var scoreText;
var livesText;
var levelText;

var powerups;
var powerup;

//defines the levels
var levels =
[
[["PPPPPPPPPPPPPPPP"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],	
[["1111111111111111"],["1111111111111111"],["1111111111111111"],["1111111111111111"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],
[["1111111111111111"],["1111111111111111"],["2222P2222222P222"],["1111111111111111"],["1111111111111111"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],  
[["21P1212121212P21"],["2121212121212121"],["2121212121212121"],["2121212121212121"],["2121212121212121"],["2121212121212121"],["0000000000000000"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],
[["1111111111111111"],["1122222222222211"],["1223333333333221"],["2223333PPP333222"],["1223333333333221"],["1122222222222211"],["1111111111111111"],["0000000000000000"],["0000000000000000"],["0000000000000000"]],
[["22222222222P2222"],["2000000000000002"],["2022222P22222202"],["2020000000000202"],["202022P222220202"],["2020200000000202"],["2020222222222202"],["2020000000000002"],["2022222222222222"],["0000000000000000"]]
]

function createLevel(level)
{
	var creating = levels[level]
	brickInfo = 
	{
        width: 77,
        height: 20,
        count: 
		{
            row: 10,
            col: 16
        },
        offset: 
		{
            top: 35,
            left: 0
        },
        padding: 8
    };
	bricks = game.add.group();
	for(c=0; c<brickInfo.count.col; c++) 
	{
		for(r=0; r<brickInfo.count.row; r++) 
		{
			var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
			var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
			newBrick = game.add.sprite(brickX, brickY, 'brick' + String(creating[r])[c]);
			if(newBrick.alive == false)
			{
				newBrick.reset(brickX,brickY);
			}
			game.physics.enable(newBrick, Phaser.Physics.ARCADE);
			newBrick.body.immovable = true;
			newBrick.anchor.set(0);
			bricks.add(newBrick);
			if(String(creating[r])[c] == "0")
			{
				newBrick.kill();
			}
		}
    }
}

function preload() 
{
	//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertically = true;
	game.stage.backgroundColor = '#FFFFFF';
	
	game.load.image('ball', 'img/ball.png');
	game.load.image('paddle', 'img/paddles/med.png');
	game.load.image('paddleBig', 'img/paddles/big.png');
	//i could use a loop here but nah
	game.load.image('brick1', 'img/bricks/1.png');
	game.load.image('brick2', 'img/bricks/2.png');
	game.load.image('brick3', 'img/bricks/3.png');
	game.load.image('brick4', 'img/bricks/4.png');
	game.load.image('brick5', 'img/bricks/5.png');
	game.load.image('brickP', 'img/bricks/P.png');

	game.load.image('power1', 'img/powerups/1.png');
	game.load.image('power2', 'img/powerups/2.png');
	game.load.image('power3', 'img/powerups/3.png');
	game.load.image('power4', 'img/powerups/4.png');
	game.load.image('power5', 'img/powerups/5.png');
}
function create() 
{
	//sets up the phisics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.down = false;
	
	ball = game.add.sprite(game.world.width * 0.5,game.world.height - 25, 'ball');
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.velocity.set(150, -150);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);

	ball.anchor.set(0.5);
	ball.events.onOutOfBounds.add(function()
	{
		streak = 0;
		lives--;
		livesText.setText('Lives: '+ "❤️".repeat(lives));
		ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
		ball.body.velocity.set(150, -150);
		if(lives == 0)
		{
			alert('Game over!');
			location.reload();
		}
	}, this);
	paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
	paddle.anchor.set(0.5,1);
	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.immovable = true;
	
	scoreText = game.add.text(4, 600, 'Score: ' + (Math.floor(score)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), { font: '16px Arial', fill: '#000000' });
	livesText = game.add.text(4, 620, 'Lives: '+ "❤️".repeat(lives), { font: '16px Arial', fill: '#000000' });
	levelText = game.add.text(4, 580, 'Level: '+ level, { font: '16px Arial', fill: '#000000' });

	powerups = game.add.group();

	//creates the bricks
	createLevel(level);
}

function update() 
{
	game.physics.arcade.collide(ball, paddle,ballHitsPaddle);
	paddle.x = game.input.x || game.world.width*0.5;
	ball.checkWorldBounds = true;
	
	game.physics.arcade.collide(ball, bricks, ballHitBrick);

	game.physics.arcade.collide(paddle,powerups,paddleHitsPowerup);
	
}

function ballHitsPaddle(ball,paddle)
{
	 ball.body.velocity.x = -1*5*(paddle.x-ball.x);
	 streak = 0;
}

function ballHitBrick(ball, brick) 
{
	streak++;
	score += 10 * (((Math.abs(ball.body.velocity.y) - 150) / 70) + 1) * ((streak / 5) + 0.8) * muti;
	scoreText.setText('Score:' + (Math.floor(score)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	var key = brick.key.replace("brick","")
	if(isNaN(key) || key == "1")
	{
		brick.kill();
		if(key == "P")
		{
			powerup = game.add.sprite(brick.x, brick.y + 50,"power" + Math.ceil(Math.random() * 5));
			game.physics.enable(powerup, Phaser.Physics.ARCADE);
			//powerup.body.immovable = true;
			powerup.anchor.set(0.5,0.5);
			powerup.body.velocity.set(0,125);
			powerup.body.collideWorldBounds = true;
			powerup.events.onOutOfBounds.add(function()
			{
				powerups.remove(powerup); //there might be a bug here
			}, this);
			powerups.add(powerup);
		}
	}
	else
	{
		//brick.addImage(brick.x,brick.y,"brick" + String(Number(key) - 1))
		//brick.key = "brick" + String(Number(key) - 1)
		brick.loadTexture("brick" + String(Number(key) - 1));
	}
	ball.body.velocity.y += 7;

	if(brick.key)

	var alive = 0;
    for(i = 0; i < bricks.children.length; i++) 
	{
		if (bricks.children[i].alive == true) 
		{
			alive++;
		}
    }
    if (alive == 0) 
	{
		level++;
		lives++;
		livesText.setText('Lives: '+ "❤️".repeat(lives));
		levelText.setText('Level: '+ level);
		ball.x = game.world.width * 0.5;
		ball.y = game.world.height - 25;
		ball.body.velocity.y = -150
		if(level == levels.length)
		{
      		alert('You won the game, congratulations!');
	  		location.reload();
		}
		else
		{
			createLevel(level);
		}
    }
}

function paddleHitsPowerup(paddel,powerup)
{
	var key = powerup.key.replace("power","");
	if(key == "1")
	{
		createPaddle(3);
		setTimeout(createPaddle,30000,2);
	}
	else if(key == "2")
	{
		if(ball.body.velocity.y > 0)
		{
			ball.body.velocity.y += 50
		}
		else
		{
			ball.body.velocity.y -= 50
		}
	}
	else if(key == "3")
	{
		if(ball.body.velocity.y > 0)
		{
			ball.body.velocity.y -= 50
		}
		else
		{
			ball.body.velocity.y += 50
		}
	}
	else if(key == "4")
	{
		muti ++;
		setTimeout(changeMuti,30000,1)
	}
	else if(key == "5")
	{
		lives++;
		livesText.setText('Lives: '+ "❤️".repeat(lives));
	}
	powerups.remove(powerup);
}

function createPaddle(size)
{
	paddle.destroy();
	if(size == 2)
	{
		paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
	}
	else if(size == 3)
	{
		paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddleBig');
	}
	paddle.anchor.set(0.5,1);
	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.immovable = true;
}

function changeMuti(amount)
{
	muti -= amount;
}

function updateLeaderboard(name,score)
{
	leaderboard.push(name + ":" + score);

} 

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};

var width = 400,
    height = 400;

var canvas, score,$gameOverText, $scoreText, context, player, computer,user, ball, keysDown = {}, animating = false;

function StartPong(newUser) {
    $("#special-content").remove();
    $("body").append("<div id=\"special-content\"><\div>");
    score = 0;
    user = newUser;
    $scoreText = $("<div>", {id: "scoreText"});
        $scoreText.text("Score:"+score+" Personal Highscore:"+user.highscore);
    //$scoreText.css({});
    $gameOverText = $("<div>", {id: "gameOverText"});
    $gameOverText.css({"position": "absolute",
                       "z-index": "1",
                       "width": "150px",
                       "height": "100px",
                       "top": "50%",
                       "left": "50%",
                       "margin": "-50px 0 0 -75px"});
    var $p = $("<p>");
    $p.text("GAME OVER!!!");
    $p.css({"text-align": "center", "vertical-align": "middle"});
    $gameOverText.append($p);
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    player = new Player();
    computer = new Computer();
    ball = new Ball(width / 2, height / 2);
    keysDown = {};
    $("#special-content").show();
    $("#special-content").append($scoreText);
    document.getElementById("special-content").appendChild(canvas);
    $("#special-content").append($gameOverText);
    $gameOverText.hide();
    if(!animating){
        animate(step);
    }
    animating = true;
}

var render = function () {
    context.fillStyle = "#CCCCCC";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

var update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > width) {
        this.x = width - this.width;
        this.x_speed = 0;
    }
};

function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.update = function (ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < -4) {
        diff = -5;
    } else if (diff > 4) {
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > width) {
        this.paddle.x = width - this.paddle.width;
    }
};

function Player() {
    this.paddle = new Paddle(175, height-20, 50, 10);
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 37) {
            this.paddle.move(-4, 0);
        } else if (value == 39) {
            this.paddle.move(4, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x > width-5) {
        this.x = width-5;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0) {
        score++;
        if(score>user.highscore){
            user.highscore = score;
        }
        $scoreText.text("Score:"+score+" Personal Highscore:"+user.highscore);
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = width/2;
        this.y = height/2;
    } else if (this.y > height){
        $gameOverText.show();
        $.post("updateUser",user);
        this.x_speed = 0;
        this.y_speed = 0;
        this.x = width / 2;
        this.y = height / 2;
    }

    if (top_y > height / 2) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

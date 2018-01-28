var UfoMaxPosX = 5;
var speed = 0.7;
var spaceShips = [];
var score = 0;
var helth = 100;
var MovePlayer;
var i = 0;
var ibg = 0;
var mP = 0;
var bombArr = [];
var draw =0;


$(document).ready(function () {
    $(document).on('click','.start',function () {
        console.log('sdfsdf');
        $('.startPage').hide();

        superstart()
    })
})

const pjs = new PointJS('2D', 720 / 2, 1280 / 2, { // 16:9
    backgroundColor: 'transparent' // if need
});



function superstart() {

pjs.system.initFullPage();
pjs.system.initFPSCheck();
var game = pjs.game;
touch = pjs.touchControl.initTouchControl();

var size = game.getWH().w / 6;

var posY = game.getWH().h - size;
var posX = game.getWH().w - size;

var menu = game.newRectObject({
    x: 0,
    y:0,
    w: game.getWH().w,
    h: 30,
    fillColor : "black"
});

var lineHelth = game.newRectObject({
    x: 10,
    y:5,
    w: game.getWH().w/3,
    h: 20,
    fillColor : "green"
});

var buttonBurn =game.newImageObject({
    file: 'image/burn.png',
    w: size - 1,
    h: size - 1,
    y: posY - 20,
    x: posX -10,
    alpha: 0.5
});
/*PLAYER*/
var playerShip = game.newImageObject({
    file: 'image/playership.png',
    w: size - 1,
    h: size - 1,
    y: posY - 10,
    x: 0
});

/*other*/
function CreateSpaceShip() {
    this.ship = game.newImageObject({
        file: 'image/spaceship.png',
        w: size - 1,
        h: size - 1,
        y: -size,
        x: (Math.floor(Math.random() * (UfoMaxPosX - 0 + 1)) + 0) * size
    });
}
spaceShips.push(new CreateSpaceShip());

function CreateBomb() {
    this.bomb = game.newImageObject({
        file: 'image/bomb.png',
        w: 16,
        h: 16,
        y: posY - size,
    });
}

var bangImg = pjs.tiles.newAnimation('image/explodem.png', 60, 60, 10);

var bangAnim = game.newAnimationObject({
    animation: bangImg,
    w: size - 1, h: size - 1,
    x: -size, y: -size
});

var bangMilk = bangAnim;

/*player move*/

pjs.game.newLoop("myGame", function () {
    // Очистка прошлого кадра отрисовки
    pjs.game.clear();

    $('.bg__wrapper').css(
        'background-position-y',ibg-- +'px'
    )

    if (i < 120 / speed) {
        i++;
    } else {
        spaceShips.push(new CreateSpaceShip());
        i = 0;
    }

    playerShip.draw();

    for (var s = 0; s < spaceShips.length; s++) {
        Newship = spaceShips[s].ship;
        Newship.draw();
        Newship.y += speed;

        if (playerShip.isIntersect(Newship)) {
            draw=1;
            game.stop();
        }

        if (Newship.y > game.getWH().h) {
            helth -= 4;

            if(helth<=0){
                draw=1;
                game.stop();
            }

            lineHelth.w =  (game.getWH().w/3)*(helth/100);

            if(helth<=75){
                lineHelth.fillColor='yellow'
            }

            if(helth<=50){
                lineHelth.fillColor='orange'
            }


            if(helth<=25){
                lineHelth.fillColor='red'
            }

            spaceShips.splice(s, 1);
        }
    }

    var attak = pjs.touchControl.isPeekStatic( buttonBurn.getStaticBox() );


    var up=pjs.touchControl.isUp();

    if(up==true){
        buttonBurn.alpha=0.5;
    }

    MovePlayer = pjs.touchControl.getVector().x;

    if (attak == true) {
        buttonBurn.alpha=0.8;
        var temp = new CreateBomb();
        temp.bomb.x = playerShip.x + size / 2 - 8;
        bombArr.push(temp);
    }

    for (var a = 0; a < bombArr.length; a++) {
        NewBomb = bombArr[a].bomb;
        NewBomb.draw();
        NewBomb.y -= 2;

        for (var s = 0; s < spaceShips.length; s++) {
            Newship = spaceShips[s].ship;

            if (NewBomb.isIntersect(Newship)) {

                bangAnim.x = Newship.x;
                bangAnim.y = Newship.y;
                bangAnim.frame = 0;
                score += 100;
                if (score % 100 == 0) {
                    speed += 0.02;
                }
                spaceShips.splice(s, 1);
                bombArr.splice(a, 1);
            }
        }
        if (NewBomb.y < 100) {
            bangMilk.x = NewBomb.x;
            bangMilk.y = NewBomb.y;
            bangMilk.frame = 0;

            bombArr.splice(a, 1);
        }
    }

    if (bangAnim.frame < 9) {
        bangAnim.draw();
    }
    if (bangMilk.frame < 9) {
        bangMilk.draw();
    }


    if (MovePlayer != 0) {
        mP++;

        if (mP < 2) {
            playerShip.x += MovePlayer * size;
        }

        if (mP > 20) {
            mP = 0;
        }
    } else {
        mP = 0;
    }

    if (playerShip.x <= 0) {
        playerShip.x = 0;
    }

    if (playerShip.x >= posX) {
        playerShip.x = posX;
    }

    menu.draw();
    lineHelth.draw();
    buttonBurn.draw();

    pjs.brush.drawText({
        text: 'score : ' + score,
        color: "white",
        size: 20,
        x:  game.getWH().w/2, y: 5
    });

    if(draw==1){
        $('.gameover').show();
        $('.score').empty();
        $('.score').html(score*helth);
    }

});



pjs.game.startLoop("myGame");
}
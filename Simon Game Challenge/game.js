let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;

$(document).on("keydown", function(){
    if(!started){
        nextSequence();
        started = true;
    }
});



$(".btn").on("click", function() {
    let userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);

    console.log("User Pattern: " + userClickedPattern);

    checkAnswer(userClickedPattern.length - 1);

    playSound(userChosenColor);
    animatePress(userChosenColor);
})

function checkAnswer(currentLevel){

    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        if(gamePattern.length === userClickedPattern.length){
            setTimeout(nextSequence, 1000);
        }
    } else {
        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200)

        $("#level-title").text("Game Over, Press Any Key to Restart");

        startOver();
    }

}

function startOver(){
    level = 0;
    started = false;
    gamePattern = [];
}

function nextSequence() {
    userClickedPattern = [];

    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColor = buttonColors[randomNumber];

    gamePattern.push(randomChosenColor);
    
    console.log("Game Pattern: " + gamePattern);

    playSound(randomChosenColor);
    animatePress(randomChosenColor);
    level++;

    $("#level-title").text("Level " + level);
}



function playSound(name){
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor){
    $("#" + currentColor).addClass("pressed");
    setTimeout(function(){
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}
function generateWinningNumber() {
    let output = Math.floor(Math.random() * 100) + 1;
    return output;
}

// https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    let m = array.length, t, i;

    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber.call();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(guess) {
    if (guess < 1 || guess > 100 || typeof guess !== 'number') {
        throw 'That is an invalid guess.';
    }
    
    this.playersGuess = guess;
    return this.checkGuess();
};

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        $('#subtitle').text("Hit the reset button to play again.");
        $('#submit, #hint').prop('disabled', true);
        return 'You Win!';
    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guesses .guess:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        }
    }

    if (this.pastGuesses.length >= 5) {
        $('#subtitle').text("Hit the reset button to play again.");
        $('#submit, #hint').prop('disabled', true);
        return 'You Lose.';
    } else {
        if(this.isLower()) {
            $('#subtitle').text('Guess higher!');
        } else {
            $('#subtitle').text('Guess lower!');
        }
        if (this.difference() < 10) return "You're burning up!";
        else if (this.difference() < 25) return "You're lukewarm.";
        else if (this.difference() < 50) return "You're a bit chilly.";
        else return "You're ice cold!";
    }
};

Game.prototype.provideHint = function() {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function newGame() {
    return new Game();
}

$(document).ready(function() {
    let game = newGame();
    const newGuess = function(game) {
        game.playersGuess = $('#players-input').val();
        $('#players-input').val('');
        $('#title').text(game.playersGuessSubmission(+game.playersGuess));
        console.log(game.playersGuessSubmission(+game.playersGuess));
    };

    $('#submit').click(function(event) {
        newGuess(game);
    });

    $('#players-input').keypress(function(event) {
        if(event.which == 13) {
            newGuess(game);
        }
    });

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100');
        $('#guesses .guess').text('-');
        $('#submit, #hint').prop('disabled', false);
    });

    $('#hint').click(function() {
        let hints = game.provideHint();
        $('#subtitle').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });
});
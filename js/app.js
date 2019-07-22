// Get all cards on the page
let cardList = [...document.getElementsByClassName("card")];

// Get all elements
let deck = document.querySelector(".deck");
let restart = document.querySelector(".restart");
let moves = document.querySelector(".moves");
let stars = document.querySelectorAll(".fa-star");
let timer = document.querySelector(".timer");
let button = document.querySelector(".play-again");

let counting = 0;

// Opened cards
let openedCards = [];

// Matched cards
let matchingCards = [];

// Fisher-Yates Shuffle 
// http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function startGame() {
  let shuffled = shuffle(cardList);

  let appending = function(item) {
    deck.appendChild(item);
  };

  for (card of shuffled) {
    deck.innerHTML = "";
    [].forEach.call(shuffled, appending);
    card.classList.remove("open", "show", "match", "no_match");
  }

  matchingCards.splice(0, 16);
  moves.innerHTML = 0;
}

let openedCard = function() {
  this.classList.add("open", "show");
  openedCards.push(this);
  
  if (openedCards.length === 2) {
    countMoves();
    stopClick();

    setTimeout(function() {
      startClick();
    }, 900);

    if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
      matchedCards();
    } else if (openedCards[0].innerHTML != openedCards[1].innerHTML) {
      noMatch();
    }
  }
};

function matchedCards() {
  openedCards[0].classList.remove("open", "show");
  openedCards[0].classList.add("match");

  openedCards[1].classList.remove("open", "show");
  openedCards[1].classList.add("match");
  
  matchingCards.push(openedCards[0]);
  matchingCards.push(openedCards[1]);

  openedCards.splice(0, 2);
}

function noMatch() {
  openedCards[0].classList.replace("show", "no_match");
  openedCards[1].classList.replace("show", "no_match");

  setTimeout(function() {
    openedCards[0].classList.remove("open", "no_match");
    openedCards[1].classList.remove("open", "no_match");
  }, 1000);
  
  setTimeout(function() {
    openedCards.splice(0, 2);
  }, 1100);
}

function stopClick() {
  for (card of cardList) {
    card.classList.add("stop-event");
  }
}

// Enable click event
function startClick() {
  for (card of cardList) {
    card.classList.remove("stop-event");
  }
}

function countMoves() {
  counting++;
  moves.innerHTML = counting;

  // Ranking
  if (counting > 15 && counting < 20) {
    for (let i = 0; i < 3; i++) {
      if (i > 1) {
        stars[i].style.visibility = "collapse";
      }
    }
  } else if (counting > 20) {
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.visibility = "collapse";
      }
    }
  }
}


// Timer
let min = 0;
let sec = 0;

function timerClock() {
  if (counting) {
    timer.innerHTML = `${min} minutes ${sec} seconds`
    sec++;
    
    if (sec >= 60) {
      sec = 0;
      min++;
    }
  }
}

// Starts the timer
let startTimer = setInterval(function() {
  timerClock();
}, 1000);

let modalAppear = function() {
  if (matchingCards.length == 16) {
    clearInterval(startTimer);

    let timing = timer.innerHTML;
    let starNumber = document.querySelector(".stars").innerHTML;

    document.getElementById("modal-popup").style.display = "block";
    document.querySelector(".total-moves").innerHTML = counting;
    document.querySelector(".total-time").innerHTML = timing;
    document.querySelector(".total-stars").innerHTML = starNumber;

    closeModal();
  }
};

function closeModal() {
  button.addEventListener("click", function() {
    document.getElementById("modal-popup").style.display = "none";
    startGame();

    for (star of stars) {
      star.style.visibility = "visible";
    }

    min = 0;
    sec = 0;

    setInterval(function() {
      timerClock();
    }, 1000);
  });
}

// Flips card on click
for (card of cardList) {
  card.addEventListener("click", openedCard);
  card.addEventListener("click", modalAppear);
}

// Restarts game when the restart icon is clicked
restart.addEventListener("click", function() {
  startGame();

  for (star of stars) {
    star.style.visibility = "visible";
  }

  min = 0;
  sec = 0;
});

document.onload = startGame();

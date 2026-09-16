"use strict";

/* =====================================================
   THE OBSERVATORY BINGO
   COMPLETE GAME LOGIC
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const bingoCard =
  document.getElementById("bingoCard");

const statusMessage =
  document.getElementById("statusMessage");

const cardNumberDisplay =
  document.getElementById("cardNumber");

const newCardButton =
  document.getElementById("newCardButton");

const clearButton =
  document.getElementById("clearButton");

const playerForm =
  document.getElementById("usernameForm");

const twitchUsernameInput =
  document.getElementById("usernameInput");

const usernameMessage =
  document.getElementById("usernameError");

const playerSetup =
  document.getElementById("usernameSection");

const activeUsernameBox =
  document.getElementById("activeUsernameBox");

const playerInfo =
  document.getElementById("playerInfo");

const claimStatus =
  document.getElementById("claimStatus");

const claimResult =
  document.getElementById("claimResult");

const claimChatCommand =
  document.getElementById("claimChatCommand");

const claimFinalMessage =
  document.getElementById("claimFinalMessage");


/* =====================================================
   GAME STATE
===================================================== */

let playerUsername = "";

let playerHasEnteredName = false;

let playerHasBingo = false;

let cardNumber = 1;

let currentCard = [];


/* =====================================================
   BINGO ITEMS
===================================================== */

const bingoItems = [

  ["🥒", "Pickle is mentioned"],
  ["🏁", "A marbles race starts"],
  ["🐿️", "A squirrel appears"],
  ["🎮", "Someone uses !jumanji"],
  ["🧸", "The claw grabs a prize"],
  ["📚", "Homework is mentioned"],
  ["🧪", "Pixie is mentioned"],
  ["🛰️", "The Observatory is mentioned"],
  ["🔊", "A sound alert plays"],
  ["👽", "An alien appears"],
  ["🚛", "American Truck Simulator is mentioned"],
  ["💥", "Someone uses !bonk"],
  ["🐻", "Yogi Bear is mentioned"],
  ["🌌", "Someone says Cosmic Goblins"],
  ["🦆", "The purple duck appears"],
  ["🏆", "A marbles winner is announced"],
  ["💬", "Someone says chat"],
  ["🔧", "A technical issue happens"],
  ["😴", "Someone uses !tigger"],
  ["🎥", "A community video is suggested"],
  ["😂", "Stargazer laughs"],
  ["📖", "Tiny Book Shop is mentioned"],
  ["🥒", "A pickle joke happens"],
  ["⭐", "Someone gets a shoutout"],
  ["🧸", "A plushie gets stuck"],
  ["🎵", "The winners anthem plays"],
  ["👻", "Someone uses !ghost"],
  ["🐯", "Someone mentions Tigger"],
  ["🚀", "Someone says one more"],
  ["🛠️", "Something needs fixing"],
  ["🌟", "A rare prize is found"],
  ["📡", "A strange transmission happens"],
  ["🪐", "A space joke happens"],
  ["🎲", "Someone rolls the dice"],
  ["💜", "A community member gets a shoutout"],
  ["📢", "A stream alert interrupts"],
  ["🤔", "Someone asks what happened"],
  ["🌵", "A Texas reference happens"],
  ["🎮", "A game bug happens"],
  ["🛰️", "The Observatory needs fixing"],
  ["👾", "A Cosmic Goblin is blamed"],
  ["🎉", "Chat celebrates"],
  ["💫", "Something unexpected happens"],
  ["🗣️", "Someone says hold on"],
  ["🎁", "A surprise reward happens"],
  ["🌙", "Someone talks about being tired"],
  ["📅", "The stream schedule is mentioned"],
  ["🎬", "A classic clip is mentioned"],
  ["🧑‍🚀", "Someone joins the crew"],
  ["💎", "A legendary moment happens"]

];


/* =====================================================
   SHUFFLE
===================================================== */

function shuffle(array) {

  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const randomIndex =
      Math.floor(Math.random() * (i + 1));

    [
      copy[i],
      copy[randomIndex]
    ] = [
      copy[randomIndex],
      copy[i]
    ];

  }

  return copy;

}


/* =====================================================
   USERNAME REQUIREMENT
===================================================== */

function requireUsername() {

  if (usernameMessage) {

    usernameMessage.textContent =
      "Enter your Twitch username first.";

  }

  twitchUsernameInput?.focus();

}


/* =====================================================
   ENABLE / DISABLE CONTROLS
===================================================== */

function setCardControlsEnabled(enabled) {

  if (newCardButton) {
    newCardButton.disabled = !enabled;
  }

  if (clearButton) {
    clearButton.disabled = !enabled;
  }

}


/* =====================================================
   RESET CLAIM INFORMATION
===================================================== */

function resetClaimInformation() {

  playerHasBingo = false;

  if (claimStatus) {

    claimStatus.textContent =
      "Complete a Bingo to unlock your claim.";

  }

  claimResult?.classList.add("hidden");

  if (claimFinalMessage) {
    claimFinalMessage.textContent = "";
  }

  if (claimChatCommand) {
    claimChatCommand.textContent = "!bingo";
  }

}


/* =====================================================
   UNLOCK CLAIM
   MESSAGE APPEARS IN YELLOW BOX
===================================================== */

function unlockClaim() {

  playerHasBingo = true;

  if (claimStatus) {

    claimStatus.textContent =
      "🎉 BINGO! Type !bingo in Twitch chat to claim your win!";

  }

  claimResult?.classList.remove("hidden");

  if (claimFinalMessage) {

    claimFinalMessage.textContent =
      `${playerUsername}, your Bingo is ready!`;

  }

  if (claimChatCommand) {
    claimChatCommand.textContent = "!bingo";
  }

}


/* =====================================================
   CREATE NEW CARD
===================================================== */

function createNewCard() {

  if (!playerHasEnteredName) {

    requireUsername();

    return;

  }

  currentCard =
    shuffle(bingoItems)
      .slice(0, 24)
      .map(item => {

        return {

          icon: item[0],

          text: item[1],

          freeSpace: false

        };

      });


  /*
    Center square is FREE SPACE.
    Index 12 is the center of a 5 x 5 card.
  */

  currentCard.splice(12, 0, {

    icon: "",

    text: "",

    freeSpace: true

  });


  resetClaimInformation();

  renderCard();


  if (cardNumberDisplay) {

    cardNumberDisplay.textContent =
      `CARD #${cardNumber}`;

  }


  /*
    The instructions above the card are hidden.
    The Bingo message belongs in the yellow box.
  */

  if (statusMessage) {

    statusMessage.textContent = "";

    statusMessage.classList.remove("bingo");

  }

}


/* =====================================================
   RENDER CARD
===================================================== */

function renderCard() {

  if (!bingoCard) return;

  bingoCard.innerHTML = "";


  currentCard.forEach(item => {

    const square =
      document.createElement("button");

    square.type = "button";

    square.className =
      "bingo-square";


    square.setAttribute(
      "aria-label",
      item.freeSpace
        ? "Free space"
        : item.text
    );


    square.dataset.marked =
      String(item.freeSpace);


    const icon =
      document.createElement("span");

    icon.className =
      "square-icon";

    icon.textContent =
      item.icon;


    const text =
      document.createElement("span");

    text.className =
      "square-text";

    text.textContent =
      item.text;


    /*
      FREE SPACE HAS NO WORDS OR ICON.
    */

    if (item.freeSpace) {

      square.classList.add(
        "free-space",
        "marked"
      );

    } else {

      square.append(
        icon,
        text
      );

    }


    /*
      CLICK TO MARK / UNMARK
    */

    square.addEventListener(
      "click",
      () => {

        if (!playerHasEnteredName) {

          requireUsername();

          return;

        }


        if (item.freeSpace) {
          return;
        }


        const marked =
          square.dataset.marked === "true";


        square.dataset.marked =
          String(!marked);


        square.classList.toggle(
          "marked",
          !marked
        );


        checkForBingo();

      }
    );


    bingoCard.appendChild(square);

  });

}


/* =====================================================
   GET MARKED SQUARES
===================================================== */

function getMarkedSquares() {

  if (!bingoCard) {
    return [];
  }

  return [
    ...bingoCard.querySelectorAll(
      ".bingo-square"
    )
  ].map(square => {

    return square.dataset.marked === "true";

  });

}


/* =====================================================
   CHECK FOR BINGO
===================================================== */

function checkForBingo() {

  if (!playerHasEnteredName) {
    return;
  }


  const marked =
    getMarkedSquares();


  const winningLines = [

    /* ROWS */

    [0, 1, 2, 3, 4],

    [5, 6, 7, 8, 9],

    [10, 11, 12, 13, 14],

    [15, 16, 17, 18, 19],

    [20, 21, 22, 23, 24],


    /* COLUMNS */

    [0, 5, 10, 15, 20],

    [1, 6, 11, 16, 21],

    [2, 7, 12, 17, 22],

    [3, 8, 13, 18, 23],

    [4, 9, 14, 19, 24],


    /* DIAGONALS */

    [0, 6, 12, 18, 24],

    [4, 8, 12, 16, 20]

  ];


  const hasBingo =
    winningLines.some(line => {

      return line.every(index => {
        return marked[index];
      });

    });


  if (hasBingo) {

    if (!playerHasBingo) {

      unlockClaim();

    }

    return;

  }


  /*
    No status text over the center card.
    All Bingo messaging goes to the yellow box.
  */

}


/* =====================================================
   CLEAR MARKS
===================================================== */

function clearMarks() {

  if (!playerHasEnteredName) {

    requireUsername();

    return;

  }


  bingoCard
    .querySelectorAll(".bingo-square")
    .forEach((square, index) => {

      const isFree =
        index === 12;


      square.dataset.marked =
        String(isFree);


      square.classList.toggle(
        "marked",
        isFree
      );

    });


  resetClaimInformation();

}


/* =====================================================
   START GAME / USERNAME
===================================================== */

playerForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const enteredName =
      twitchUsernameInput.value.trim();


    if (enteredName.length < 2) {

      if (usernameMessage) {

        usernameMessage.textContent =
          "Please enter a valid Twitch username.";

      }

      twitchUsernameInput.focus();

      return;

    }


    playerUsername =
      enteredName;


    playerHasEnteredName =
      true;


    /*
      Hide only the input form.
      Keep the username section in the top blue box.
    */

    playerForm.classList.add(
      "hidden"
    );


    /*
      Put the entered name in the top blue box.
    */

    if (activeUsernameBox) {

      activeUsernameBox.textContent =
        playerUsername;

      activeUsernameBox.classList.remove(
        "hidden"
      );

    }


    /*
      Card number appears in the pink box.
    */

    playerInfo.classList.remove(
      "hidden"
    );


    usernameMessage.textContent =
      "";


    setCardControlsEnabled(
      true
    );


    cardNumber =
      1;


    createNewCard();

  }
);


/* =====================================================
   NEW CARD BUTTON
===================================================== */

newCardButton?.addEventListener(
  "click",
  () => {

    if (!playerHasEnteredName) {

      requireUsername();

      return;

    }


    cardNumber++;

    createNewCard();

  }
);


/* =====================================================
   CLEAR BUTTON
===================================================== */

clearButton?.addEventListener(
  "click",
  clearMarks
);


/* =====================================================
   INITIAL SETUP
===================================================== */

setCardControlsEnabled(false);

resetClaimInformation();

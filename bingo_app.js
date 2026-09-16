
"use strict";

/* =========================================
   THE OBSERVATORY BINGO
   GAME LOGIC
========================================= */


/* =========================================
   ELEMENTS
========================================= */

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

const rulesButton =
  document.getElementById("rulesButton");

const closeRulesButton =
  document.getElementById("closeRulesButton");

const rulesPanel =
  document.getElementById("rulesPanel");

const playerForm =
  document.getElementById("usernameForm");

const twitchUsernameInput =
  document.getElementById("usernameInput");

const usernameMessage =
  document.getElementById("usernameError");

const playerSetup =
  document.getElementById("usernameSection");

const playerInfo =
  document.getElementById("playerInfo");

const activeUsername =
  document.getElementById("playerNameDisplay");

const claimStatus =
  document.getElementById("claimStatus");

const claimResult =
  document.getElementById("claimResult");

const claimChatCommand =
  document.getElementById("claimChatCommand");

const claimFinalMessage =
  document.getElementById("claimFinalMessage");


/* =========================================
   GAME STATE
========================================= */

let playerUsername = "";

let playerHasEnteredName = false;

let playerHasBingo = false;

let cardNumber = 1;

let currentCard = [];


/* =========================================
   BINGO ITEMS
========================================= */

const bingoItems = [

  ["🚔", "Suspect gets pulled over"],

  ["👮", "Officer says step out of the vehicle"],

  ["🗣️", "Suspect argues with the officer"],

  ["🤥", "Suspect gets caught lying"],

  ["😂", "Suspect says something incriminating"],

  ["🤡", "Suspect gives an unbelievable excuse"],

  ["💀", "Suspect makes the situation worse"],

  ["🧠", "Suspect tries to outsmart the officer"],

  ["🏃", "Suspect tries to run"],

  ["⛓️", "Suspect gets handcuffed"],

  ["🚓", "Multiple officers arrive"],

  ["🔍", "Officer searches a vehicle"],

  ["🪪", "Suspect has no license"],

  ["📋", "Officer asks for identification"],

  ["🚗", "Suspect crashes or damages a vehicle"],

  ["🗯️", "Suspect talks themselves into an arrest"],

  ["🤦", "Officer calls out a contradiction"],

  ["🤔", "Suspect asks an obvious question"],

  ["🎭", "Suspect changes their story"],

  ["📱", "Suspect records the officer"],

  ["🛑", "Suspect refuses to follow instructions"],

  ["🚨", "Police lights are visible"],

  ["🔊", "Officer tells someone to calm down"],

  ["📢", "Suspect raises their voice"],

  ["😡", "Suspect becomes angry"],

  ["😢", "Suspect becomes emotional"],

  ["🤐", "Suspect refuses to answer"],

  ["🚪", "Suspect is removed from a vehicle"],

  ["🔐", "Suspect is placed under arrest"],

  ["🧾", "Charges are explained"],

  ["⚖️", "Officer explains the law"],

  ["🧑‍⚖️", "Judge or courtroom is mentioned"],

  ["💰", "Bail is discussed"],

  ["🚑", "Medical attention is requested"],

  ["🏠", "Police enter or approach a home"],

  ["☎️", "Someone calls 911"],

  ["🎤", "Narrator explains what went wrong"],

  ["📺", "Video cuts to a different incident"],

  ["⏪", "A moment gets replayed"],

  ["😂", "Commentary makes the situation funnier"],

  ["🤔", "Narrator asks what the suspect was thinking"],

  ["🚨", "Narrator points out a major red flag"],

  ["🎬", "A dramatic moment happens"],

  ["👀", "A bystander gets involved"],

  ["🔍", "Evidence is discussed"],

  ["📝", "Police report is mentioned"],

  ["🎥", "Body cam footage starts"],

  ["💬", "Chat reacts to something in the video"],

  ["⭐", "A community member gets a shoutout"]

];

/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {

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


/* =========================================
   USERNAME REQUIREMENT
========================================= */

function requireUsername() {

  if (usernameMessage) {

    usernameMessage.textContent =
      "Enter your Twitch username first.";

  }

  twitchUsernameInput?.focus();

}


/* =========================================
   ENABLE / DISABLE CONTROLS
========================================= */

function setCardControlsEnabled(enabled) {

  if (newCardButton) {

    newCardButton.disabled = !enabled;

  }

  if (clearButton) {

    clearButton.disabled = !enabled;

  }

}


/* =========================================
   RESET CLAIM
========================================= */

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


/* =========================================
   UNLOCK BINGO CLAIM
========================================= */

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

}


/* =========================================
   CREATE NEW CARD
========================================= */

function createNewCard() {

  if (!playerHasEnteredName) {

    requireUsername();

    return;

  }


  currentCard =
    shuffle(bingoItems)
      .slice(0, 24)
      .map(item => ({

        icon: item[0],

        text: item[1],

        freeSpace: false

      }));


  /*
    Insert FREE SPACE into center.
    Index 12 = center of 5x5 card.
  */

  currentCard.splice(12, 0, {

    icon: "🌌",

    text: "FREE SPACE",

    freeSpace: true

  });


  resetClaimInformation();

  renderCard();


  if (cardNumberDisplay) {

    cardNumberDisplay.textContent =
      `#${cardNumber}`;

  }


  if (statusMessage) {

    statusMessage.textContent =
      "Tap a square when the moment happens!";

    statusMessage.classList.remove("bingo");

  }

}


/* =========================================
   RENDER CARD
========================================= */

function renderCard() {

  if (!bingoCard) return;

  bingoCard.innerHTML = "";


  currentCard.forEach(item => {

    const square =
      document.createElement("button");

    square.type = "button";

    square.className = "bingo-square";

    square.setAttribute(
      "aria-label",
      item.text
    );

    square.dataset.marked =
      String(item.freeSpace);


    const icon =
      document.createElement("span");

    icon.className = "square-icon";

    icon.textContent = item.icon;


    const text =
      document.createElement("span");

    text.className = "square-text";

    text.textContent = item.text;


    square.append(icon, text);


    /*
      FREE SPACE IS AUTOMATICALLY MARKED.
    */

    if (item.freeSpace) {

      square.classList.add(
        "free-space",
        "marked"
      );

    }


    /*
      CLICK TO MARK / UNMARK.
    */

    square.addEventListener("click", () => {

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

    });


    bingoCard.appendChild(square);

  });

}


/* =========================================
   GET MARKED SQUARES
========================================= */

function getMarkedSquares() {

  return [
    ...bingoCard.querySelectorAll(".bingo-square")
  ].map(square => {

    return square.dataset.marked === "true";

  });

}


/* =========================================
   CHECK FOR BINGO
========================================= */

function checkForBingo() {

  if (!playerHasEnteredName) return;


  const marked =
    getMarkedSquares();


  const winningLines = [

    // ROWS

    [0, 1, 2, 3, 4],

    [5, 6, 7, 8, 9],

    [10, 11, 12, 13, 14],

    [15, 16, 17, 18, 19],

    [20, 21, 22, 23, 24],


    // COLUMNS

    [0, 5, 10, 15, 20],

    [1, 6, 11, 16, 21],

    [2, 7, 12, 17, 22],

    [3, 8, 13, 18, 23],

    [4, 9, 14, 19, 24],


    // DIAGONALS

    [0, 6, 12, 18, 24],

    [4, 8, 12, 16, 20]

  ];


  const hasBingo =
    winningLines.some(line => {

      return line.every(index => marked[index]);

    });


  if (hasBingo) {

    if (!playerHasBingo) {

      if (statusMessage) {

        statusMessage.textContent =
          "🎉 BINGO! Type !bingo in Twitch chat! 🎉";

        statusMessage.classList.add("bingo");

      }

      unlockClaim();

    }

    return;

  }


  if (statusMessage) {

    statusMessage.textContent =
      `${marked.filter(Boolean).length} of 25 spaces marked.`;

    statusMessage.classList.remove("bingo");

  }

}


/* =========================================
   CLEAR MARKS
========================================= */

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


  if (statusMessage) {

    statusMessage.textContent =
      "Your marks have been cleared.";

    statusMessage.classList.remove("bingo");

  }

}


/* =========================================
   START GAME / USERNAME
========================================= */

playerForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const enteredName =
      twitchUsernameInput.value.trim();


    if (enteredName.length < 2) {

      usernameMessage.textContent =
        "Please enter a valid Twitch username.";

      twitchUsernameInput.focus();

      return;

    }


    playerUsername =
      enteredName;


    playerHasEnteredName =
      true;


    activeUsername.textContent =
      playerUsername;


    playerSetup.classList.add(
      "hidden"
    );


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


/* =========================================
   NEW CARD BUTTON
========================================= */

newCardButton?.addEventListener(
  "click",
  () => {

    if (!playerHasEnteredName) {

      return requireUsername();

    }


    cardNumber++;

    createNewCard();

  }
);


/* =========================================
   CLEAR BUTTON
========================================= */

clearButton?.addEventListener(
  "click",
  clearMarks
);


/* =========================================
   HOW TO PLAY
========================================= */

rulesButton?.addEventListener(
  "click",
  () => {

    rulesPanel?.classList.remove(
      "hidden"
    );

  }
);


closeRulesButton?.addEventListener(
  "click",
  () => {

    rulesPanel?.classList.add(
      "hidden"
    );

  }
);


/* =========================================
   INITIAL SETUP
========================================= */

setCardControlsEnabled(false);

resetClaimInformation();

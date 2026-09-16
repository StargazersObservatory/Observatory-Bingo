"use strict";

/* =========================================
   OBSERVATORY TWITCH BINGO
   Username required before using the card
========================================= */

/* =========================================
   PAGE ELEMENTS
========================================= */

const bingoCard = document.getElementById("bingoCard");
const statusMessage = document.getElementById("statusMessage");
const cardNumberDisplay = document.getElementById("cardNumber");

const newCardButton = document.getElementById("newCardButton");
const clearButton = document.getElementById("clearButton");
const rulesButton = document.getElementById("rulesButton");
const closeRulesButton = document.getElementById("closeRulesButton");
const rulesPanel = document.getElementById("rulesPanel");

/* =========================================
   FIXED USERNAME ELEMENT IDs
========================================= */

const playerForm = document.getElementById("usernameForm");
const twitchUsernameInput = document.getElementById("usernameInput");
const usernameMessage = document.getElementById("usernameError");
const playerSetup = document.getElementById("usernameSection");
const playerInfo = document.getElementById("playerInfo");
const activeUsername = document.getElementById("playerNameDisplay");

/* =========================================
   BINGO CLAIM ELEMENTS
========================================= */

const bingoClaimSection = document.getElementById("bingoClaimSection");
const bingoClaimButton = document.getElementById("bingoClaimButton");
const claimMessage = document.getElementById("claimMessage");

/* =========================================
   PLAYER STATE
========================================= */

let playerUsername = "";
let playerHasEnteredName = false;
let playerHasBingo = false;

/* =========================================
   BINGO ITEMS
========================================= */

const bingoItems = [
    {
        icon: "🥒",
        text: "Pickle is mentioned"
    },
    {
        icon: "🏁",
        text: "A marbles race starts"
    },
    {
        icon: "🐿️",
        text: "A squirrel appears"
    },
    {
        icon: "🎮",
        text: "Someone uses !jumanji"
    },
    {
        icon: "🧸",
        text: "The claw grabs a prize"
    },
    {
        icon: "📚",
        text: "Homework is mentioned"
    },
    {
        icon: "🧪",
        text: "Pixie is mentioned"
    },
    {
        icon: "🛰️",
        text: "The Observatory is mentioned"
    },
    {
        icon: "🔊",
        text: "A sound alert plays"
    },
    {
        icon: "👽",
        text: "An alien appears"
    },
    {
        icon: "🚛",
        text: "American Truck Simulator is mentioned"
    },
    {
        icon: "💥",
        text: "Someone uses !bonk"
    },
    {
        icon: "🐻",
        text: "Yogi Bear is mentioned"
    },
    {
        icon: "🌌",
        text: "Someone says Cosmic Goblins"
    },
    {
        icon: "🦆",
        text: "The purple duck appears"
    },
    {
        icon: "🏆",
        text: "A marbles winner is announced"
    },
    {
        icon: "💬",
        text: "Someone says chat"
    },
    {
        icon: "🔧",
        text: "A technical issue happens"
    },
    {
        icon: "😴",
        text: "Someone uses !tigger"
    },
    {
        icon: "🎥",
        text: "A community video is suggested"
    },
    {
        icon: "😂",
        text: "Stargazer laughs"
    },
    {
        icon: "📖",
        text: "Tiny Book Shop is mentioned"
    },
    {
        icon: "🥒",
        text: "A pickle joke happens"
    },
    {
        icon: "⭐",
        text: "Someone gets a shoutout"
    },
    {
        icon: "🧸",
        text: "A plushie gets stuck"
    },
    {
        icon: "🎵",
        text: "The winners anthem plays"
    },
    {
        icon: "👻",
        text: "Someone uses !ghost"
    },
    {
        icon: "🐯",
        text: "Someone mentions Tigger"
    },
    {
        icon: "🚀",
        text: "Someone says one more"
    },
    {
        icon: "🛠️",
        text: "Something needs fixing"
    },
    {
        icon: "🌟",
        text: "A rare prize is found"
    },
    {
        icon: "📡",
        text: "A strange transmission happens"
    },
    {
        icon: "🪐",
        text: "A space joke happens"
    },
    {
        icon: "🎲",
        text: "Someone rolls the dice"
    },
    {
        icon: "💜",
        text: "A community member gets a shoutout"
    },
    {
        icon: "📢",
        text: "A stream alert interrupts"
    },
    {
        icon: "🤔",
        text: "Someone asks what happened"
    },
    {
        icon: "🌵",
        text: "A Texas reference happens"
    },
    {
        icon: "🎮",
        text: "A game bug happens"
    },
    {
        icon: "🛰️",
        text: "The Observatory needs fixing"
    },
    {
        icon: "👾",
        text: "A Cosmic Goblin is blamed"
    },
    {
        icon: "🎉",
        text: "Chat celebrates"
    },
    {
        icon: "💫",
        text: "Something unexpected happens"
    },
    {
        icon: "🗣️",
        text: "Someone says hold on"
    },
    {
        icon: "🎁",
        text: "A surprise reward happens"
    },
    {
        icon: "🌙",
        text: "Someone talks about being tired"
    },
    {
        icon: "📅",
        text: "The stream schedule is mentioned"
    },
    {
        icon: "🎬",
        text: "A classic clip is mentioned"
    },
    {
        icon: "🧑‍🚀",
        text: "Someone joins the crew"
    },
    {
        icon: "💎",
        text: "A legendary moment happens"
    }
];

/* =========================================
   CARD STATE
========================================= */

let cardNumber = 1;
let currentCard = [];

/* =========================================
   HELPER FUNCTIONS
========================================= */

function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[randomIndex]] = [
            copy[randomIndex],
            copy[i]
        ];
    }

    return copy;
}

function showUsernameRequiredMessage() {
    if (usernameMessage) {
        usernameMessage.textContent =
            "Please enter your Twitch username before using the Bingo card.";
    }

    if (twitchUsernameInput) {
        twitchUsernameInput.focus();
    }
}

function setCardControlsEnabled(enabled) {
    if (newCardButton) {
        newCardButton.disabled = !enabled;
    }

    if (clearButton) {
        clearButton.disabled = !enabled;
    }

    if (bingoCard) {
        bingoCard.classList.toggle("card-locked", !enabled);
    }
}

/* =========================================
   CREATE NEW CARD
========================================= */

function createNewCard() {
    if (!playerHasEnteredName) {
        showUsernameRequiredMessage();
        return;
    }

    const shuffledItems = shuffle(bingoItems);

    currentCard = shuffledItems.slice(0, 24);

    currentCard.splice(12, 0, {
        icon: "🌌",
        text: "FREE SPACE",
        freeSpace: true
    });

    playerHasBingo = false;

    if (bingoClaimSection) {
        bingoClaimSection.classList.add("hidden");
    }

    if (claimMessage) {
        claimMessage.textContent = "";
    }

    renderCard();

    if (cardNumberDisplay) {
        cardNumberDisplay.textContent = `CARD #${cardNumber}`;
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
    if (!bingoCard) {
        return;
    }

    bingoCard.innerHTML = "";

    currentCard.forEach(function (item) {
        const square = document.createElement("button");

        square.type = "button";
        square.className = "bingo-square";
        square.setAttribute("aria-label", item.text);
        square.dataset.marked = "false";

        const icon = document.createElement("span");
        icon.className = "square-icon";
        icon.textContent = item.icon;

        const text = document.createElement("span");
        text.className = "square-text";
        text.textContent = item.text;

        square.appendChild(icon);
        square.appendChild(text);

        if (item.freeSpace) {
            square.classList.add("free-space");
            square.classList.add("marked");
            square.dataset.marked = "true";
        }

        square.addEventListener("click", function () {
            if (!playerHasEnteredName) {
                showUsernameRequiredMessage();
                return;
            }

            if (item.freeSpace) {
                return;
            }

            const currentlyMarked =
                square.dataset.marked === "true";

            square.dataset.marked =
                String(!currentlyMarked);

            square.classList.toggle(
                "marked",
                !currentlyMarked
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
    if (!bingoCard) {
        return [];
    }

    return Array.from(
        bingoCard.querySelectorAll(".bingo-square")
    ).map(function (square) {
        return square.dataset.marked === "true";
    });
}

/* =========================================
   CHECK FOR BINGO
========================================= */

function checkForBingo() {
    if (!playerHasEnteredName) {
        showUsernameRequiredMessage();
        return;
    }

    const markedSquares = getMarkedSquares();

    const winningLines = [
        /* Rows */
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],

        /* Columns */
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],

        /* Diagonals */
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    const hasBingo = winningLines.some(function (line) {
        return line.every(function (index) {
            return markedSquares[index];
        });
    });

    if (hasBingo) {
        playerHasBingo = true;

        if (statusMessage) {
            statusMessage.textContent =
                "🎉 BINGO! Claim your win below! 🎉";

            statusMessage.classList.add("bingo");
        }

        if (bingoClaimSection) {
            bingoClaimSection.classList.remove("hidden");
        }

        return;
    }

    const markedCount =
        markedSquares.filter(Boolean).length;

    if (statusMessage) {
        statusMessage.textContent =
            `${markedCount} of 25 spaces marked.`;

        statusMessage.classList.remove("bingo");
    }

    if (bingoClaimSection) {
        bingoClaimSection.classList.add("hidden");
    }
}

/* =========================================
   CLEAR MARKS
========================================= */

function clearMarks() {
    if (!playerHasEnteredName) {
        showUsernameRequiredMessage();
        return;
    }

    const squares = document.querySelectorAll(".bingo-square");

    squares.forEach(function (square, index) {
        if (index === 12) {
            square.dataset.marked = "true";
            square.classList.add("marked");
        } else {
            square.dataset.marked = "false";
            square.classList.remove("marked");
        }
    });

    playerHasBingo = false;

    if (statusMessage) {
        statusMessage.textContent =
            "Your marks have been cleared.";

        statusMessage.classList.remove("bingo");
    }

    if (bingoClaimSection) {
        bingoClaimSection.classList.add("hidden");
    }

    if (claimMessage) {
        claimMessage.textContent = "";
    }
}

/* =========================================
   PLAYER NAME SUBMISSION
========================================= */

if (playerForm && twitchUsernameInput) {
    playerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const enteredName =
            twitchUsernameInput.value.trim();

        if (enteredName === "") {
            if (usernameMessage) {
                usernameMessage.textContent =
                    "You must enter your Twitch username first.";
            }

            twitchUsernameInput.focus();
            return;
        }

        if (enteredName.length < 2) {
            if (usernameMessage) {
                usernameMessage.textContent =
                    "Please enter a valid Twitch username.";
            }

            twitchUsernameInput.focus();
            return;
        }

        /* Save username */
        playerUsername = enteredName;
        playerHasEnteredName = true;

        /* Display username */
        if (activeUsername) {
            activeUsername.textContent = playerUsername;
        }

        /* Hide username form */
        if (playerSetup) {
            playerSetup.classList.add("hidden");
        }

        /* Show player information */
        if (playerInfo) {
            playerInfo.classList.remove("hidden");
        }

        /* Clear error message */
        if (usernameMessage) {
            usernameMessage.textContent = "";
        }

        /* Unlock card controls */
        setCardControlsEnabled(true);

        /* Create the player's card */
        cardNumber = 1;
        createNewCard();
    });
} else {
    console.error(
        "Bingo username form was not found. Check that the HTML uses usernameForm and usernameInput."
    );
}

/* =========================================
   NEW CARD BUTTON
========================================= */

if (newCardButton) {
    newCardButton.addEventListener("click", function () {
        if (!playerHasEnteredName) {
            showUsernameRequiredMessage();
            return;
        }

        cardNumber++;
        createNewCard();
    });
}

/* =========================================
   CLEAR BUTTON
========================================= */

if (clearButton) {
    clearButton.addEventListener("click", function () {
        clearMarks();
    });
}

/* =========================================
   RULES PANEL
========================================= */

if (rulesButton && rulesPanel) {
    rulesButton.addEventListener("click", function () {
        rulesPanel.classList.remove("hidden");
    });
}

if (closeRulesButton && rulesPanel) {
    closeRulesButton.addEventListener("click", function () {
        rulesPanel.classList.add("hidden");
    });
}

/* =========================================
   BINGO CLAIM BUTTON
========================================= */

if (bingoClaimButton) {
    bingoClaimButton.addEventListener("click", function () {
        if (!playerHasEnteredName) {
            showUsernameRequiredMessage();
            return;
        }

        if (!playerHasBingo) {
            if (claimMessage) {
                claimMessage.textContent =
                    "You need a complete Bingo line before claiming.";
            }

            return;
        }

        if (claimMessage) {
            claimMessage.textContent =
                `🎉 ${playerUsername}, type !bingoclaim in Twitch chat!`;
        }
    });
}

/* =========================================
   INITIAL LOCK STATE
========================================= */

setCardControlsEnabled(false);

if (bingoCard) {
    bingoCard.innerHTML = "";
}

if (statusMessage) {
    statusMessage.textContent =
        "Enter your Twitch username above to receive your Bingo card.";
}

if (bingoClaimSection) {
    bingoClaimSection.classList.add("hidden");
}

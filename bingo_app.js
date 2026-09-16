"use strict";

/* =========================================
   OBSERVATORY TWITCH BINGO
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

/* Username elements */

const playerForm =
    document.getElementById("usernameForm") ||
    document.getElementById("playerForm");

const twitchUsernameInput =
    document.getElementById("usernameInput") ||
    document.getElementById("twitchUsername");

const usernameMessage =
    document.getElementById("usernameError") ||
    document.getElementById("usernameMessage");

const playerSetup =
    document.getElementById("usernameSection") ||
    document.getElementById("playerSetup");

const playerInfo = document.getElementById("playerInfo");

const activeUsername =
    document.getElementById("playerNameDisplay") ||
    document.getElementById("activeUsername");

/* Claim elements */

const claimSection = document.getElementById("claimSection");
const claimButton = document.getElementById("claimButton");
const claimStatus = document.getElementById("claimStatus");
const claimResult = document.getElementById("claimResult");

const claimedPlayer = document.getElementById("claimedPlayer");
const claimedCard = document.getElementById("claimedCard");
const claimedTime = document.getElementById("claimedTime");
const claimChatCommand = document.getElementById("claimChatCommand");
const claimFinalMessage = document.getElementById("claimFinalMessage");

/* =========================================
   PLAYER STATE
========================================= */

let playerUsername = "";
let playerHasEnteredName = false;
let playerHasBingo = false;
let playerHasClaimed = false;

/* =========================================
   BINGO ITEMS
========================================= */

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

function resetClaimInformation() {
    playerHasBingo = false;
    playerHasClaimed = false;

    if (claimButton) {
        claimButton.disabled = true;
        claimButton.textContent = "🏆 CLAIM YOUR WIN";
    }

    if (claimStatus) {
        claimStatus.textContent =
            "Complete a Bingo to unlock your claim button.";
    }

    if (claimResult) {
        claimResult.classList.add("hidden");
    }

    if (claimedPlayer) {
        claimedPlayer.textContent = "—";
    }

    if (claimedCard) {
        claimedCard.textContent = "—";
    }

    if (claimedTime) {
        claimedTime.textContent = "—";
    }

    if (claimChatCommand) {
        claimChatCommand.textContent = "!bingoclaim";
    }

    if (claimFinalMessage) {
        claimFinalMessage.textContent = "";
    }
}

function unlockClaimButton() {
    playerHasBingo = true;

    if (claimButton) {
        claimButton.disabled = false;
        claimButton.textContent = "🏆 CLAIM YOUR WIN";
    }

    if (claimStatus) {
        claimStatus.textContent =
            "🎉 Bingo detected! Click the button to record your win.";
    }

    if (claimSection) {
        claimSection.classList.remove("hidden");
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

    currentCard = shuffledItems.slice(0, 24).map(function (item) {
        return {
            icon: item[0],
            text: item[1],
            freeSpace: false
        };
    });

    currentCard.splice(12, 0, {
        icon: "🌌",
        text: "FREE SPACE",
        freeSpace: true
    });

    resetClaimInformation();
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

            square.dataset.marked = String(!currentlyMarked);

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
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],

        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],

        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    const hasBingo = winningLines.some(function (line) {
        return line.every(function (index) {
            return markedSquares[index];
        });
    });

    if (hasBingo) {
        if (!playerHasBingo) {
            playerHasBingo = true;

            if (statusMessage) {
                statusMessage.textContent =
                    "🎉 BINGO! Your claim button is ready! 🎉";

                statusMessage.classList.add("bingo");
            }

            unlockClaimButton();
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

    resetClaimInformation();

    if (statusMessage) {
        statusMessage.textContent =
            "Your marks have been cleared.";

        statusMessage.classList.remove("bingo");
    }
}

/* =========================================
   PLAYER NAME SUBMISSION
========================================= */

if (playerForm) {
    playerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!twitchUsernameInput) {
            return;
        }

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

        playerUsername = enteredName;
        playerHasEnteredName = true;

        if (activeUsername) {
            activeUsername.textContent = playerUsername;
        }

        if (playerSetup) {
            playerSetup.classList.add("hidden");
        }

        if (playerInfo) {
            playerInfo.classList.remove("hidden");
        }

        if (usernameMessage) {
            usernameMessage.textContent = "";
        }

        setCardControlsEnabled(true);

        cardNumber = 1;
        createNewCard();
    });
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
   CLAIM BUTTON
========================================= */

if (claimButton) {
    claimButton.addEventListener("click", function () {
        if (!playerHasEnteredName) {
            showUsernameRequiredMessage();
            return;
        }

        if (!playerHasBingo) {
            if (claimStatus) {
                claimStatus.textContent =
                    "You need a complete Bingo line before claiming.";
            }

            return;
        }

        if (playerHasClaimed) {
            if (claimStatus) {
                claimStatus.textContent =
                    "This Bingo card has already been claimed.";
            }

            return;
        }

        const claimTime = new Date().toLocaleString();

        if (claimedPlayer) {
            claimedPlayer.textContent = playerUsername;
        }

        if (claimedCard) {
            claimedCard.textContent = `#${cardNumber}`;
        }

        if (claimedTime) {
            claimedTime.textContent = claimTime;
        }

        if (claimChatCommand) {
            claimChatCommand.textContent =
                `!bingoclaim ${playerUsername}`;
        }

        if (claimFinalMessage) {
            claimFinalMessage.textContent =
                `🎉 ${playerUsername}, your Bingo claim has been recorded on this page. Type the command above in Twitch chat.`;
        }

        if (claimStatus) {
            claimStatus.textContent =
                "✅ Your win has been recorded below.";
        }

        if (claimResult) {
            claimResult.classList.remove("hidden");
        }

        claimButton.disabled = true;
        claimButton.textContent = "✅ WIN CLAIMED";

        playerHasClaimed = true;
    });
}

/* =========================================
   INITIAL STATE
========================================= */

setCardControlsEnabled(false);
resetClaimInformation();

if (bingoCard) {
    bingoCard.innerHTML = "";
}

if (statusMessage) {
    statusMessage.textContent =
        "Enter your Twitch username above to receive your Bingo card.";
}

if (playerInfo) {
    playerInfo.classList.add("hidden");
}

const bingoCard = document.getElementById("bingoCard");
const statusMessage = document.getElementById("statusMessage");
const cardNumberDisplay = document.getElementById("cardNumber");

const newCardButton = document.getElementById("newCardButton");
const clearButton = document.getElementById("clearButton");
const rulesButton = document.getElementById("rulesButton");
const closeRulesButton = document.getElementById("closeRulesButton");
const rulesPanel = document.getElementById("rulesPanel");

const playerForm = document.getElementById("playerForm");
const twitchUsernameInput = document.getElementById("twitchUsername");
const usernameMessage = document.getElementById("usernameMessage");
const playerInfo = document.getElementById("playerInfo");
const activeUsername = document.getElementById("activeUsername");

const bingoClaimSection = document.getElementById("bingoClaimSection");
const bingoClaimButton = document.getElementById("bingoClaimButton");
const claimMessage = document.getElementById("claimMessage");


/* =====================================================
   BINGO ITEMS
===================================================== */

const bingoItems = [
    { icon: "🥒", text: "Pickle is mentioned" },
    { icon: "🏁", text: "A marbles race starts" },
    { icon: "🐿️", text: "A squirrel appears" },
    { icon: "🎮", text: "Someone uses !jumanji" },
    { icon: "🧸", text: "The claw grabs a prize" },
    { icon: "📚", text: "Homework is mentioned" },
    { icon: "🧪", text: "Pixie is mentioned" },
    { icon: "🛰️", text: "The Observatory is mentioned" },
    { icon: "🔊", text: "A sound alert plays" },
    { icon: "👽", text: "An alien appears" },
    { icon: "🚛", text: "American Truck Simulator is mentioned" },
    { icon: "💥", text: "Someone uses !bonk" },
    { icon: "🐻", text: "Yogi Bear is mentioned" },
    { icon: "🌌", text: "Someone says Cosmic Goblins" },
    { icon: "🦆", text: "The purple duck appears" },
    { icon: "🏆", text: "A marbles winner is announced" },
    { icon: "💬", text: "Someone says chat" },
    { icon: "🔧", text: "A technical issue happens" },
    { icon: "😴", text: "Someone uses !tigger" },
    { icon: "🎥", text: "A community video is suggested" },
    { icon: "😂", text: "Stargazer laughs" },
    { icon: "📖", text: "Tiny Book Shop is mentioned" },
    { icon: "🥒", text: "A pickle joke happens" },
    { icon: "⭐", text: "Someone gets a shoutout" },
    { icon: "🧸", text: "A plushie gets stuck" },
    { icon: "🎵", text: "The winners anthem plays" },
    { icon: "👻", text: "Someone uses !ghost" },
    { icon: "🐯", text: "Someone mentions Tigger" },
    { icon: "🚀", text: "Someone says one more" },
    { icon: "🛠️", text: "Something needs fixing" },
    { icon: "🌟", text: "A rare prize is found" },
    { icon: "📡", text: "A strange transmission happens" },
    { icon: "🪐", text: "A space joke happens" },
    { icon: "🎲", text: "Someone rolls the dice" },
    { icon: "💜", text: "A community member gets a shoutout" },
    { icon: "📢", text: "A stream alert interrupts" },
    { icon: "🤔", text: "Someone asks what happened" },
    { icon: "🌵", text: "A Texas reference happens" },
    { icon: "🎮", text: "A game bug happens" },
    { icon: "🛰️", text: "The Observatory needs fixing" },
    { icon: "👾", text: "A Cosmic Goblin is blamed" },
    { icon: "🎉", text: "Chat celebrates" },
    { icon: "💫", text: "Something unexpected happens" },
    { icon: "🗣️", text: "Someone says hold on" },
    { icon: "🎁", text: "A surprise reward happens" },
    { icon: "🌙", text: "Someone talks about being tired" },
    { icon: "📅", text: "The stream schedule is mentioned" },
    { icon: "🎬", text: "A classic clip is mentioned" },
    { icon: "🧑‍🚀", text: "Someone joins the crew" },
    { icon: "💎", text: "A legendary moment happens" }
];


/* =====================================================
   APP STATE
===================================================== */

let cardNumber = 1;
let currentCard = [];
let activePlayer = "";
let hasBingo = false;


/* =====================================================
   DISCORD WEBHOOK
===================================================== */

/*
Leave this blank.

A Discord webhook inside a public GitHub Pages file
can be copied and abused by anyone.

Players will be told to type !bingoclaim in Twitch chat.
*/

const DISCORD_WEBHOOK_URL = "";


/* =====================================================
   SHUFFLE
===================================================== */

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


/* =====================================================
   USERNAME VALIDATION
===================================================== */

function validTwitchUsername(username) {
    return /^[a-zA-Z0-9_]{1,25}$/.test(username);
}


/* =====================================================
   CLAIM SECTION
===================================================== */

function setClaimState(enabled) {
    if (!bingoClaimSection || !bingoClaimButton) {
        return;
    }

    if (!activePlayer) {
        bingoClaimSection.classList.add("hidden");
        bingoClaimButton.disabled = true;
        return;
    }

    bingoClaimSection.classList.remove("hidden");
    bingoClaimButton.disabled = !enabled;
}


/* =====================================================
   CREATE CARD
===================================================== */

function createNewCard() {
    const shuffledItems = shuffle(bingoItems);

    currentCard = shuffledItems.slice(0, 24);

    currentCard.splice(12, 0, {
        icon: "🌌",
        text: "FREE SPACE",
        freeSpace: true
    });

    hasBingo = false;

    renderCard();

    if (cardNumberDisplay) {
        cardNumberDisplay.textContent = `CARD #${cardNumber}`;
    }

    if (statusMessage) {
        statusMessage.textContent = activePlayer
            ? "Tap a square when the moment happens!"
            : "Enter your Twitch username to activate your card.";

        statusMessage.classList.remove("bingo");
    }

    if (claimMessage) {
        claimMessage.textContent = "";
    }

    setClaimState(false);
}


/* =====================================================
   RENDER CARD
===================================================== */

function renderCard() {
    if (!bingoCard) {
        return;
    }

    bingoCard.innerHTML = "";

    currentCard.forEach((item) => {
        const square = document.createElement("button");

        square.type = "button";
        square.className = "bingo-square";
        square.setAttribute("aria-label", item.text);

        square.dataset.marked = item.freeSpace
            ? "true"
            : "false";

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
        }

        square.addEventListener("click", () => {
            if (!activePlayer) {
                usernameMessage.textContent =
                    "Enter your Twitch username first.";

                twitchUsernameInput.focus();
                return;
            }

            if (item.freeSpace) {
                return;
            }

            const currentlyMarked =
                square.dataset.marked === "true";

            const newMarkedState = !currentlyMarked;

            square.dataset.marked =
                String(newMarkedState);

            square.classList.toggle(
                "marked",
                newMarkedState
            );

            checkForBingo();
        });

        bingoCard.appendChild(square);
    });
}


/* =====================================================
   GET MARKED SQUARES
===================================================== */

function getMarkedSquares() {
    return Array.from(
        document.querySelectorAll(".bingo-square")
    ).map((square) => {
        return square.dataset.marked === "true";
    });
}


/* =====================================================
   CHECK BINGO
===================================================== */

function checkForBingo() {
    const markedSquares = getMarkedSquares();

    const winningLines = [

        // Rows
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],

        // Columns
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],

        // Diagonals
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    hasBingo = winningLines.some((line) => {
        return line.every((index) => {
            return markedSquares[index];
        });
    });

    if (hasBingo) {
        statusMessage.textContent =
            "🎉 BINGO! Press BINGO! CLAIM below! 🎉";

        statusMessage.classList.add("bingo");

        setClaimState(true);

        return;
    }

    const markedCount =
        markedSquares.filter(Boolean).length;

    statusMessage.textContent =
        `${markedCount} of 25 spaces marked.`;

    statusMessage.classList.remove("bingo");

    setClaimState(false);
}


/* =====================================================
   CLEAR MARKS
===================================================== */

function clearMarks() {
    const squares =
        document.querySelectorAll(".bingo-square");

    squares.forEach((square, index) => {
        if (index === 12) {
            square.dataset.marked = "true";
            square.classList.add("marked");
        } else {
            square.dataset.marked = "false";
            square.classList.remove("marked");
        }
    });

    hasBingo = false;

    statusMessage.textContent =
        "Your marks have been cleared.";

    statusMessage.classList.remove("bingo");

    if (claimMessage) {
        claimMessage.textContent = "";
    }

    setClaimState(false);
}


/* =====================================================
   USERNAME FORM
===================================================== */

if (playerForm) {
    playerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username =
            twitchUsernameInput.value.trim();

        if (!validTwitchUsername(username)) {
            usernameMessage.textContent =
                "Use 1–25 letters, numbers, or underscores only.";

            activePlayer = "";

            playerInfo.classList.add("hidden");

            setClaimState(false);

            return;
        }

        activePlayer = username;

        activeUsername.textContent =
            activePlayer;

        playerInfo.classList.remove("hidden");

        usernameMessage.textContent =
            "Your Bingo card is ready!";

        cardNumber = 1;

        createNewCard();
    });
}


/* =====================================================
   NEW CARD BUTTON
===================================================== */

if (newCardButton) {
    newCardButton.addEventListener("click", () => {
        if (!activePlayer) {
            usernameMessage.textContent =
                "Enter your Twitch username first.";

            twitchUsernameInput.focus();

            return;
        }

        cardNumber++;

        createNewCard();
    });
}


/* =====================================================
   CLEAR BUTTON
===================================================== */

if (clearButton) {
    clearButton.addEventListener("click", () => {
        if (!activePlayer) {
            usernameMessage.textContent =
                "Enter your Twitch username first.";

            twitchUsernameInput.focus();

            return;
        }

        clearMarks();
    });
}


/* =====================================================
   RULES PANEL
===================================================== */

if (rulesButton) {
    rulesButton.addEventListener("click", () => {
        rulesPanel.classList.remove("hidden");
    });
}

if (closeRulesButton) {
    closeRulesButton.addEventListener("click", () => {
        rulesPanel.classList.add("hidden");
    });
}


/* =====================================================
   BINGO CLAIM BUTTON
===================================================== */

if (bingoClaimButton) {
    bingoClaimButton.addEventListener("click", async () => {
        if (!activePlayer || !hasBingo) {
            return;
        }

        if (!DISCORD_WEBHOOK_URL) {
            claimMessage.textContent =
                "🎉 Bingo confirmed! Type !bingoclaim in Twitch chat so the crew can verify it.";

            return;
        }

        bingoClaimButton.disabled = true;

        claimMessage.textContent =
            "Sending your Bingo claim...";

        try {
            const response = await fetch(
                DISCORD_WEBHOOK_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        content:
                            `🎉 **BINGO CLAIM!**\n` +
                            `Player: **${activePlayer}**\n` +
                            `Card: **#${cardNumber}**\n` +
                            `The player completed a Bingo line.`
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Discord webhook request failed."
                );
            }

            claimMessage.textContent =
                "✅ Claim sent! Wait for the Observatory crew to verify it.";

        } catch (error) {
            console.error(
                "Bingo claim error:",
                error
            );

            claimMessage.textContent =
                "The claim could not be sent. Type !bingoclaim in Twitch chat instead.";

            bingoClaimButton.disabled = false;
        }
    });
}


/* =====================================================
   START APP
===================================================== */

createNewCard();

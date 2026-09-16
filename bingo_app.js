const bingoCard = document.getElementById("bingoCard");
const statusMessage = document.getElementById("statusMessage");
const cardNumberDisplay = document.getElementById("cardNumber");

const newCardButton = document.getElementById("newCardButton");
const clearButton = document.getElementById("clearButton");
const rulesButton = document.getElementById("rulesButton");
const closeRulesButton = document.getElementById("closeRulesButton");
const rulesPanel = document.getElementById("rulesPanel");

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

let cardNumber = 1;
let currentCard = [];

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

function createNewCard() {
    const shuffledItems = shuffle(bingoItems);

    currentCard = shuffledItems.slice(0, 24);

    currentCard.splice(12, 0, {
        icon: "🌌",
        text: "FREE SPACE",
        freeSpace: true
    });

    renderCard();

    cardNumberDisplay.textContent = `CARD #${cardNumber}`;

    statusMessage.textContent =
        "Tap a square when the moment happens!";

    statusMessage.classList.remove("bingo");
}

function renderCard() {
    bingoCard.innerHTML = "";

    currentCard.forEach((item, index) => {
        const square = document.createElement("button");

        square.type = "button";
        square.className = "bingo-square";

        square.setAttribute(
            "aria-label",
            item.text
        );

        square.dataset.marked = "false";

        const icon = document.createElement("span");

        icon.className = "square-icon";
        icon.textContent = item.icon;

        const text = document.createElement("span");

        text.textContent = item.text;

        square.appendChild(icon);
        square.appendChild(text);

        if (item.freeSpace) {
            square.classList.add("free-space");
            square.classList.add("marked");
            square.dataset.marked = "true";
        }

        square.addEventListener("click", () => {
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

function getMarkedSquares() {
    return Array.from(
        document.querySelectorAll(".bingo-square")
    ).map((square) => {
        return square.dataset.marked === "true";
    });
}

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

    const hasBingo = winningLines.some((line) => {
        return line.every((index) => {
            return markedSquares[index];
        });
    });

    if (hasBingo) {
        statusMessage.textContent =
            "🎉 BINGO! Type !bingoclaim in Twitch chat! 🎉";

        statusMessage.classList.add("bingo");

        return;
    }

    const markedCount = markedSquares.filter(Boolean).length;

    statusMessage.textContent =
        `${markedCount} of 25 spaces marked.`;

    statusMessage.classList.remove("bingo");
}

function clearMarks() {
    const squares = document.querySelectorAll(".bingo-square");

    squares.forEach((square, index) => {
        if (index === 12) {
            square.dataset.marked = "true";
            square.classList.add("marked");
        } else {
            square.dataset.marked = "false";
            square.classList.remove("marked");
        }
    });

    statusMessage.textContent = "Your marks have been cleared.";
    statusMessage.classList.remove("bingo");
}

newCardButton.addEventListener("click", () => {
    cardNumber++;
    createNewCard();
});

clearButton.addEventListener("click", clearMarks);

rulesButton.addEventListener("click", () => {
    rulesPanel.classList.remove("hidden");
});

closeRulesButton.addEventListener("click", () => {
    rulesPanel.classList.add("hidden");
});

createNewCard();
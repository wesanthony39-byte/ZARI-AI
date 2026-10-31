const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatArea = document.getElementById("chatArea");
const markedParser = new marked.Marked();
function addCopyButtons() {
    const codeBlocks = chatArea.querySelectorAll("pre");

    codeBlocks.forEach((block) => {
        if (block.querySelector(".copy-button")) return;

        const button = document.createElement("button");
        button.textContent = "Copy Code";
        button.className = "copy-button";

        button.addEventListener("click", async () => {
            const code = block.querySelector("code");
            await navigator.clipboard.writeText(code.innerText);
            button.textContent = "Copied!";
        });

        block.appendChild(button);
    });
}
async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    const userMessage = document.createElement("p");
    userMessage.textContent = "You: " + message;
    chatArea.appendChild(userMessage);

    userInput.value = "";
    sendButton.disabled = true;

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "ZARI AI ana fikiria...";
    chatArea.appendChild(loadingMessage);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        loadingMessage.remove();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        const aiMessage = document.createElement("div");

const aiLabel = document.createElement("strong");
aiLabel.textContent = "ZARD AI: ";

const aiAnswer = document.createElement("div");
aiAnswer.innerHTML = DOMPurify.sanitize(markedParser.parse(data.reply));

aiMessage.appendChild(aiLabel);
aiMessage.appendChild(aiAnswer);
        chatArea.appendChild(aiMessage);
addCopyButtons();
    } catch (error) {
        loadingMessage.textContent = "Error: " + error.message;
    }

    sendButton.disabled = false;
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Switch from welcome screen to AI interface
const guestButton = document.getElementById("guestButton");

guestButton.addEventListener("click", function () {
    document.getElementById("welcomeScreen").style.display = "none";

    document.querySelector(".app > header").style.display = "block";
    document.querySelector(".app > .creator-credit").style.display = "block";
    document.querySelector(".app > main").style.display = "block";
});
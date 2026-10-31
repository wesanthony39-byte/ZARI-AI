const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const newChatBtn = document.getElementById("newChatBtn");

const welcomeHTML = document.getElementById("welcomeScreen").outerHTML;

let isLoading = false;

function addMessage(text, className) {
    const message = document.createElement("div");
    message.className = `message ${className}`;
    message.textContent = text;
    chatArea.appendChild(message);
    chatArea.scrollTop = chatArea.scrollHeight;
    return message;
}

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message || isLoading) return;

    isLoading = true;
    userInput.value = "";

    const welcome = document.getElementById("welcomeScreen");
    if (welcome) welcome.remove();

    addMessage(message, "user-message");

    const loadingMessage = addMessage(
        "ZARD AI is thinking...",
        "ai-message"
    );

    sendButton.disabled = true;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        const reply =
            data.reply ||
            data.response ||
            data.text ||
            data.message ||
            data.candidates?.[0]?.content?.parts
                ?.map(part => part.text)
                .join("\n") ||
            "I couldn't generate a response.";

        loadingMessage.textContent = reply;

    } catch (error) {
        loadingMessage.textContent =
            "Sorry, something went wrong. Please try again.";

        console.error("ZARD AI error:", error);

    } finally {
        isLoading = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

newChatBtn.addEventListener("click", function() {
    chatArea.innerHTML = welcomeHTML;
    userInput.value = "";
    userInput.focus();
});

chatArea.addEventListener("click", function(event) {
    const button = event.target.closest(".suggestion");

    if (!button) return;

    const prompts = {
        "✧ Ideas": "Give me creative ideas.",
        "▤ Create": "Help me create something.",
        "</> Code": "Help me write and understand code.",
        "◎ Explore": "Let's explore an interesting topic."
    };

    const prompt = prompts[button.textContent.trim()];

    if (prompt) {
        userInput.value = prompt;
        userInput.focus();
    }
});
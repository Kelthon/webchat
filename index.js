const messageList = document.getElementById("view-messages");
const inputMessage = document.getElementById("send-message-input");
const inputSendButton = document.getElementById("send-message-button");
const inputForm = document.getElementById("send-message-form");

function getCurrentTime(date) {
  currentTime = !!date ? new Date(date) : new Date();

  return currentTime
    .toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .split(",")[1]
    .trim();
}

function getDateMark(date) {
  return `<li class="info-message">
  <p><small>${date}</small></p>
</li>`;
}

function addMessage() {
  if (inputMessage.value) {
    let messages = messageList.children;
    let lastMessage = messages[messages.length - 1];

    if (lastMessage.classList.contains("sended")) {
      let msg = lastMessage.querySelector("div").innerHTML.split("<footer>")[0];
      let footer = lastMessage.querySelector("div > footer").outerHTML;

      lastMessage.querySelector(
        "div"
      ).innerHTML = `${msg}<p>${inputMessage.value}</p>${footer}`;
    } else {
      messageList.innerHTML = `${messageList.innerHTML}
        <li class="text-message sended">
          <div>
            <p>${inputMessage.value}</p>
            <footer>
              <small class="message-status">${getCurrentTime()}</small>
            </footer>
          </div>
        </li>`;
    }

    inputMessage.value = "";
  }
}

function loadMessages() {
  const preloadedMessages = [
    {
      type: "text-message",
      content: "Hello.",
      sendDate: "02/18/2024 08:00:42",
      isSender: false,
    },
    {
      type: "text-message",
      content: "Hi 😊.",
      sendDate: "02/18/2024 08:01:57",
      isSender: true,
    },
    {
      type: "text-message",
      content: "John Here.",
      sendDate: "02/19/2024 15:25:42",
      isSender: false,
    },
    {
      type: "text-message",
      content: "Can you send me the your annotations?",
      sendDate: "02/19/2024 15:27:57",
      isSender: false,
    },
    {
      type: "text-message",
      content: "Oh hi Hi John.",
      sendDate: "02/19/2024 15:34:02",
      isSender: true,
    },
    {
      type: "text-message",
      content: "Sure I do.",
      sendDate: "02/19/2024 15:34:11",
      isSender: true,
    },
    {
      type: "view-once-photo",
      content: null,
      sendDate: "02/19/2024 15:39:26",
      isSender: true,
    },
    {
      type: "view-once-photo",
      content: null,
      sendDate: "02/19/2024 15:46:12",
      isSender: false,
    },
  ];
  
  let loadedMessages = ""

  for (let msg of preloadedMessages) {
    mainContent = msg.content

    if (msg.type !== "text-message") {
      mainContent = `<i class="ri-reply-fill ri-xl"></i>
      <button type="button">
        <i class="ri-camera-fill"></i>
        <span>photo</span>
      </button>`;
    }

    loadedMessages = `${loadedMessages}
      <li class="${msg.type} ${msg.isSender ? "sended" : "received"}">
        <div>
          <p>
            ${mainContent}
          </p>
          <footer>
            <small class="message-status">${getCurrentTime(
              new Date(msg.sendDate)
            )}</small>
          </footer>
        </div>
      </li>`;

    messageList.innerHTML = loadedMessages;
  }
}

window.addEventListener("load", () => loadMessages());

inputSendButton.addEventListener("click", () => addMessage());

inputForm.addEventListener("submit", event => {
  event.preventDefault();
  addMessage();
  messageList.scrollTop = messageList.scrollHeight;
});

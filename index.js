const messageList = document.getElementById("view-messages");
const inputMessage = document.getElementById("send-message-input");
const inputSendButton = document.getElementById("send-message-button");
const inputForm = document.getElementById("send-message-form");
const preloadedMessages = [
  {
    id: 0,
    type: "text-message",
    content: "Hello.",
    sendDate: "02/18/2024 08:00:42",
    isSender: false,
  },
  {
    id: 1,
    type: "text-message",
    content: "Hi 😊.",
    sendDate: "02/18/2024 08:01:57",
    isSender: true,
  },
  {
    id: 2,
    type: "text-message",
    content: "John Here.",
    sendDate: "02/19/2024 15:25:42",
    isSender: false,
  },
  {
    id: 3,
    type: "text-message",
    content: "Can you send me the your annotations?",
    sendDate: "02/19/2024 15:27:57",
    isSender: false,
  },
  {
    id: 4,
    type: "text-message",
    content: "Oh hi Hi John.",
    sendDate: "02/19/2024 15:34:02",
    isSender: true,
  },
  {
    id: 5,
    type: "text-message",
    content: "Sure I do.",
    sendDate: "02/19/2024 15:34:11",
    isSender: true,
  },
  {
    id: 6,
    type: "view-once-photo",
    content: null,
    sendDate: "02/19/2024 15:39:26",
    isSender: true,
  },
  {
    id: 7,
    type: "text-message",
    content: "Thx Bro.",
    sendDate: "02/19/2024 15:46:12",
    isSender: false,
  },
];

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

function getElapsedTime(date) {
  const isDateInTimeRange = (dayStart, dayEnd) => {
    const oneDayInMilliseconds = 86400000;
    let elapsedTime = new Date().getTime() - date.getTime();

    return (
      elapsedTime > oneDayInMilliseconds * dayStart &&
      elapsedTime < oneDayInMilliseconds * dayEnd
    );
  };

  if (isDateInTimeRange(0, 1)) {
    return "today";
  } else if (isDateInTimeRange(1, 2)) {
    return "yesterday";
  } else if (isDateInTimeRange(2, 6)) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
}

function getParagraph(content, attributes) {
  return `<p ${!!attributes ? attributes : ""}>${content}</p>`;
}

function getViewOnceButton(paragraphAttributes) {
  return `<p ${!!paragraphAttributes ? paragraphAttributes : ""}>
      <i class="ri-reply-fill ri-xl"></i>
      <button type="button">
        <i class="ri-camera-fill"></i>
        <span>photo</span>
      </button>
    </p>`;
}

function getTextMessage(content, isSender, sendDate) {
  return `<li class="text-message ${isSender ? "sended" : "received"}">
        <div>
          ${content}
          <footer>
            <small class="message-status">${getCurrentTime(
              new Date(sendDate)
            )}</small>
          </footer>
        </div>
      </li>`;
}

function getViewOncePhoto(content, isSender, sendDate) {
  return `<li class="view-once-photo ${isSender ? "sended" : "received"}">
        <div>
          ${content}
          <footer>
            <small class="message-status">${getCurrentTime(
              new Date(sendDate)
            )}</small>
          </footer>
        </div>
      </li>`;
}

function getContentParagraph(message) {
  let id = `id="${message.id}"`;

  if (message.type === "view-once-photo") {
    return getViewOnceButton(id);
  } else {
    return getParagraph(message.content, id);
  }
}

function concatMessagesContent(messagesList) {
  if (Array.isArray(messagesList)) {
    let concatenatedContent = "";

    for (message of messagesList) {
      concatenatedContent = `${concatenatedContent}
    ${getContentParagraph(message)}`;
    }

    return concatenatedContent;
  }

  return getParagraph(getContentParagraph(messagesList));
}

function groupMessages(messageList, groupFunction) {
  let groups = [];
  let array = [];
  let previousMessage = null;

  const copyMessage = (message) => {
    return {
      id: message.id,
      type: message.type,
      content: message.content,
      isSender: message.isSender,
      sendDate: message.sendDate,
    };
  };

  for (message of messageList) {
    if (!!previousMessage && groupFunction(message, previousMessage)) {
      previousMessage = copyMessage(message);
      array.push(message);
    } else {
      if (array.length > 0) {
        groups.push(array);
        array = [];
      }

      previousMessage = copyMessage(message);
      array.push(message);
    }
  }

  if (!!previousMessage && array.length > 0) groups.push(array);
  return groups;
}

function loadMessages() {
  let messageGroups = groupMessages(
    preloadedMessages,
    (message, lastMessage) => {
      return (
        message.type === lastMessage.type &&
        message.isSender === lastMessage.isSender
      );
    }
  );

  let loadedMessages = "";

  for (group of messageGroups) {
    let content = concatMessagesContent(group);
    let lastMessage = group.findLast(() => true);

    if (lastMessage.type === "text-message") {
      loadedMessages = `${loadedMessages}${getTextMessage(
        content,
        lastMessage.isSender,
        lastMessage.sendDate
      )}`;
    } else {
      loadedMessages = `${loadedMessages}${getViewOncePhoto(
        content,
        lastMessage.isSender,
        lastMessage.sendDate
      )}`;
    }
  }

  messageList.innerHTML = loadedMessages;
}

function getNewId() {
  return (
    preloadedMessages
      .map((message) => {
        return message.id;
      })
      .reduce((maxId, currentId) => {
        if (maxId < currentId) return currentId;
        return maxId;
      }) + 1
  );
}

function addMessage(id) {
  if (inputMessage.value) {
    preloadedMessages.push({
      id: id,
      type: "text-message",
      content: inputMessage.value,
      sendDate: new Date(),
      isSender: true,
    });

    inputMessage.value = "";
    inputMessage.focus();
    loadMessages();
  }
}

function removeMessage(id) {
  if (preloadedMessages.length > 0) {
    const messageIndex = preloadedMessages.findIndex(message => message.id === id);
    console.log(preloadedMessages.splice(messageIndex, 1));
    loadMessages();
  }
}

window.addEventListener("load", () => loadMessages());

inputSendButton.addEventListener("click", () => addMessage());

inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addMessage();
  messageList.scrollTop = messageList.scrollHeight;
});

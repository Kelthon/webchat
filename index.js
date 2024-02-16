const messageList = document.getElementById("view-messages");
const inputMessage = document.getElementById("send-message-input");
const inputSendButton = document.getElementById("send-message-button");
const inputForm = document.getElementById("send-message-form");

function getCurrentTime() {
  return new Date()
    .toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .split(",")[1]
    .trim();
}

function addMessage() {
  if (inputMessage.value) {
    messageList.innerHTML = `${messageList.innerHTML}
        <li class="sended">
            <div>
                <p>${inputMessage.value}</p>
                <footer>
                    <small class="message-status">${getCurrentTime()}</small>
                </footer>
            </div>
        </li>`;

    inputMessage.value = "";
  }
}

inputSendButton.addEventListener("click", () => addMessage());

inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addMessage();
});

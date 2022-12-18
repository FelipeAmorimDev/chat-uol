const chatMsgList = document.querySelector('.chat-msgs__list');
const chatMsgContainer = document.querySelector('.chat-msgs__container')
const formElement = document.querySelector('.joinchat__form-join form')
const joinChatSection = document.querySelector('.joinchat-section')
const messageForm = document.querySelector('.footer__container form')

const loginHandle = event => {
  const username = formElement.user.value

  event.preventDefault()
  tryJoinChat(username)
}

const renderChatmsgByType = msg => {
  const userName = formElement.user.value

  const statusTemplate = `<span class="time-style">${msg.time}</span> <span class="text-bold">${msg.from}</span> ${msg.text}..`
  const msgTemplate = `<span class="time-style">${msg.time}</span> <span class="text-bold">${msg.from}</span>  para <span class="text-bold">${msg.to}</span> : ${msg.text}`
  const privateMsgTemplate = `<span class="time-style">${msg.time}</span> <span class="text-bold">${msg.from}</span> reservadamente para <span class="text-bold">${msg.to}</span> : ${msg.text}`

  if (msg.type === 'status') {
    insertElementIntoDOM('chat-msg__item status-msg', statusTemplate)
  } else if (msg.type === 'message') {
    insertElementIntoDOM('chat-msg__item normal-msg', msgTemplate)

    return
  }

  if (msg.to === userName) {
    insertElementIntoDOM('chat-msg__item private-msg', privateMsgTemplate)
  }
}

const insertErrorMsg = () => {
  const erroParagraph = joinChatSection.querySelector('.error-msg');
  erroParagraph.textContent = 'Escolha outro usuario!'
  erroParagraph.classList.remove('d-none')
}

const insertElementIntoDOM = (className, template) => {
  const msgItemElement = document.createElement('LI');

  msgItemElement.setAttribute('class', className)
  msgItemElement.innerHTML = template
  chatMsgList.insertAdjacentElement('beforeend', msgItemElement)
  
  msgItemElement.scrollIntoView(true)
}

const loginInChat = (name, options) => {
  chatMsgContainer.classList.remove('d-none')
  joinChatSection.classList.add('d-none')

  getChatMessage()
  setInterval(getChatMessage, 6000)

  setInterval(() => {
    keepOnlineInChat(name, options)
  }, 5000)
}

async function tryJoinChat(name) {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: `{"name": "${name}"}`
  }

  const tryLoginChat = await fetch('https://mock-api.driven.com.br/api/v6/uol/participants', options)
  const isPossibleJoin = tryLoginChat.status === 200

  if (isPossibleJoin) {
    loginInChat(options)
  } else {
    insertErrorMsg()
  }
}

async function getChatMessage() {
  const response = await fetch('https://mock-api.driven.com.br/api/v6/uol/messages')
  const msgsData = await response.json()

  chatMsgList.innerHTML = '' // limpando para previnir dos itens serem readicionados ?

  msgsData.forEach(renderChatmsgByType)
}

async function keepOnlineInChat(options) {
  const keepUserOnline = await fetch('https://mock-api.driven.com.br/api/v6/uol/status', options)

  if (keepUserOnline.status === 200) {
    console.log('Mantendo Conexao')
  }
}

async function sendMsgToChat(from, to, text, type) {
  const postData = {
    from: from,
    to: to,
    text: text,
    type: type
  }
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(postData)
  }

  const sendPostRequisition = await fetch('https://mock-api.driven.com.br/api/v6/uol/messages', options)
  const getResponseInText = await sendPostRequisition.text()
  if (getResponseInText != 'OK') {
    window.location.reload()
  }
  else {
    console.log("msg enviada")
    getChatMessage()
  }

}

formElement.addEventListener('submit', loginHandle)

messageForm.addEventListener('submit', event => {
  event.preventDefault()
  if (messageForm.message.value != '') {
    sendMsgToChat(formElement.user.value, "todos", messageForm.message.value, "message")
    messageForm.message.value = '';
  }

})

globalThis.sendMsgToChat = sendMsgToChat

const chatMsgList = document.querySelector('.chat-msgs__list');
const chatMsgContainer = document.querySelector('.chat-msgs__container')
const formElement = document.querySelector('.joinchat__form-join form')
const joinChatSection = document.querySelector('.joinchat-section')
const messageForm = document.querySelector('.footer__container form')

async function joinChatRoom(name) {
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: `{"name": "${name}"}`
  }

  const tryingJoinChar = await fetch('https://mock-api.driven.com.br/api/v6/uol/participants', options)

  if (tryingJoinChar.status === 200) {
    console.log("entrou")
    chatMsgContainer.classList.remove('d-none')
    joinChatSection.classList.add('d-none')
    getChatMessage()
    setInterval(getChatMessage, 6000)
    setInterval(() => {
      keepOnlineInChat(name)
    }, 5000)
  }
  else {
    console.log(joinChatSection)
    const erroParagraph = joinChatSection.querySelector('.error-msg');
    console.log(erroParagraph)
    erroParagraph.textContent = 'Escolha outro usuario!'
    erroParagraph.classList.remove('d-none')
  }
}

async function keepOnlineInChat(name) {
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: `{"name": "${name}"}`
  }

  const keepUserOnline = await fetch('https://mock-api.driven.com.br/api/v6/uol/status', options)

  if (keepUserOnline.status === 200) {
    console.log('Mantendo Conexao')
  }

  return keepUserOnline
}

async function getChatMessage() {
  const userName = formElement.user.value
  const response = await fetch('https://mock-api.driven.com.br/api/v6/uol/messages')
  const msgsData = await response.json()

  chatMsgList.innerHTML = '' // limpando para previnir dos itens serem readicionados ?
  msgsData.forEach(msg => {
    const msgItemElement = document.createElement('LI');
    if (msg.type === 'status') {
      const statusTemplate = `<span class="time-style">${msg.time}</span> <span class="text-bold">${msg.from}</span> ${msg.text}..`

      msgItemElement.setAttribute('class', 'chat-msg__item status-msg')
      msgItemElement.innerHTML = statusTemplate


      chatMsgList.insertAdjacentElement('beforeend', msgItemElement)
    } else if (msg.type === 'message') {
      const statusTemplate = `<span class="time-style">${msg.time}</span> <span class="text-bold">${msg.from}</span>  para <span class="text-bold">${msg.to}</span> : ${msg.text}`

      msgItemElement.setAttribute('class', 'chat-msg__item normal-msg')
      msgItemElement.innerHTML = statusTemplate


      chatMsgList.insertAdjacentElement('beforeend', msgItemElement)
    } else {
      const statusTemplate = `<span class="time-style">${msg.time}</span> <span class="text-bold">${msg.from}</span> reservadamente para <span class="text-bold">${msg.to}</span> : ${msg.text}`

      msgItemElement.setAttribute('class', 'chat-msg__item private-msg')
      if (msg.to === userName) {
        msgItemElement.innerHTML = statusTemplate
        chatMsgList.insertAdjacentElement('beforeend', msgItemElement)
      }
    }
  })

  const lastItem = document.querySelector('li.chat-msg__item:last-child')
  lastItem.scrollIntoView()

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
  if(getResponseInText != 'OK'){
    window.location.reload()
  }
  else{
    console.log("msg enviada")
    getChatMessage()
  }
  
}

globalThis.sendMsgToChat = sendMsgToChat


formElement.addEventListener('submit', event => {
  event.preventDefault()
  joinChatRoom(formElement.user.value)
})

messageForm.addEventListener('submit', event => {
  event.preventDefault()
  if (messageForm.message.value != '') {
    sendMsgToChat(formElement.user.value, "todos", messageForm.message.value, "message")
    messageForm.message.value = '';
  }
  
})







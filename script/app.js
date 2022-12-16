
async function joinChatRoom(name){
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body:`{"name": "${name}"}`
  }

  const tryingJoinChar = await fetch('https://mock-api.driven.com.br/api/v6/uol/participants',options)
  console.log(tryingJoinChar.status)
  const dataJson = await tryingJoinChar.text()
  
  if(dataJson === 'OK'){
    console.log('Entrou no chat')
  }
}

async function  keepOnlineInChat(name){
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body:`{"name": "${name}"}`
  }

  const keepUserOnline = await fetch('https://mock-api.driven.com.br/api/v6/uol/status',options)
  
  if(keepUserOnline.status === 200){
    console.log('Mantendo Conexao')
  }
}

async function getChatMessage(){
  const response = await fetch('https://mock-api.driven.com.br/api/v6/uol/messages')
  const jsonData = await response.json()
  console.log(jsonData)
}


getChatMessage()
console.log(joinChatRoom('donavsan'))
setInterval(() => {
  console.log(keepOnlineInChat('donavan'))
},5000)



// Criar EnviarMsgRequisition
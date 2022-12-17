async function joinChatRoom(name){
  let options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body:`{"name": "${name}"}`
  }

  const tryingJoinChar = await fetch('https://mock-api.driven.com.br/api/v6/uol/participants',options)
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

async function sendMsgToChat(from,to,text,type){
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
  body:JSON.stringify(postData)
}

const sendPostRequisition = await fetch('https://mock-api.driven.com.br/api/v6/uol/messages',options)
const getResponseInText = await sendPostRequisition.text()
}






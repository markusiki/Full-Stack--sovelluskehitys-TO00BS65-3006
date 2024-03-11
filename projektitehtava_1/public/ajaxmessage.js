const submitButton = document.getElementById('submit')
const messagesHeader = document.getElementById('messagesHeader')
const messagesList = document.getElementById('messages')

function postForm(event) {
  event.preventDefault()
  fetch('/ajaxmessage', {
    method: 'POST',
    body: JSON.stringify({
      username: event.target.username.value,
      country: event.target.country.value,
      message: event.target.message.value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((messages) => showMessages(messages))
}
submitButton.addEventListener('submit', postForm)

function showMessages(messages) {
  if (messagesList.firstChild) {
    const li = document.createElement('li')
    li.innerHTML = messages[messages.length - 1]
    li.className = 'list-group-item'
    messagesList.appendChild(li)
  } else {
    messagesHeader.innerHTML = 'Messages:'
    messages.forEach((message) => {
      const li = document.createElement('li')
      li.innerHTML = message
      li.className = 'list-group-item'
      messagesList.appendChild(li)
    })
  }
}

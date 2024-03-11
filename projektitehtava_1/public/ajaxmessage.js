const submitButton = document.getElementById('submit')
const messagesElement = document.getElementById('messages')

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
  if (messagesElement.firstChild) {
    const p = document.createElement('p')
    messagesElement.appendChild(p)
    p.innerHTML = messages[messages.length - 1]
  } else {
    document.createElement('h2').innerHTML = 'Messages:'
    const header = document.createElement('h1')
    header.innerHTML = 'Messages:'
    messagesElement.appendChild(header)
    messages.forEach((message) => {
      const p = document.createElement('p')
      messagesElement.appendChild(p)
      p.innerHTML = message
    })
  }
}

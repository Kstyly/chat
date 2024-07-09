// Login Elements
const login = document.querySelector(".login")
const loginForm = document.querySelector(".loginForm")
const loginInput = document.querySelector(".loginInput")

// Chat Elements
const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chatForm")
const chatInput = document.querySelector(".chatInput")
const chatMessages = document.querySelector(".chatMessages")

const colors = [
    "blue",
    "aqua",
    "pink",
    "yellow",
    "greem",
    "purple",
    "gold",
    "white"
]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const user = {
    id:     "",
    name:   "",
    color:  ""
}

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("messageSelf")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const p = document.createElement("p")

    div.classList.add("messageOther")
    div.classList.add("messageSelf")
    p.classList.add("messageSender")
    p.style.color = senderColor

    div.appendChild(p)

    p.innerHTML = sender
    div.innerHTML += content
    

    return div
}

const scrollScreem = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)
    scrollScreem()
}

const handleSubmit = (event) => {
    event.preventDefault()

    user.color = getRandomColor()
    user.name = loginInput.value
    user.id = crypto.randomUUID()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleSubmit)
chatForm.addEventListener("submit", sendMessage)
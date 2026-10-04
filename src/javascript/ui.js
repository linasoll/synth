import * as Tone from "tone"

const lamps = document.querySelectorAll(".lamp")

let lampsEventId = null


function blinkLamps() {
  lamps.forEach(lamp => {
    lamp.classList.remove("lamp--active")
  })

  const lampsCount = Math.floor(Math.random() * 12) + 3

  const shuffledLamps = [...lamps].sort(() => Math.random() - 0.5)

  shuffledLamps
    .slice(0, lampsCount)
    .forEach(lamp => {
      lamp.classList.add("lamp--active")
    })
}


function initLamps() {
  if (lampsEventId !== null) return

  lampsEventId = Tone.getTransport().scheduleRepeat(() => {
    blinkLamps()
  }, "4n")
}


function stopLamps() {
  lamps.forEach(lamp => {
    lamp.classList.remove("lamp--active")
  })
}

const playButton = document.querySelector("#play")
const pauseButton = document.querySelector("#pause")
const stopButton = document.querySelector("#stop")


function setButtonDisabled(button, disabled) {
  const icons = button.querySelectorAll(".transport-button__icon")

  button.classList.toggle("transport-button--disabled", disabled)
  button.disabled = disabled

  icons.forEach(icon => {
    icon.classList.toggle(
      "transport-button__icon--disabled",
      disabled
    )
  })
}

function setPlayingState() {
  setButtonDisabled(playButton, true)
  setButtonDisabled(pauseButton, false)
  setButtonDisabled(stopButton, false)
}


function setPausedState() {
  setButtonDisabled(playButton, false)
  setButtonDisabled(pauseButton, true)
  setButtonDisabled(stopButton, false)
}


function setStoppedState() {
  setButtonDisabled(playButton, false)
  setButtonDisabled(pauseButton, true)
  setButtonDisabled(stopButton, true)
}

setStoppedState()

export {
  initLamps,
  stopLamps,
  setPlayingState,
  setPausedState,
  setStoppedState
}
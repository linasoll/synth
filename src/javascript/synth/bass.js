import * as Tone from "tone"

import {
  bassSynthSequence
} from "../parts/bassPart.js"

const bassSynthSettings = {
  oscillator: {
    type: "sine"
  },

  envelope: {
    attack: 0.05,
    decay: 0.3,
    sustain: 0.8,
    release: 1.5
  }
}

let bassSynth = null
let bassPart = null
let bassVolume = null

function initBassVolumeControl() {
  const volumeInput = document.querySelector("#bass-volume")

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value)

    if (value === -60) {
      bassVolume.mute = true
      return
    }

    bassVolume.mute = false
    bassVolume.volume.rampTo(value, 0.05)
  })
}

function initBassMuteControl() {
  const muteButton = document.querySelector("#bass-mute")

  muteButton.addEventListener("click", () => {
    bassVolume.mute = !bassVolume.mute

    muteButton.classList.toggle(
      "mute__button--active",
      bassVolume.mute
    )

    muteButton.textContent = bassVolume.mute
      ? "PLAY"
      : "MUTE"
  })
}

export function initBassSynth() {
  if (bassPart) return

  bassVolume = new Tone.Volume(-6).toDestination()

  bassSynth = new Tone.PolySynth(
    Tone.Synth,
    bassSynthSettings
  ).connect(bassVolume)

  bassPart = new Tone.Part((time, note) => {
    bassSynth.triggerAttackRelease(
      note.noteName,
      note.duration,
      time,
      note.velocity
    )
  }, bassSynthSequence)

  bassPart.start(0)
  bassPart.loop = true
  bassPart.loopEnd = "89m"

  initBassVolumeControl()
  initBassMuteControl()
}

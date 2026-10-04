import * as Tone from "tone"

import {
  bellSequence
} from "../parts/bellPart.js"

const bellSynthSettings = {
  harmonicity: 3.4,
  modulationIndex: 14,

  oscillator: {
    type: "sine"
  },

  envelope: {
    attack: 0.001,
    decay: 1.6,
    sustain: 0,
    release: 2.8
  },

  modulation: {
    type: "sine"
  },

  modulationEnvelope: {
    attack: 0.001,
    decay: 0.7,
    sustain: 0,
    release: 1.2
  }
}

let bellSynth = null
let bellPart = null
let bellVolume = null
let bellReverb = null
let bellDelay = null

function initBellVolumeControl() {
  const volumeInput = document.querySelector("#bells-volume")

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value)

    if (value === -60) {
      bellVolume.mute = true
      return
    }

    bellVolume.mute = false
    bellVolume.volume.rampTo(value, 0.05)
  })
}

function initBellMuteControl() {
  const muteButton = document.querySelector("#bells-mute")

  muteButton.addEventListener("click", () => {
    bellVolume.mute = !bellVolume.mute

    muteButton.classList.toggle(
      "mute__button--active",
      bellVolume.mute
    )

    muteButton.textContent = bellVolume.mute
      ? "PLAY"
      : "MUTE"
  })
}

export function initBellSynth() {
  if (bellPart) return

  bellVolume = new Tone.Volume(-6).toDestination()

  bellReverb = new Tone.Reverb({
    decay: 3.5,
    wet: 0.35
  }).connect(bellVolume)

  bellDelay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.18,
    wet: 0.12
  }).connect(bellReverb)

  bellSynth = new Tone.FMSynth(
    bellSynthSettings
  ).connect(bellDelay)

  bellPart = new Tone.Part((time, note) => {
    bellSynth.triggerAttackRelease(
      note.noteName,
      note.duration,
      time,
      note.velocity
    )
  }, bellSequence)

  bellPart.start(0)
  bellPart.loop = true
  bellPart.loopEnd = "89m"

  initBellVolumeControl()
  initBellMuteControl()
}
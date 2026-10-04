import * as Tone from "tone"

import {
  leadSynthSequence
} from "../parts/leadPart.js"


const leadSynthSettings = {
  detune: 0,
  portamento: 0.05,

  envelope: {
    attack: 0.05,
    attackCurve: "exponential",
    decay: 0.2,
    decayCurve: "exponential",
    sustain: 0.2,
    release: 1.5,
    releaseCurve: "exponential"
  },

  oscillator: {
    type: "sine"
  }
}

let leadSynth = null
let leadPart = null
let leadVolume = null
let leadFilter = null
let leadReverb = null
let leadDelay = null

function initLeadVolumeControl() {
  const volumeInput = document.querySelector("#lead-volume")

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value)

    if (value === -60) {
      leadVolume.mute = true
      return
    }

    leadVolume.mute = false
    leadVolume.volume.rampTo(value, 0.05)
  })
}

function initLeadMuteControl() {
  const muteButton = document.querySelector("#lead-mute")

  muteButton.addEventListener("click", () => {
    leadVolume.mute = !leadVolume.mute

    muteButton.classList.toggle(
      "mute__button--active",
      leadVolume.mute
    )

    muteButton.textContent = leadVolume.mute
      ? "PLAY"
      : "MUTE"
  })
}

function initLeadOscillatorControl() {
  const oscillatorButtons = document.querySelectorAll(
    "#lead-toggle .toggle"
  )

  oscillatorButtons.forEach(button => {
    button.addEventListener("click", () => {
      const type = button.textContent
        .trim()
        .toLowerCase()

      leadSynth.set({
        oscillator: {
          type: type
        }
      })

      oscillatorButtons.forEach(item => {
        item.classList.remove("toggle--active")
      })

      button.classList.add("toggle--active")
    })
  })
}

function initLeadAttackControl() {
  const attackInput = document.querySelector("#lead-attack")

  attackInput.addEventListener("input", () => {
    const value = Number(attackInput.value)

    leadSynth.set({
      envelope: {
        attack: value
      }
    })
  })
}

function initLeadReleaseControl() {
  const releaseInput = document.querySelector("#lead-release")

  releaseInput.addEventListener("input", () => {
    const value = Number(releaseInput.value)

    leadSynth.set({
      envelope: {
        release: value
      }
    })
  })
}

function initLeadBrightnessControl() {
  const brightnessInput = document.querySelector("#lead-brightness")

  brightnessInput.addEventListener("input", () => {
    const value = Number(brightnessInput.value)

    leadFilter.frequency.rampTo(
      value,
      0.05
    )
  })
}

function initLeadReverbControl() {
  const reverbInput = document.querySelector("#lead-reverb")

  reverbInput.addEventListener("input", () => {
    const value = Number(reverbInput.value)

    leadReverb.wet.rampTo(
      value,
      0.05
    )
  })
}

function initLeadDecayControl() {
  const decayInput = document.querySelector("#lead-decay")

  decayInput.addEventListener("input", () => {
    const value = Number(decayInput.value)

    leadSynth.set({
      envelope: {
        decay: value
      }
    })
  })
}

function initLeadEchoControl() {
  const echoInput = document.querySelector("#lead-echo")

  echoInput.addEventListener("input", () => {
    const value = Number(echoInput.value)

    leadDelay.wet.rampTo(
      value,
      0.05
    )
  })
}


function initLeadSynth() {
  if (leadPart) return

  leadVolume = new Tone.Volume(-6).toDestination()

  leadReverb = new Tone.Reverb({
    decay: 3,
    wet: 0.2
  }).connect(leadVolume)

  leadDelay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.25,
    wet: 0.1
  }).connect(leadReverb)

  leadFilter = new Tone.Filter({
    frequency: 8000,
    type: "lowpass",
    rolloff: -12
  }).connect(leadDelay)

  leadSynth = new Tone.PolySynth(
    Tone.Synth,
    leadSynthSettings
  ).connect(leadFilter)

  leadPart = new Tone.Part((time, note) => {
    leadSynth.triggerAttackRelease(
      note.noteName,
      note.duration,
      time,
      note.velocity
    )
  }, leadSynthSequence)

  leadPart.start(0)
  leadPart.loop = true
  leadPart.loopEnd = "89m"

  initLeadVolumeControl()
  initLeadMuteControl()
  initLeadOscillatorControl()
  initLeadAttackControl()
  initLeadReleaseControl()
  initLeadBrightnessControl()
  initLeadReverbControl()
  initLeadDecayControl()
  initLeadEchoControl()
}

export {
  initLeadSynth
}
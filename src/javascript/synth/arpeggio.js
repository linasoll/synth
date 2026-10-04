import * as Tone from "tone"

import {
  arpeggioSynthSequence
} from "../parts/arpeggioPart.js"

const arpeggioSynthSettings = {
  oscillator: {
    type: "sine"
  },

  envelope: {
    attack: 0.01,
    decay: 1.8,
    sustain: 0.15,
    release: 2.8
  }
}

let arpeggioSynth = null
let arpeggioPart = null
let arpeggioVolume = null
let arpeggioFilter = null
let arpeggioReverb = null
let arpeggioDelay = null

function initArpeggioVolumeControl() {
  const volumeInput = document.querySelector("#arp-volume")

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value)

    if (value === -60) {
      arpeggioVolume.mute = true
      return
    }

    arpeggioVolume.mute = false
    arpeggioVolume.volume.rampTo(value, 0.05)
  })
}

function initArpeggioMuteControl() {
  const muteButton = document.querySelector("#arp-mute")

  muteButton.addEventListener("click", () => {
    arpeggioVolume.mute = !arpeggioVolume.mute

    muteButton.classList.toggle(
      "mute__button--active",
      arpeggioVolume.mute
    )

    muteButton.textContent = arpeggioVolume.mute
      ? "PLAY"
      : "MUTE"
  })
}

function initArpeggioOscillatorControl() {
  const oscillatorButtons = document.querySelectorAll(
    "#arp-toggle .toggle"
  )

  oscillatorButtons.forEach(button => {
    button.addEventListener("click", () => {
      const type = button.textContent
        .trim()
        .toLowerCase()

      arpeggioSynth.set({
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

function initArpeggioAttackControl() {
  const attackInput = document.querySelector("#arp-attack")

  attackInput.addEventListener("input", () => {
    const value = Number(attackInput.value)

    arpeggioSynth.set({
      envelope: {
        attack: value
      }
    })
  })
}

function initArpeggioReleaseControl() {
  const releaseInput = document.querySelector("#arp-release")

  releaseInput.addEventListener("input", () => {
    const value = Number(releaseInput.value)

    arpeggioSynth.set({
      envelope: {
        release: value
      }
    })
  })
}

function initArpeggioBrightnessControl() {
  const brightnessInput = document.querySelector("#arp-brightness")

  brightnessInput.addEventListener("input", () => {
    const value = Number(brightnessInput.value)

    arpeggioFilter.frequency.rampTo(
      value,
      0.05
    )
  })
}

function initArpeggioReverbControl() {
  const reverbInput = document.querySelector("#arp-reverb")

  reverbInput.addEventListener("input", () => {
    const value = Number(reverbInput.value)

    arpeggioReverb.wet.rampTo(
      value,
      0.05
    )
  })
}

function initArpeggioDecayControl() {
  const decayInput = document.querySelector("#arp-decay")

  decayInput.addEventListener("input", () => {
    const value = Number(decayInput.value)

    arpeggioSynth.set({
      envelope: {
        decay: value
      }
    })
  })
}

function initArpeggioEchoControl() {
  const echoInput = document.querySelector("#arp-echo")

  echoInput.addEventListener("input", () => {
    const value = Number(echoInput.value)

    arpeggioDelay.wet.rampTo(
      value,
      0.05
    )
  })
}

export function initArpeggioSynth() {
  if (arpeggioPart) return

  arpeggioVolume = new Tone.Volume(-6).toDestination()

    arpeggioReverb = new Tone.Reverb({
    decay: 3,
    wet: 0.2
  }).connect(arpeggioVolume)

  arpeggioDelay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.25,
    wet: 0.1
  }).connect(arpeggioReverb)

  arpeggioFilter = new Tone.Filter({
    frequency: 8000,
    type: "lowpass",
    rolloff: -12
  }).connect(arpeggioDelay)

  arpeggioSynth = new Tone.PolySynth(
    Tone.Synth,
    arpeggioSynthSettings
  ).connect(arpeggioFilter)

  arpeggioPart = new Tone.Part((time, note) => {
    arpeggioSynth.triggerAttackRelease(
      note.noteName,
      note.duration,
      time,
      note.velocity
    )
  }, arpeggioSynthSequence)

  arpeggioPart.start(0)
  arpeggioPart.loop = true
  arpeggioPart.loopEnd = "89m"

  initArpeggioVolumeControl()
  initArpeggioMuteControl()
  initArpeggioOscillatorControl()
  initArpeggioAttackControl()
  initArpeggioReleaseControl()
  initArpeggioBrightnessControl()
  initArpeggioReverbControl()
  initArpeggioDecayControl()
  initArpeggioEchoControl()
}
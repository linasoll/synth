import * as Tone from "tone"

import {
  initLeadSynth
} from "./javascript/synth/lead.js"

import {
  initArpeggioSynth
} from "./javascript/synth/arpeggio.js"

import {
  initBassSynth
} from "./javascript/synth/bass.js"

import {
  initBellSynth
} from "./javascript/synth/bells.js"

import {
  initDrum
} from "./javascript/synth/drums.js"

import {
  initHiHat
} from "./javascript/synth/hihats.js"

import {
  initLamps,
  stopLamps,
  setPlayingState,
  setPausedState,
  setStoppedState
} from "./javascript/ui.js"


const playButton = document.querySelector("#play")
const pauseButton = document.querySelector("#pause")
const stopButton = document.querySelector("#stop")

let initialized = false

playButton.addEventListener("click", async () => {
  await Tone.start()

  if (!initialized) {
    initLeadSynth()
    initArpeggioSynth()
    initBassSynth()
    initBellSynth()
    initDrum()
    initHiHat()
    initLamps()

    const transport = Tone.getTransport()

    transport.bpm.value = 120
    transport.loop = true
    transport.loopStart = "0:0:0"
    transport.loopEnd = "89:0:0"

    initialized = true
  }

  await Tone.loaded()

  Tone.getTransport().start()

  setPlayingState()
})

pauseButton.addEventListener("click", () => {
  Tone.getTransport().pause()

  stopLamps()
  setPausedState()
})


stopButton.addEventListener("click", () => {
  const transport = Tone.getTransport()

  transport.stop()
  transport.position = "0:0:0"

  stopLamps()
  setStoppedState()
})
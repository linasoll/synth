import * as Tone from "tone"

import {
  drumSequence
} from "../parts/drumPart.js"

let drumSampler = null
let drumPart = null
let drumVolume = null

function initDrumVolumeControl() {
  const volumeInput = document.querySelector("#drums-volume")

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value)

    if (value === -60) {
      drumVolume.mute = true
      return
    }

    drumVolume.mute = false
    drumVolume.volume.rampTo(value, 0.05)
  })
}

function initDrumMuteControl() {
  const muteButton = document.querySelector("#drums-mute")

  muteButton.addEventListener("click", () => {
    drumVolume.mute = !drumVolume.mute

    muteButton.classList.toggle(
      "mute__button--active",
      drumVolume.mute
    )

    muteButton.textContent = drumVolume.mute
      ? "PLAY"
      : "MUTE"
  })
}

export function initDrum() {
  if (drumPart) return

  drumVolume = new Tone.Volume(-6).toDestination()

  drumSampler = new Tone.Sampler({
    urls: {
      C2: "BD5000.WAV"
    },
    baseUrl: "./samples/"
  }).connect(drumVolume)

  drumPart = new Tone.Part((time, note) => {
    drumSampler.triggerAttackRelease(
      note.noteName,
      note.duration,
      time,
      note.velocity
    )
  }, drumSequence)

  drumPart.start(0)
  drumPart.loop = true
  drumPart.loopEnd = "1m"

  initDrumVolumeControl()
  initDrumMuteControl()
}
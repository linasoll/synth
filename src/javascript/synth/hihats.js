import * as Tone from "tone"

import {
  hiHatSequence
} from "../parts/hihatPart.js"

let hiHatSampler = null
let hiHatPart = null
let hiHatVolume = null

function initHiHatVolumeControl() {
  const volumeInput = document.querySelector("#hi-hats-volume")

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value)

    if (value === -60) {
      hiHatVolume.mute = true
      return
    }

    hiHatVolume.mute = false
    hiHatVolume.volume.rampTo(value, 0.05)
  })
}

function initHiHatMuteControl() {
  const muteButton = document.querySelector("#hi-hats-mute")

  muteButton.addEventListener("click", () => {
    hiHatVolume.mute = !hiHatVolume.mute

    muteButton.classList.toggle(
      "mute__button--active",
      hiHatVolume.mute
    )

    muteButton.textContent = hiHatVolume.mute
      ? "PLAY"
      : "MUTE"
  })
}

export function initHiHat() {
  if (hiHatPart) return

  hiHatVolume = new Tone.Volume(-6).toDestination()

  hiHatSampler = new Tone.Sampler({
    urls: {
      D2: "MA.WAV"
    },
    baseUrl: "./samples/"
  }).connect(hiHatVolume)

  hiHatPart = new Tone.Part((time, note) => {
    hiHatSampler.triggerAttackRelease(
      note.noteName,
      note.duration,
      time,
      note.velocity
    )
  }, hiHatSequence)

  hiHatPart.start(0)
  hiHatPart.loop = true
  hiHatPart.loopEnd = "1m"

  initHiHatVolumeControl()
  initHiHatMuteControl()
}
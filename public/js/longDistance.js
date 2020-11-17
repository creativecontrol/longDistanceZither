class LongDistance {
  constructor () {
    console.log("loaded long distance");

    this.activateMidiAction = document.getElementById("activateMidi");
    this.midiInitButton = document.getElementById("midiInactive");
    this.midiUI = document.getElementById("midiActive");
    this.inputMenu = document.getElementById("midiInSelect");
    this.outputMenu = document.getElementById("midiOutSelect");
    this.currentInput = null;
    this.curretOutput = null;

    this.setListeners();
  }

  setListeners () {
    let that = this;

    this.activateMidiAction.onclick = ()=> {
      that.midiInitButton.style.visibility = "hidden";
      that.midiUI.style.visibility = "visible";
      Tone.context.resume();
      that.initMidi();
    }

    this.inputMenu.onchange = (midi)=> {
        that.currentInput = WebMidi.getInputById(midi.id);
    };
    this.outputMenu.onchange = (midi)=> {
      that.currentOutput = WebMidi.getOutputById(midi.id);
    }

  }

  initMidi () {
    let that = this;

    WebMidi.enable(function (err) {
      if (err) {
      console.log("WebMidi could not be enabled.", err);
      return;
    } else {
      console.log("WebMidi enabled!");
    }

    // Reacting when a new device becomes available
    WebMidi.addListener("connected", function(e) {
      console.log(e);
    });

    // Reacting when a device becomes unavailable
    WebMidi.addListener("disconnected", function(e) {
      console.log(e);
    });

    WebMidi.inputs.forEach(input => {
      let option = document.createElement("option");
      option.value = input.id;
      option.textContent = 'MIDI: ' + input.name;
      that.inputMenu.appendChild(option);

    });

    WebMidi.outputs.forEach(output => {
      let option = document.createElement("option");
      option.value = output.id;
      option.textContent = 'MIDI: ' + output.name;
      that.outputMenu.appendChild(option);

    });

    });

    // midiInput.addListener('noteon', "all", function(evt) {
    //   console.log("Pitch value: " + evt.value);
    //   // scheduleDelay(delay, evt);
    // });

  }

}

window.onload = ()=> {
  window.app = new LongDistance();
}

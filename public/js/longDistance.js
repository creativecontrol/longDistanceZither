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

    this.pitchMap = [60,62,64,65,67,69,71,72,74,76,77,79,81];

    this.instrumentSelectAction = document.getElementById('whichZither');
    this.ON = 1;
    this.OFF = 0;

    this.database;
    this.instrument = document.getElementById('whichZither').value;

    firebase.auth().signInAnonymously()
      .then(() => {
        this.connectToDatabase();
        this.setListeners();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      })
  }

  setListeners () {
    let that = this;

    this.activateMidiAction.onclick = () => {
      that.midiInitButton.style.visibility = "hidden";
      that.midiUI.style.visibility = "visible";
      Tone.context.resume();
      that.initMidi();
    }

    // Think about making this an initial login state or based on URL to avoid unknown states
    this.instrumentSelectAction.onchange = () => {
      this.instrument = document.getElementById('whichZither').value;
      console.log(this.instrument + ' selected');
    }

    this.inputMenu.onchange = () => {
        if (that.currentInput) {
          that.currentInput.removeListener();
        }
        try {
          that.currentInput = WebMidi.getInputById(that.inputMenu.value);
          console.log(that.currentInput);

          that.currentInput.addListener('noteon', 'all', (midiEvent) => {
            console.log ("NOTE ON");
            console.log("midi number: " + midiEvent.note.number);
            console.log("midi velocity: " + midiEvent.velocity);
            let key = that.pitchMap.indexOf(midiEvent.note.number);
            console.log("key: " + key);
            that.database.ref(this.instrument + '/' + key.toString()).set(that.ON);
          });

          that.currentInput.addListener('noteoff', 'all', (midiEvent) => {
            console.log ("NOTE OFF");
            console.log("midi number: " + midiEvent.note.number);
            console.log("midi velocity: " + midiEvent.velocity);
            let key = that.pitchMap.indexOf(midiEvent.note.number);
            console.log("key: " + key);
            that.database.ref(this.instrument + '/' + key.toString()).set(that.OFF);
          });


        } catch (error) {
          console.error(error);
        }
    };
    this.outputMenu.onchange = ()=> {
      that.currentOutput = WebMidi.getOutputById(that.outputMenu.value);
      console.log(that.currentOutput);
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
      // Will need to update to check if input already exists
      WebMidi.addListener("connected", function(e) {
        // that.fillInputs();
        // that.fillOutputs();
      });

      // Reacting when a device becomes unavailable
      WebMidi.addListener("disconnected", function(e) {
        // that.fillInputs();
        // that.fillOutputs();
      });

      that.fillInputs();
      that.fillOutputs();
    });

  }

  fillInputs() {
    let that = this;

    WebMidi.inputs.forEach(input => {
      let option = document.createElement("option");
      option.value = input.id;
      option.textContent = 'MIDI: ' + input.name;
      that.inputMenu.appendChild(option);
    });

    // if (that.currentInput) {
    //   that.inputMenu.value = that.currentInput;
    // }
  }

  fillOutputs() {
    let that = this;

    WebMidi.outputs.forEach(output => {
      let option = document.createElement("option");
      option.value = output.id;
      option.textContent = 'MIDI: ' + output.name;
      that.outputMenu.appendChild(option);
    });

    // if (that.currentOutput) {
    //   that.outputMenu.value = that.currentOutput;
    // }
  }

  connectToDatabase() {
    this.database = firebase.database();
  }
}

window.onload = ()=> {
  window.app = new LongDistance();
}

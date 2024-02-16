/**
 * @auhtor faniry
 * @def  
 * RecorderAudio s'occupe des enregistrement vocal des avis des partisans
 * ne jamais me modifié si tu es un bon dev tu sais qu'il faut m'ettendre
 */
class RecorderAudio {
  #recorder;
  #canvas;
  #soundClips;
  #stop;
  mediaRecorder = null;
  #from = "";
  #detailsCoord = null;
  note = 0;
  showNoteGlobaleOnMarker = null;
  createShowAvisAreas = null;
  isUpdate = false;
  avisId = 0;
  constructor(
    record,
    canvas,
    stop,
    soundClips,
    detailsCoord,
    note,
    isUpdate,
    avisId,
    showNoteGlobaleOnMarker,
    createShowAvisAreas
  ) {
    this.#recorder = record;
    this.#canvas = canvas;
    this.#soundClips = soundClips;
    this.#stop = stop;
    this.#detailsCoord = detailsCoord;

    this.showNoteGlobaleOnMarker = showNoteGlobaleOnMarker
      ? showNoteGlobaleOnMarker
      : null;

    this.createShowAvisAreas = createShowAvisAreas;
    this.note = note;
    this.isUpdate = isUpdate;
    this.avisId = avisId;

    this.minute = 0;
    this.second = 0;
    this.count = 0;
    this.start = true;
  }

  initialize() {
    this.#setFrom();
    this.audioCtx = null;
    this.#stop.disabled = true;
    this.canvasCtx = this.#canvas.getContext("2d");
    this.canIUseMediaRecorder = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("The mediaDevices.getUserMedia() method is supported.");

      this.contraints = { audio: true };
      this.canIUseMediaRecorder = true;
      this.chunks = [];
    }
  }

  #setFrom() {
    const url = new URL(window.location.href.toString());

    if (url.pathname.includes("restaurant")) {
      this.#from = "resto";
    } else if (url.pathname.includes("golf")) {
      this.#from = "golf";
    }else if(url.pathname.includes("/user/account")){
        
        if(document.getElementById("fetch_resto_tribug_jheo_js").classList.contains("active"))
          this.#from="resto" 
        else if(document.getElementById("fetch_golf_tribug_jheo_js").classList.contains("active")){
          this.#from="golf" 
        }
    }else {
      this.#from = this.#detailsCoord.getAttribute("data-toggle-type");
    }
    // alert(this.#from)
  }

  play() {
    if (this.canIUseMediaRecorder) {
      navigator.mediaDevices
        .getUserMedia(this.contraints)
        .then((stream) => {
          console.log(stream);

          this.mediaRecorder = new MediaRecorder(stream);
          this.onSuccess(stream);
        })
        .catch((error) => {
          this.onFailure(error);
        });
    }
  }
  onSuccess(stream) {
    if (!this.mediaRecorder) this.mediaRecorder = new MediaRecorder(stream);
    this.visualize(stream);
    this.stratRecording();
    this.stopRecording();
    this.mediaRecorderOnStop();
    this.onDataAvailabe();
  }

  stratRecording() {
    this.#recorder.onclick = () => {
      this.mediaRecorder.start();
      if (!this.start) this.start = true;
      this.addStopWatch();
      this.#recorder.classList.add("btn-danger");
      this.#stop.disabled = false;
      this.#recorder.disabled = true;
    };
  }

  stopRecording() {
    this.#stop.onclick = () => {
      this.mediaRecorder.stop();
      this.stopStopWatch();
      this.#recorder.style.background = "";
      this.#recorder.style.color = "";
      this.#stop.disabled = true;
      this.#recorder.disabled = false;
    };
  }

  mediaRecorderOnStop() {
    this.mediaRecorder.onstop = (e) => {
      const blob = new Blob(this.chunks, { type: this.mediaRecorder.type });

      this.renderLecteurAudio(blob);

      this.chunks = [];
      this.saveClip.onclick = () => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        fileReader.onloadend = () => {
          //save data
          this.changeButonSaveClipSkin()
          let base64data = fileReader.result;
          if (this.isUpdate) {
            this.updateAudioRecorder(base64data);
          } else {
            this.saveAudioRecorder(base64data);
          }
        };
      };

      this.deleteClip.onclick = (e) => {
        e.target.closest(".clip").remove();
      };
    };
  }

  updateAudioRecorder(base64data) {
    let path = "";
    this.idItem = 0;
    if (this.#from == "resto") {
      this.idItem = this.#detailsCoord.getAttribute("data-toggle-id-resto");
      path = `/change/restaurant/${this.idItem}`;
    } else if (this.#from == "golf") {
      this.idItem = this.#detailsCoord.getAttribute("data-toggle-id-golf");
      path = `/change/golf/${this.idItem}`;
    }

    const requestBody = {
      avisID: this.avisId,
      note: parseFloat(this.note),
      avis: base64data,
      type: "audio_up",
    };

    const request = new Request(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    document.querySelector(".title_modal_jheo_js").innerHTML =
            "Donnée votre avis.";
    document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvis()");
    fetch(request).then((response) => {
      if (response.ok) {
        response.json().then((responses) => {
          //todo rendre à l'ecran le modal d'avis
          this.renderAvisListAfterSendAvisAudio();
          this.showMemberOfAvis();
          this.showNoteGlobal();

          const state = responses.state;

          let total_note = 0;
          state.forEach((item) => {
            total_note += parseFloat(item.note);
          });

          if (
            !window.location.href.includes("/user/tribu/my-tribu-t") ||
            !window.location.href.includes("/user/account")
          ) {
            if (this.showNoteGlobaleOnMarker)
              this.showNoteGlobaleOnMarker(
                this.idItem,
                total_note / state.length,
                this.#from
              );
          }
          
          this.reinitializeInterface();
        });
      }
    });
  }

  saveAudioRecorder(base64data) {
    let path = "";
    this.idItem = 0;
    if (this.#from == "resto") {
      this.idItem = this.#detailsCoord.getAttribute("data-toggle-id-resto");
      path = `/avis/restaurant/${this.idItem}`;
    } else if (this.#from == "golf") {
      this.idItem = this.#detailsCoord.getAttribute("data-toggle-id-golf");
      path = `/avis/golf/${this.idItem}`;
    }

    const requestParam = {
      note: parseFloat(this.note),
      avis: base64data,
      type: "audio",
    };
    const request = new Request(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestParam),
    });
    fetch(request).then((response) => {
      if (response.ok) {
        response.json().then((response) => {
          //todo rendre à l'ecran le modal d'avis
          this.renderAvisListAfterSendAvisAudio();
          this.showMemberOfAvis();
          this.showNoteGlobal();

          const state = response.state;

          let total_note = 0;
          state.forEach((item) => {
            total_note += parseFloat(item.note);
          });

          if (
            !window.location.href.includes("/user/tribu/my-tribu-t") ||
            !window.location.href.includes("/user/account")
          ) {
            if (this.showNoteGlobaleOnMarker)
              this.showNoteGlobaleOnMarker(
                this.idItem,
                total_note / state.length,
                this.#from
              );
          }

          this.reinitializeInterface();
        });
      }
    });
  }

  onDataAvailabe() {
    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
  }

  onFailure(error) {
    new swal({
      title: "erreur",
      text: "on a eu l'erreur suivante " + error,
      icon: "error",
      button: "ok",
    });
  }
  visualize(stream) {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    const source = this.audioCtx.createMediaStreamSource(stream);
    this.analyzer = this.audioCtx.createAnalyser();
    this.analyzer.fftSize = 2048;
    this.bufferLength = this.analyzer.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    source.connect(this.analyzer);
    this.draw();
  }

  renderLecteurAudio(blob) {
    this.clipContainer = document.createElement("article");
    const clipLabel = document.createElement("p");
    const audio = document.createElement("audio");
    this.deleteClip = document.createElement("button");
    this.saveClip = document.createElement("button");

    this.clipContainer.classList.add("clip");
    this.clipContainer.classList.add("clips_faniry_js");

    audio.setAttribute("controls", "");
    audio.classList.add("mt-3");

    this.deleteClip.textContent = "Supprimer";
    this.deleteClip.className = "delete";
    this.deleteClip.classList.add("btn");
    this.deleteClip.classList.add("btn-danger");
    this.deleteClip.type = "button";

    this.saveClip.textContent = "Enregistrer";
    this.saveClip.className = "save";
    this.saveClip.classList.add("btn");
    this.saveClip.classList.add("btn-primary");
    this.saveClip.type = "button";

    clipLabel.textContent = "Avis audios";

    this.clipContainer.appendChild(audio);
    this.clipContainer.appendChild(this.saveClip);
    this.clipContainer.appendChild(this.deleteClip);

    this.#soundClips.appendChild(this.clipContainer);

    audio.controls = true;
    audio.src = window.URL.createObjectURL(blob);
  }

  draw() {
    const WIDTH = this.#canvas.width;
    const HEIGHT = this.#canvas.height;

    requestAnimationFrame(() => this.draw());

    // this.analyzer.getByteTimeDomainData(this.dataArray);
    this.analyzer.getByteFrequencyData(this.dataArray);

    this.canvasCtx.fillStyle = "rgb(200, 200, 200)";
    this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    this.canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / this.bufferLength;
    let x = 0;
    const barWidth = ((WIDTH * 1.0) / this.bufferLength) * 2.5;
    let barHeight;

    for (let i = 0; i < this.bufferLength; i++) {
      // let v = this.dataArray[i] / 128.0;
      // let y = (v * HEIGHT) / 2;

      // if (i === 0) {
      //   this.canvasCtx.moveTo(x, y);
      // } else {
      //   this.canvasCtx.lineTo(x, y);
      // }

      // x += sliceWidth;

      barHeight = this.dataArray[i] / 2;

      this.canvasCtx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
      this.canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }

    this.canvasCtx.lineTo(this.#canvas.width, this.#canvas.height / 2);
    this.canvasCtx.stroke();
  }

  addStopWatch() {
    if (this.start) {
      this.count++;

      if (this.count == 100) {
        this.second++;
        this.count = 0;
      }

      if (this.second == 60) {
        this.minute++;
        this.seconde = 0;
      }

      if (this.minute == 60) {
        this.minute = 0;
        this.second = 0;
      }

      let minString = this.minute;
      let secString = this.second;
      let countString = this.count;

      if (this.minute < 10) {
        minString = "0" + minString;
      }

      if (this.second < 10) {
        secString = "0" + secString;
      }

      if (this.count < 10) {
        countString = "0" + countString;
      }

      document.getElementById("min").innerHTML = minString;
      document.getElementById("sec").innerHTML = secString;
      document.getElementById("count").innerHTML = countString;

      this.timeoutStopWatch = setTimeout(() => {
        this.addStopWatch();
      }, 10);
    }
  }

  stopStopWatch() {
    this.start = false;

    this.minute = 0;
    this.second = 0;
    this.count = 0;

    document.getElementById("min").innerHTML = "00";
    document.getElementById("sec").innerHTML = "00";
    document.getElementById("count").innerHTML = "00";
  }

  renderAvisListAfterSendAvisAudio() {
    //  let details=this.#detailsCoord ?
    //     this.#detailsCoord.querySelector("#details-coord") :
    //     document.querySelector(`.item_carrousel_${this.idItem}_jheo_js`);
    let path = "";
    if (this.#from == "resto") {
      path = `/avis/restaurant/global/${this.idItem}`;
    } else if (this.#from == "golf") {
      path = `/avis/golf/global/${this.idItem}`;
    }

    fetch(path).then((r) => {
      if (r.status == 200 && r.ok) {
        r.json().then((responses) => {
          const jsons = responses.data;
          const user = responses.currentUser;
          if (jsons) {
            //// before show all comments, delete the content.
            document.querySelector(".all_avis_jheo_js").innerHTML = "";
            // if (screen.width <= 991) {
            //     document.querySelector(`.all_avis_${idItem}_jheo_js`).innerHTML = "";
            // } else {
            // }
            document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
            for (let json of jsons) {
              //// create single avis, and pass state of currect id

              this.createShowAvisAreas(json, user.id, this.idItem);
            }
          }
        });
      }
    });
  }

  showMemberOfAvis() {
    let parent = null;
    let haveParent =
      document.querySelector("#see-tom-js") ||
      document.querySelector(`#see-tom-js${this.idItem}`);
    if (haveParent)
      parent = document.querySelector("#see-tom-js")
        ? document.querySelector("#see-tom-js")
        : document.querySelector(`#see-tom-js${idItem}`);
    let path = "";
    if (this.#from == "resto") {
      path = `/nombre/avis/restaurant/${this.idItem}`;
    } else if (this.#from == "golf") {
      path = `/nombre/avis/golf/${this.idItem}`;
    }

    fetch(path).then((r) => {
      if (r.status == 200 && r.ok)
        r.json().then((json) => {
          const nombreAvis = json["nombre_avis"];
          if (parent) parent.innerHTML = nombreAvis + " avis";
        });
    });
  }

  showNoteGlobal() {
    let path = "";
    if (this.#from == "resto") {
      path = `/avis/restaurant/global/${this.idItem}`;
    } else if (this.#from == "golf") {
      path = `/avis/golf/global/${this.idItem}`;
    }
    fetch(path, {
      methode: "GET",
    }).then((r) => {
      if (r.status == 200 && r.ok) {
        r.json().then((responses) => {
          const jsons = responses.data;
          const user = responses.currentUser;

          let globalNote = 0.0;
          let totalNote = 0.0;
          if (jsons.length > 0) {
            for (let avis of jsons) {
              totalNote += parseFloat(avis["note"]);
            }
            globalNote = totalNote / jsons.length;
            this.#createGlobalNote(globalNote, this.idItem);
          }
        });
      }
    });
  }

  #createGlobalNote(globalNote, idItem = null) {
    // console.log(document.querySelector(`.start_${idItem}_jheo_js`));
    let startHTML = "";
    let rate = globalNote - Math.trunc(globalNote);
    let rateYellow = rate * 100;
    let rateBlack = 100 - rateYellow;
    for (let i = 0; i < 4; i++) {
      if (i < Math.trunc(globalNote)) {
        startHTML += `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`;
      } else {
        if (rate != 0) {
          startHTML += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`;
          rate = 0;
        } else {
          startHTML += `<i class="fa-solid fa-star" data-rank="1"></i>`;
        }
      }
    }
    if (document.querySelector(`.start_jheo_js${idItem}`)) {
      document.querySelector(`.start_jheo_js${idItem}`).innerHTML = startHTML;
    } else if (document.querySelector(".start_jheo_js")) {
      document.querySelector(".start_jheo_js").innerHTML = startHTML;
    }

    if (document.querySelector(`.start_${idItem}_jheo_js`)) {
      document.querySelector(`.start_${idItem}_jheo_js`).innerHTML = startHTML;
    }
  }

  reinitializeInterface() {
    if (this.clipContainer) {
      this.clipContainer.innerHTML = "";
    }
  }

  changeButonSaveClipSkin(){
    this.saveClip.innerHTML = "Envoies en cours ...";
    this.saveClip.disabled=true;
  }

  resetButonSaveClipSkin(){
    this.saveClip.innerHTML = "Enregistrer";
    this.saveClip.disabled=false;
  }
}

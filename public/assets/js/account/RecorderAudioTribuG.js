class RecorderAudioTribug extends RecorderAudio {
  #recorder;
  #canvas;
  #soundClips;
  #stop;
  mediaRecorder = null;
  #from = "";
  #detailsCoord = null;
  note = 0;
  isUpdate = false;
  avisId = 0;
  showListInTribuT=null;
  openAvisRestoG=null;
  openAvisGolfG=null;
  fetchListAvisInTribuT=null;
  updateViewState=null;
  constructor(
    record,
    canvas,
    stop,
    soundClips,
    detailsCoord,
    note,
    isUpdate,
    avisId,
    showListInTribuT,
    openAvisRestoG,
    openAvisGolfG,
    fetchListAvisInTribuT,
    updateViewState
  ) {
    super(record,canvas,stop,soundClips,detailsCoord,note,isUpdate,avisId);
    this.#recorder = record;
    this.#canvas = canvas;
    this.#soundClips = soundClips;
    this.#stop = stop;
    this.#detailsCoord = detailsCoord;
    this.showListInTribuT = showListInTribuT;
    this.openAvisRestoG = openAvisRestoG;
    this.openAvisGolfG = openAvisGolfG;
    this.fetchListAvisInTribuT=fetchListAvisInTribuT;
    this.updateViewState = updateViewState;

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

    if(url.pathname.includes("/user/account") ){
        
        if(document.getElementById("fetch_resto_tribug_jheo_js").classList.contains("active"))
          this.#from="resto" 
        else if(document.getElementById("fetch_golf_tribug_jheo_js").classList.contains("active")){
          this.#from="golf" 
        }
    }
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
  /**
   * @override
   * @param {@over} stream 
   */
  onSuccess(stream) {
    if (!this.mediaRecorder) this.mediaRecorder = new MediaRecorder(stream);
    this.visualize(stream);
    this.stratRecording();
    this.stopRecording();
    this.mediaRecorderOnStop();
    this.onDataAvailabe();
  }

  /**
   * @override
   * enregistrer les avis 
   */
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

  /**
   * @override
   * @param {*} base64data 
   */
  updateAudioRecorder(base64data) {
    let path = "";
    this.idItem = 0;
    if (this.#from == "resto") {
      this.idItem =parseInt((this.#detailsCoord.getAttribute("onclick").replace(/[^0-9,]/g,"")).
                    split(",")[1],10);
      path = `/change/restaurant/${this.idItem}`;
    } else if (this.#from == "golf") {
      this.idItem = parseInt((this.#detailsCoord.getAttribute("onclick").replace(/[^0-9,]/g,"")).
                    split(",")[1],10);
      path = `/change/golf/${this.idItem}`;
    }
    console.log(this.avisId,this.#from,this.idItem)
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
    document.querySelector(".title_modal_jheo_js").innerHTML ="Donnée votre avis.";
    document.querySelector(".send_avis_jheo_js").setAttribute("onclick", `addAvisInTribuT('${this.idItem}', '${this.#from}')`);
    fetch(request).then((response) => {
      if (response.ok) {
        response.json().then((responses) => {
          const new_state = responses.state;
          ///show list
			    this.fetchListAvisInTribuT(this.idItem, this.#from);

          ///update current state
          this.updateViewState(new_state, this.idItem);

          $("#staticBackdrop").modal("show");
          $("#modalMicroOption").modal("hide");
          this.showListInTribuT(this.idItem, this.#from);

          if (this.#from == "resto") {
            this.openAvisRestoG(new_state.length, this.idItem);

            document.querySelector("#fetch_resto_tribug_jheo_js").click();
          }
          if (this.#from == "golf") {
            this.openAvisGolfG(new_state.length, this.idItem);

            document.querySelector("#fetch_golf_tribug_jheo_js").click();
          }
        
          this.reinitializeInterface();
        });
      }
    });
  }

  /**
   * @override
   * @param {*} base64data 
   */
  saveAudioRecorder(base64data) {
    let path = "";
    this.idItem = 0;
    if (this.#from == "resto") {
      this.idItem =parseInt((this.#detailsCoord.getAttribute("onclick").replace(/[^0-9]/g,"")));
      path = `/avis/restaurant/${this.idItem}`;
    } else if (this.#from == "golf") {
      this.idItem = parseInt((this.#detailsCoord.getAttribute("onclick").replace(/[^0-9]/g,"")));
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
          const new_state = response.state;

          $("#staticBackdrop").modal("show");
          $("#modalMicroOption").modal("hide");
          this.showListInTribuT(this.idItem, this.#from);

          if (this.#from == "resto") {
            this.openAvisRestoG(new_state.length, this.idItem);

            document.querySelector("#fetch_resto_tribug_jheo_js").click();
          }
          if (this.#from == "golf") {
            this.openAvisGolfG(new_state.length, this.idItem);

            document.querySelector("#fetch_golf_tribug_jheo_js").click();
			    }

          this.reinitializeInterface();
          
        });
      }
    });
  }

 
}

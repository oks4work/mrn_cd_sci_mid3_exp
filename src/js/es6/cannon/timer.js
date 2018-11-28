class Timer {
  constructor(config, callbacks) {
    this.startTime = 0;
    this.continuousTime = 0;
    this.intervalID = 0;
    this.config = config;
    this.callbacks = callbacks;
  }

  addConfig(config) {
    for (let prop in config) {
      this.config[prop] = config[prop];
    }
  }

  startTimer() {
    let startIndicator = false;
    this.intervalID = window.setInterval(() => {
      if (!startIndicator) {
        this.startTime = new Date().getTime();
        startIndicator = true;
      } // console.log(this.timePassed);


      if (this.callbacks && this.callbacks.interval) {
        this.callbacks.interval();
      }
    });
  }

  pauseTimer() {
    this.continuousTime = this.timePassed;
    window.clearInterval(this.intervalID);
  }

  resetTimer() {
    this.continuousTime = 0;
    window.clearInterval(this.intervalID);
  } // 지난 시간


  get timePassed() {
    return this.continuousTime + (new Date().getTime() - this.startTime) * this.config.playbackSpeed;
  }

}
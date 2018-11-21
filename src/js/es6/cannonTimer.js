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
        this.startTime = new Date().getTime();
        this.intervalID = window.setInterval(() => {
            // console.log(this.timePassed);

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
    }

    // 지난 시간
    get timePassed() {
        return this.continuousTime + (new Date().getTime() - this.startTime) * this.config.playbackSpeed;
    }

    // 속도
    // get velocity() { // 속도 = 중력가속도 * 시간
    //     return (this.config.graAcc * 10) * this.timePassed / (this.config.timeToVeConst * 10);
    // }

    // 거리
    // get distance() { // 거리 = 중력가속도 * 속도의 제곱 / 2
    //     let result = (this.config.graAcc * 10) * Math.pow(this.timePassed / this.config.timeToVeConst, 2) / 20;
    //     result = Math.round(result * 100) / 100;
    //     return result;
    // }
}
(function() {
    class Timer {
        constructor(config) {
            this.startTime = null;
            this.continuousTime = 0;
            this.intervalID = null;
            this.count = 1;
            this.config = config;
        }

        startTimer() {
            this.startTime = new Date().getTime();
            this.intervalID = window.setInterval(() => {
                dropCanvasInfo.objectPos.y = dropCanvasInfo.objectPos.initial.y + this.distance * this.config.meterPixelRatio;

                dropMoves.show();
                dropMoves.move();

                clock.changeAll(this.timePassed);

                if (this.timePassedCorr >= this.config.captureInterval * this.count) {
                    console.log(`t: ${this.timePassedCorr / 1000}s, v: ${this.velocity}m/s, d: ${this.distance}m, playback speed: ${this.config.playbackSpeed}`);

                    drawGraphs(this.count);
                    drawObjects(this.timePassedCorr === this.config.limitTime);

                    this.count++;

                    if (this.timePassedCorr >= this.config.limitTime) {
                        this.pauseTimer();
                        stopBtn.object.on();
                        dropMoves.hide();
                    }
                }
            });
        }

        pauseTimer() {
            window.clearInterval(this.intervalID);
        }

        resetTimer() {
            window.clearInterval(this.intervalID);
            this.startTime = null;
            this.intervalID = null;
            this.count = 1;

            initDropCanvas();
            initGraphCanvases();
            clock.reset();

            dropMoves.move();
        }

        // 지난 시간
        get timePassed() {
            return (new Date().getTime() - this.startTime) * this.config.playbackSpeed;
        }

        // 지난 시간(interval 맞춰서 고정)
        get timePassedCorr() {
            return Math.floor(this.timePassed / this.config.captureInterval) * this.config.captureInterval;
        }

        // 속도
        get velocity() { // 속도 = 중력가속도 * 시간
            return (this.config.graAcc * 10) * this.timePassed / (this.config.timeToVeConst * 10);
        }

        // 거리
        get distance() { // 거리 = 중력가속도 * 속도의 제곱 / 2
            let result = (this.config.graAcc * 10) * Math.pow(this.timePassed / this.config.timeToVeConst, 2) / 20;
                result = Math.round(result * 100) / 100;
            return result;
        }
    }

    window.Timer = Timer;
})();
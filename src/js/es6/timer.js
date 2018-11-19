(function() {
    class Timer {
        constructor() {
            this.startTime = null;
            this.intervalID = null;
            this.count = 1;
        }

        startTimer() {
            this.startTime = new Date().getTime();
            this.intervalID = window.setInterval(() => {
                if (this.timePassed >= 250 * this.count) {
                    console.log(this.timePassed);
                    this.count++;
                }
            });
        }

        resetTimer() {
            window.clearInterval(this.intervalID);
            this.startTime = null;
            this.intervalID = null;
            this.count = 1;
        }

        get timePassed() {
            return new Date().getTime() - this.startTime;
        }
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') { console.log(module);
        module.exports = Timer;
    } else {
        window.Timer = Timer;
    }
})();
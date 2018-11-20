(function() {
    class DigitalClock {
        constructor(elements) {
            this.elements = elements;
        }

        // 개별 요소 바꾸기
        static change(element, value) {
            let array = value.toString().split("");

            if (array.length === 1) {
                element.children[0].innerHTML = 0;
                element.children[1].innerHTML = array[0];
            } else {
                element.children[0].innerHTML = array[0];
                element.children[1].innerHTML = array[1];
            }
        }

        // 전체 요소 바꾸기
        changeAll(time) {
            this.time = time;

            if (this.elements.hour) {
                DigitalClock.change(this.elements.hour, this.hour);
            }
            if (this.elements.min) {
                DigitalClock.change(this.elements.min, this.min);
            }
            if (this.elements.sec) {
                DigitalClock.change(this.elements.sec, this.sec);
            }
            if (this.elements.ms) {
                DigitalClock.change(this.elements.ms, this.ms);
            }
        }

        reset() {
            this.changeAll(0);
        }

        set time(num) {
            this._time = num;
        }
        get time() {
            return this._time;
        }

        get ms() {
            return Math.floor(this._time % 1000 / 10);
        }

        get sec() {
            return Math.floor(this.time / 1000) % 60;
        }

        get min() {
            return Math.floor(this.time / 1000 * 60) % 60;
        }

        get hour() {
            return Math.floor(this.time / 1000 * 60 * 60) % 24;
        }
    }

    window.DigitalClock = DigitalClock;
})();
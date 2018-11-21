console.info(`□ cannon.js is loading...`);

class CannonTimer extends Timer {
    constructor(config, callbacks) {
        super(config, callbacks);
    }

    resetConfig(values) {
        this.setStartVelocity = values.startVelocity;
        this.setMass = values.mass;
    }

    get velocity() { // 속도 = 처음속도 + 가속도 * 시간
        return (this.config.graAcc * this.timePassed / 1000) - this.config.startVelocity;
    }

    get distance() { // 처음 속도로 이동한 거리 - 가속도로 이동한 거리 (가속도 * 시간의 제곱 / 2)
        let result = (this.config.startVelocity * this.timePassed / 1000) - (this.config.graAcc * Math.pow(this.timePassed / 1000, 2) / 2);
        return - result;
    }

    set setStartVelocity(number) {
        this.config.startVelocity = number;
    }

    set setMass(number) {
        this.config.mass = number;
    }
}

class Ball {
    constructor(element, config) {
        this.element = element;
        this.config = config;
    }

    static transform(element, value) {
        element.style.webkitTransform = value;
        element.style.mozTransform = value;
        element.style.msTransform = value;
        element.style.oTransform = value;
        element.style.transform = value;
    }

    move(distance) {
        Ball.transform(this.element, `translateY(${distance * cannon.config.cannonMeterPixelRatio}px)`);
    }

    reset() {
        Ball.transform(this.element, `translateY(0)`);
    }
}

class Cannon {
    constructor(elements, config) {
        this.elements = elements;
        this.config = config;
        this.inputConnections = [];
        this.playBtn = null;
        this.stopBtn = null;
        this.replayBtn = null;
        this.timer = null;
        this.ball = null;
    }

    initiate() {
        this.initiateEfSound();
        this.initiateBtns();
        this.initiateInputConnections();
        this.initiateTimer();
        this.initiateBall();

        $ts.getEl(".cannonArea")[0].style.height = `${this.config.ratio}px`;
    }

    initiateEfSound() {
        this.efSound = new EffectSound(this.elements.container);

        this.efSound.initiate();
    }

    initiateBtns() {
        this.playBtn = new ClickToggleClass(this.elements.playBtn, "on", {
            click: () => {
                this.efSound.play("media/click.mp3");
            },
            on: () => {
                this.timer.resetConfig({
                    startVelocity: cannon.config.velocity.current,
                    mass: cannon.config.mass.current
                });
                this.timer.startTimer();

                this.stopBtn.off();
                this.replayBtn.off();
            }
        });

        this.stopBtn = new ClickToggleClass(this.elements.stopBtn, "on", {
            click: () => {
                this.efSound.play("media/click.mp3");
            },
            on: () => {
                this.timer.pauseTimer();

                cannon.playBtn.off();
            }
        });

        this.replayBtn = new ClickToggleClass(this.elements.replayBtn, "on", {
            click: () => {
                this.efSound.play("media/click.mp3");
            },
            on: () => {
                this.timer.resetTimer();
                this.ball.move(0);

                cannon.playBtn.off();
                if (!cannon.stopBtn.isOn) {
                    cannon.stopBtn.on();
                }
            }
        });

        this.playBtn.addEvent();
        this.stopBtn.addEvent();
        this.replayBtn.addEvent();
    }


    initiateInputConnections() {
        this.elements.inputPairs.forEach((pair) => {
            let name, inputConn;

            name = pair[0].id.indexOf("velocity") > -1 ? "velocity" : "mass";

            inputConn = new InputConnection(name, pair, {
                initiate(self) {
                    self.inputs.forEach((input) => {
                        input.min = cannon.config[self.name].min;
                        input.max = cannon.config[self.name].max;
                        input.value = cannon.config[self.name].initial;
                    });
                },
                change() {
                    // this : callback 보낸 input tag
                    let value, self;

                    value = parseInt(this.value);
                    self = this.self;

                    // 바뀐 값 config에 입력
                    cannon.config[self.name].current = value;

                    self.inputs.forEach((input) => {
                        // 둘 중 다른 input에 넣기
                        if (this !== input) {
                            input.value = value;
                        }
                    });
                }
            });

            inputConn.initiate();

            this.inputConnections.push(inputConn);
        });
    }

    initiateTimer() {
        this.timer = new CannonTimer(cannon.config.timer, {
            interval: () => {
                if (this.timer.distance >= 0) { // 끝나는 경우
                    this.timer.resetTimer();
                    this.playBtn.off();
                    this.stopBtn.on();
                    this.replayBtn.on();
                }
                this.ball.move(this.timer.distance);
            }
        });

        this.timer.addConfig(cannon.config.constants); // 여러 상수들 입력
        this.timer.addConfig({startVelocity: cannon.config.velocity.current});
        this.timer.addConfig({mass: cannon.config.mass.current});
    }

    initiateBall() {
        this.ball = new Ball(
            $ts.getEl("#cannonball"),
            {
                ratio: this.config.constants.cannonMeterPixelRatio
            }
        );
    }
}

const cannon = new Cannon({
    container: $ts.getEl(".contentsArea")[0],
    playBtn: $ts.getEl(".playBtn")[0],
    stopBtn: $ts.getEl(".stopBtn")[0],
    replayBtn: $ts.getEl(".replayBtn")[0],
    inputPairs: [
        [$ts.getEl("#rangeInput_velocity"), $ts.getEl("#numberInput_velocity")],
        [$ts.getEl("#rangeInput_mass"), $ts.getEl("#numberInput_mass")]
    ],
}, config);

cannon.initiate();

console.info(cannon);
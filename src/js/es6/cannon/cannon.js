console.info(`□ cannon.js is loading...`);

class CannonTimer extends Timer {
    constructor(config, callbacks) {
        super(config, callbacks);
    }

    resetConfig(values) {
        this.setStartVelocity = values.startVelocity;
        this.setMass = values.mass;
    } // 속도 = 처음속도 + 가속도 * 시간


    get velocity() {
        return this.config.startVelocity + this.config.graAcc * this.timePassed / 1000;
    } // 처음 속도로 이동한 거리 + 가속도로 이동한 거리 (가속도 * 시간의 제곱 / 2)


    get distance() {
        return this.config.startVelocity * this.timePassed / 1000 + this.config.graAcc * Math.pow(this.timePassed / 1000, 2) / 2;
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
        this.reset();
    }

    static transform(element, value) {
        element.style.webkitTransform = value;
        element.style.mozTransform = value;
        element.style.msTransform = value;
        element.style.oTransform = value;
        element.style.transform = value;
    }

    move(distance) {
        this.element.style.display = "";
        Ball.transform(this.element, `translateY(${distance * cannon.config.cannonMeterPixelRatio}px)`);
    }

    reset() {
        this.element.style.display = "none";
        Ball.transform(this.element, `translateY(0)`);
    }

}

class CannonLine {
    constructor(config) {
        this.config = config;
        this.area = $ts.getEl(".cannonLineArea")[0];
        this.increaseLine = $ts.getEl("#increaseLine");
        this.descendLine = $ts.getEl("#descendLine");
        this.lines = [this.increaseLine, this.descendLine];
        this.pins = [];
        this.pinCount = 0;
    }

    static clickedHeight(event) {
        let clientY, cannonSize, cannonY, cannonHeight, clickedY, result;

        clientY = event.touches ? event.touches[0].clientY : event.clientY;
        clientY = clientY / cannon.scale.getZoomRate();
        cannonSize = $ts.getSize(cannon.elements.cannonArea);
        cannonY = cannonSize.top;
        cannonHeight = cannonSize.height / cannon.scale.getZoomRate();
        clickedY = clientY - cannonY; // 실제 클릭한 높이 (위에서 아래 => y값)

        result = cannonHeight - clickedY; // 실제 클릭한 높이 (아래에서 위 => 실제)

        result = result / cannon.config.cannonMeterPixelRatio; // 클릭 높이(px) / (px / m) = 실제 높이(m)

        return {
            top: clickedY,
            height: -result // (-) 없애기
        };
    }

    static lineClickHandler() {
        let event, result;
        event = arguments[0];
        result = CannonLine.clickedHeight(event);
        cannon.line.pinDistributor(result);
    }

    static pinClickHandler(e, config) {
        let target = e.target;

        while (target.className) {
            target = target.parentElement;
        }

        cannon.graph.changes({
            height: config.height,
            target: target
        });
    }

    static hidePins() {
        cannon.elements.pinContainer.style.display = "none";
    }

    static showPins() {
        cannon.elements.pinContainer.style.display = "block";
    }

    initiate() {
        this.addEvent();
        this.hideArea();
    }

    addEvent() {
        this.lines.forEach(line => {
            line.addEventListener("click", CannonLine.lineClickHandler);
        });
    }

    hideArea() {
        this.area.style.display = "none";
    }

    showArea() {
        this.area.style.display = "block";
    }

    pinDistributor(config) {
        if (this.pinCount < cannon.config.pin.maxLength) {
            this.pinMaker(config);
        }
    }

    pinMaker(config) {
        let container, pin, circle, text, indicator;
        container = cannon.elements.pinContainer;
        pin = $ts.ce({
            tag: "li",
            parent: container
        });
        pin.style.top = `${config.top - 18}px`;
        circle = $ts.ce({
            tag: "div",
            class: "circle",
            parent: pin
        });
        circle.style.backgroundColor = cannon.config.pin.color[this.pinCount];
        text = $ts.ce({
            tag: "div",
            class: "text",
            parent: pin
        });
        text.innerHTML = cannon.config.pin.text[this.pinCount];
        indicator = $ts.ce({
            tag: "div",
            class: "indicator pin_indicator",
            parent: pin
        });
        pin.indicator = indicator;
        this.pins.push(pin);
        this.pinCount++;
        this.pins.forEach(pin => {
            pin.indicator.classList.remove("indicating");
        });
        window.setTimeout(() => {
            this.pins.forEach(pin => {
                pin.indicator.classList.add("indicating");
            });
        });
        circle.addEventListener("click", e => {
            CannonLine.pinClickHandler(e, config);
        });
        text.addEventListener("click", e => {
            CannonLine.pinClickHandler(e, config);
        });
        indicator.addEventListener("click", e => {
            CannonLine.pinClickHandler(e, config);
        });
    }

    pinDestroyer() {
        this.pins.forEach(pin => {
            pin.parentElement.removeChild(pin);
        });
        this.pins = [];
        this.pinCount = 0;
    }

    hideAll() {
        this.hideArea();
        CannonLine.hidePins();
    }

    showAll() {
        this.showArea();
        CannonLine.showPins();
    }

    reset() {
        this.hideAll();
        this.pinDestroyer();
    }

    change(distance) {
        this.increaseLine.style.height = `${distance * cannon.config.cannonMeterPixelRatio - (41 + 35)}px`;
        this.increaseLine.style.bottom = `${35}px`;

        if (cannon.timer.velocity >= 0) {
            this.descendLine.style.top = `${1}px`;
            this.descendLine.style.height = `${parseInt(this.area.style.height) - distance * cannon.config.cannonMeterPixelRatio - (5 + 1)}px`;
        } else {
            this.descendLine.style.height = 0;
            this.area.style.height = `${distance * cannon.config.cannonMeterPixelRatio}px`;
        }
    }

}

class Graph {
    constructor(elements) {
        this.elements = elements;
        this.bars = [];
        this.distance = null; // 높이

        this.KE = null; // 운동 에너지

        this.LE = null; // 위치 에너지

        this.ME = null; // 역학적 에너지
    }

    static locationEnergy(distance) {
        let result = Math.round(cannon.config.constants.graAcc * cannon.config.mass.current * distance);

        if (result >= cannon.config.mechanicalE) {
            result = cannon.config.mechanicalE;
        }

        return result;
    }

    initiate() {
        this.distance = new Bar($ts.getEl("#distance"));
        this.KE = new Bar($ts.getEl("#kineticEnergy"));
        this.LE = new Bar($ts.getEl("#locationEnergy"));
        this.ME = new Bar($ts.getEl("#mechanicalEnergy"));
        this.bars = [this.distance, this.KE, this.LE, this.ME];
        this.bars.forEach((bar, index) => {
            let bottomText = this.elements.texts[index];

            if (index === 0) {
                bottomText.style.marginLeft = `${cannon.config.graph.barMargin}px`;
            }

            bottomText.style.width = `${cannon.config.graph.barWidth}px`;
            bottomText.style.marginRight = `${cannon.config.graph.barMargin}px`;
            bar.initiate();
            bar.change(0);
        });
        this.elements.barContainer.style.height = `${cannon.config.graph.areaHeight}px`;
        this.hideTitle();
    }

    hideTitle() {
        this.elements.titleTxt.classList.add("off");
    }

    showTitle(string) {
        this.elements.titleTxt.classList.remove("off");
        $ts.getEl("p", this.elements.titleTxt)[0].innerHTML = `${string} 지점`;
    }

    changes(config) {
        let height, titleText, mechanicalE, locationE, kineticE;
        height = Math.floor(-config.height);

        if (config.target) {
            titleText = config.target.children[1].innerHTML;
            this.showTitle(titleText);
        }

        mechanicalE = cannon.config.mechanicalE;
        locationE = Graph.locationEnergy(-config.height);
        kineticE = mechanicalE - locationE;
        this.distance.change(height);
        this.LE.change(locationE);
        this.ME.change(mechanicalE);
        this.KE.change(kineticE);
    }

    reset() {
        this.hideTitle();
        this.bars.forEach(bar => {
            bar.change(0);
        });
    }

}

class Bar {
    constructor(element) {
        this.element = element;
        this.tip = $ts.getEl("div", element)[0];
        this.num = $ts.getEl(".num", element)[0];
        this.name = element.id;
    }

    initiate() {
        if (this.name === "distance") {
            this.element.style.marginLeft = `${cannon.config.graph.barMargin}px`;
        }

        this.element.style.width = `${cannon.config.graph.barWidth}px`;
        this.element.style.marginRight = `${cannon.config.graph.barMargin}px`; // this.element.style.transitionTimingFunction = `linear`;

        this.element.style.transitionDuration = `${cannon.config.graph.barTransitionDuration}ms`;
        this.tip.style.top = `${-cannon.config.graph.tipHeight}px`;
        this.tip.style.height = `${cannon.config.graph.tipHeight}px`;
        this.tip.style.lineHeight = `${cannon.config.graph.tipHeight}px`;
    }

    change(value) {
        let height = 0,
            num = 0,
            maxHeight;
        maxHeight = cannon.config.graph.areaHeight - cannon.config.graph.tipHeight; // 높이

        if (this.name === "distance") {
            height = value / Math.floor(-cannon.config.maxDistance) * maxHeight;
            num = value;
        } // 역학적 에너지
        else if (this.name === "mechanicalEnergy") {
            if (value) {
                height = maxHeight;
                num = value;
            }
        } // 운동 에너지 & 위치 에너지
        else {
            height = value / cannon.config.mechanicalE * maxHeight;
            num = value;
        }

        this.element.style.height = `${height}px`;
        this.num.innerHTML = `${num}`;
    }

}

class Indicator {
    constructor(element) {
        this.element = element;
        this.hide();
    }

    indicating() {
        this.element.classList.add("indicating");
    }

    show() {
        this.element.classList.remove("displayN");
    }

    hide() {
        this.element.classList.add("displayN");
    }

}

class Cannon {
    constructor(elements, config) {
        this.elements = elements;
        this.config = config;
        this.inputConnections = [];
        this.playBtn = null; // this.stopBtn = null;

        this.replayBtn = null;
        this.timer = null;
        this.ball = null;
        this.line = null;
        this.graph = null;
        this.commentBox = new CommentBox({
            container: $ts.getEl(".commentBox")[0],
            comments: $ts.getEl("p", $ts.getEl(".commentBox_inner")[0]),
            btn: $ts.getEl(".commentNextBtn")[0]
        }, config.comment);
        this.commentBox.addCallbacks({
            commentEnd: () => {
                this.indicators.velocity.show();
                this.indicators.velocity.indicating();
                this.indicators.mass.show();
                this.indicators.mass.indicating();
            }
        });
        this.scale = new $cale({
            target: $ts.getEl(".contentsArea")[0]
        });
        this.indicators = {
            velocity: null,
            mass: null
        };
    }

    initiate() {
        this.commentBox.start();
        this.initiateHTMLelements();
        this.initiateEfSound();
        this.initiateBtns();
        this.initiateTimer();
        this.initiateInputConnections();
        this.initiateBall();
        this.initiateLine();
        this.initiateGraph();
        this.initiateIndicators();
    }

    initiateHTMLelements() {
        let intervalID = window.setInterval(() => {
            let cannonAreaSize, cannonAreaStyle;
            cannonAreaSize = $ts.getSize(this.elements.cannonArea);
            cannonAreaStyle = $ts.getStyles(this.elements.cannonArea);

            if (cannonAreaSize.top && cannonAreaStyle.left) {
                window.clearInterval(intervalID);
                this.elements.pinContainer.style.top = `${cannonAreaSize.top}px`;
                this.elements.pinContainer.style.left = `${cannonAreaStyle.left}`;
            }
        });
        this.elements.cannonArea.style.height = `${this.config.cannon.areaHeight}px`;
        this.elements.lineComment.style.display = "none";

        document.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, { passive: false });
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
                this.playBtn.pointerOn();
                this.replayBtn.off();
                this.line.hideAll();
                this.elements.lineComment.style.display = "none";
                this.graph.reset();
                this.disableInputs();
                this.timer.startTimer();
            },
            off: () => {
                this.timer.pauseTimer();
                this.line.showAll();
                this.elements.lineComment.style.display = "block"; // this.replayBtn.on();
            }
        }); // this.stopBtn = new ClickToggleClass(this.elements.stopBtn, "on", {
        //     click: () => {
        //         this.efSound.play("media/click.mp3");
        //     },
        //     on: () => {
        //         this.timer.pauseTimer();
        //
        //         cannon.playBtn.off();
        //
        //         this.line.showAll();
        //     }
        // });

        this.replayBtn = new ClickToggleClass(this.elements.replayBtn, "on", {
            click: () => {
                this.efSound.play("media/click.mp3");
            },
            on: () => {
                this.reset();
            }
        });
        this.playBtn.addEvent(); // this.stopBtn.addEvent();

        this.replayBtn.addEvent();
    }

    initiateTimer() {
        this.timer = new CannonTimer(cannon.config.timer, {
            interval: () => {
                if (this.timer.distance > 0) {
                    // 끝나는 경우
                    this.reset();
                } else {
                    this.ball.move(this.timer.distance);
                    this.line.change(-this.timer.distance);
                    this.graph.changes({
                        height: this.timer.distance
                    });
                }
            }
        });
        this.timer.addConfig(cannon.config.constants); // 여러 상수들 입력

        this.timer.addConfig({
            startVelocity: cannon.config.velocity.current
        });
        this.timer.addConfig({
            mass: cannon.config.mass.current
        });
    }

    initiateInputConnections() {
        this.elements.inputPairs.forEach(pair => {
            let name, inputConn;
            name = pair[0].id.indexOf("velocity") > -1 ? "velocity" : "mass";
            inputConn = new InputConnection(name, pair, {
                initiate(self) {
                    self.inputs.forEach(input => {
                        input.min = name === "mass" ? cannon.config[self.name].min : -cannon.config[self.name].min;
                        input.max = name === "mass" ? cannon.config[self.name].max : -cannon.config[self.name].max;
                        input.value = name === "mass" ? cannon.config[self.name].initial : -cannon.config[self.name].initial;
                    });
                },

                change() {
                    // this : callback 보낸 input tag
                    let value, self;
                    value = parseInt(this.value);
                    self = this.self; // 바뀐 값 config에 입력

                    cannon.config[self.name].current = self.name === "mass" ? value : -value;
                    self.inputs.forEach(input => {
                        // 둘 중 다른 input에 넣기
                        if (this !== input) {
                            input.value = value;
                        }
                    });

                    if (self.name === "mass") {
                        if (!cannon.indicators.mass.changedFirst) {
                            cannon.indicators.mass.hide();
                            cannon.indicators.mass.changedirst = true;
                        }
                    } else {
                        if (!cannon.indicators.velocity.changedFirst) {
                            cannon.indicators.velocity.hide();
                            cannon.indicators.velocity.changedirst = true;
                        }
                    }
                }

            });
            inputConn.initiate();
            this.inputConnections.push(inputConn);
        });
    }

    initiateBall() {
        this.ball = new Ball($ts.getEl("#cannonball"), {
            ratio: this.config.constants.cannonMeterPixelRatio
        });
    }

    initiateLine() {
        this.line = new CannonLine({
            ratio: this.config.constants.cannonMeterPixelRatio
        });
        this.line.initiate();
    }

    initiateGraph() {
        this.graph = new Graph({
            titleTxt: $ts.getEl(".graphTitleTxt")[0],
            titleLine: $ts.getEl(".graphTitleLIne")[0],
            barContainer: $ts.getEl(".graphContents")[0],
            bars: $ts.getEl(".colorBar"),
            texts: $ts.getEl("li", $ts.getEl(".cannonGraph_text")[0])
        });
        this.graph.initiate();
    }

    initiateIndicators() {
        this.indicators.velocity = new Indicator(this.elements.indicators.velocity);
        this.indicators.velocity.changedFirst = false;
        this.indicators.mass = new Indicator(this.elements.indicators.mass);
        this.indicators.mass.changedFirst = false;
    }

    disableInputs() {
        this.elements.inputPairs.forEach(pair => {
            pair[0].disabled = true;
            pair[1].disabled = true;
        });
    }

    ableInputs() {
        this.elements.inputPairs.forEach(pair => {
            pair[0].disabled = false;
            pair[1].disabled = false;
        });
    }

    reset() {
        this.timer.resetTimer();
        this.playBtn.off(); // this.stopBtn.on();

        this.replayBtn.on();
        this.line.reset();
        this.elements.lineComment.style.display = "none";
        this.ball.reset();
        this.graph.reset();
        this.ableInputs();
    }

}

const cannon = new Cannon({
    container: $ts.getEl(".contentsArea")[0],
    playBtn: $ts.getEl(".playBtn")[0],
    // stopBtn: $ts.getEl(".stopBtn")[0],
    replayBtn: $ts.getEl(".replayBtn")[0],
    inputPairs: [[$ts.getEl("#rangeInput_velocity"), $ts.getEl("#numberInput_velocity")], [$ts.getEl("#rangeInput_mass"), $ts.getEl("#numberInput_mass")]],
    cannonArea: $ts.getEl(".cannonArea")[0],
    lineComment: $ts.getEl(".cannonLineArea_comment")[0],
    pinContainer: $ts.getEl(".cannonLinePins")[0],
    indicators: {
        velocity: $ts.getEl("#velocityArrow"),
        mass: $ts.getEl("#massArrow")
    }
}, config);
cannon.initiate();
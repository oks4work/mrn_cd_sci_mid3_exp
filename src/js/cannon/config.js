"use strict";

var config = {
  comment: {
    mode: "btn",
    firstShowDelay: 300,
    transitionDuration: 1000,
    commentTexts: ["위로 던져 올린 물체의 역학적 에너지는 <br />어떻게 될까요?"],
    commentHideDelay: [3000],
    containerTransitionDuration: 300
  },
  velocity: {
    min: -10,
    max: -20,
    initial: -15,
    current: -15
  },
  mass: {
    min: 1,
    max: 11,
    initial: 6,
    current: 6
  },
  timer: {
    playbackSpeed: 1
  },
  constants: {
    graAcc: 9.8 // 중력가속도

  },
  cannon: {
    areaHeight: 465 // 공의 최대 높이, 465px

  },
  pin: {
    maxLength: 3,
    text: ['A', 'B', 'C'],
    color: ['#ffa03b', '#ff6971', '#9cba5f']
  },
  graph: {
    areaHeight: 300,
    // 영역 높이
    barWidth: 80,
    // bar 너비
    barMargin: 25,
    // bar 간격
    tipHeight: 30,
    // tip 높이
    barTransitionDuration: 500 // bar 높이 변하는 속도 (ms)

  },

  get maxDistance() {
    return -(Math.pow(this.velocity.max, 2) / (2 * this.constants.graAcc));
  },

  get cannonMeterPixelRatio() {
    return -this.cannon.areaHeight / this.maxDistance;
  },

  get mechanicalE() {
    return this.mass.current * Math.pow(this.velocity.current, 2) / 2;
  }

};
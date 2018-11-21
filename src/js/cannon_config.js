"use strict";

var config = {
  comment: {
    firstShowDelay: 300,
    transitionDuration: 1000,
    commentTexts: ["공기의 저항이 없을 때 무게가 서로 다른 물체가 <br />자유 낙하 운동을 하면 어느 물체가 먼저 떨어질까요?", "&#9654; 버튼을 누르세요."],
    commentHideDelay: [4000, 1500],
    containerTransitionDuration: 300
  },
  velocity: {
    min: 10,
    max: 20,
    initial: 15,
    current: 15
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
    cannonAreaHeight: 465 // 공의 최대 높이, 465px

  },

  get maxDistance() {
    return -(Math.pow(this.velocity.max, 2) / (2 * this.constants.graAcc));
  },

  get cannonMeterPixelRatio() {
    return -this.cannon.cannonAreaHeight / this.maxDistance;
  }

};
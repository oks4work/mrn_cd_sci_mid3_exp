// drop canvas informs
const dropCanvasInfo = {
    dropHeight: 380, // drop 영역 height
    dropMeter: 20, // drop 영역 meter

    droneImgSrc: "images/fall/fall_drone.png", // 드론 이미지
    dronePos: { // 드론 위치
        y: 174,
        left: 318,
        right: 578
    },

    objectPos: { // 오브젝트 위치
        initial: { // 초기 위치
            y: 242,
            left: 388,
            right: 649
        },
        y: 242,
        left: 388,
        right: 649
    },
    objectImgs: { // 오브젝트 이미지 경로
        football: "images/fall/fall_soccerBall.png",
        basketball: "images/fall/fall_basketBall.png",
        baseball: "images/fall/fall_baseBall.png",
        feather: "images/fall/fall_feather.png",
        pumpkin: "images/fall/fall_pumpkin.png",
        car: "images/fall/fall_car.png",
        piano: "images/fall/fall_piano.png"
    },
    objectImgIndexing: [ // 오브젝트 이미지 인덱싱
        "football",     // 1
        "basketball",   // 2
        "baseball",     // 3
        "feather",      // 4
        "pumpkin",      // 5
        "car",          // 6
        "piano"         // 7
    ],
    selectedObjects: ["baseball", "basketball"] // 선택된 오브젝트
};

// graph canvas informs
const graphCanvasInfo = {
    graphPosition: { // graph 위치, 1칸당 크기
        left: 52,
        bottom: 77,
        width: 43,
        height: 35
    },
    graphIsLocated: [false, false], // 처음에 graph 위치 잡았는지 check
    stdTime: 500, // 칸 당 시간 (ms)
    startPos: { // 선 그리기 시작점
        x: 0,
        y: 0
    }
};

const timerConfig = {
    limitTime: 2000, // 최대 시간


    playbackSpeed: 1, // 재생 속도

    captureInterval: 250, // 캡쳐 간격(ms)
    graAcc: 9.8,// 중력가속도
    timeToVeConst: 1000, // 시간 → 속도 상수 (1s = 1000ms)
    
    meterPixelRatio: dropCanvasInfo.dropHeight / dropCanvasInfo.dropMeter // 1m = 19px
};
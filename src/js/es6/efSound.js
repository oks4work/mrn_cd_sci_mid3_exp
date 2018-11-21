class EffectSound {
    constructor(containerElement) {
        this.container = containerElement;
        this.audio = document.createElement("audio");
        this.intervalID = 0;
    }

    static intervalFn() {
        let audio = EffectSound.audio;

        if (audio.readyState) {
            window.clearInterval(audio.intervalID);

            audio.play();
        }
    }

    initiate() {
        this.audio.preload = "none";
        this.audio.autoplay = false;
    }

    play(srcString) {
        if (this.audio.src.indexOf(srcString) > -1) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.play();
        } else {
            this.audio.src = srcString;
            this.audio.load();

            this.intervalID = window.setInterval(() => {
                if (this.audio.readyState) {
                    window.clearInterval(this.intervalID);

                    this.audio.play();
                }
            });
        }

        // audio.addEventListener("pause", () => {
        //     EffectSound.endUpFn(audio);
        // });

        // audio.addEventListener("ended", () => {
        //     EffectSound.endUpFn(audio);
        // });
    }
}
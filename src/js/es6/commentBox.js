class CommentBox {
    constructor(HTMLelements, opts) {
        this.elements = HTMLelements;
        this.opts = opts;
        this.count = 0;
    }

    setBasicStyles() {
        let container, comments;

        container = this.elements.container;
        comments = this.elements.comments;

        container.style.opacity = 1;
        container.style.transitionDuration = `${this.opts.containerTransitionDuration}ms`;

        comments.forEach((comment, index) => {
            comment.style.opacity = 0;
            comment.innerHTML = this.opts.commentTexts[index];
        });
    }

    addEvent() {
        document.addEventListener("DOMContentLoaded", () => {
            this.elements.comments[0].style.display = "";
            this.showNextComment(this.opts.firstShowDelay);
        });
    }

    showNextComment(delay) {
        window.setTimeout(() => {
            if (this.elements.comments[this.count - 1]) {
                this.elements.comments[this.count - 1].style.display = "none";
            }

            this.elements.comments[this.count].style.display = "";
            this.elements.comments[this.count].style.opacity = 1;
            this.elements.comments[this.count].style.transitionDuration = `${this.opts.transitionDuration}ms`;


            this.count++;

            window.setTimeout(() => {
                if (!this.elements.comments[this.count]) {
                    this.hideComment();
                } else {
                    this.showNextComment(0);
                }
            }, this.opts.commentHideDelay[this.count - 1]);
        }, delay);
    }

    hideComment() {
        this.elements.container.style.opacity = 0;

        window.setTimeout(() => {
            this.elements.container.style.display = "none";
        }, this.opts.containerTransitionDuration);
    }

    start() {
        this.setBasicStyles();
        this.addEvent();
    }
}
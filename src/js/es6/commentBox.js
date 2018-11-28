class CommentBox {
  constructor(elements, config) {
    this.elements = elements;
    this.config = config;
    this.count = 0;
    this.callbacks = {
      commentEnd: undefined
    };
  }

  addCallbacks(callbacks) {
    for (let prop in this.callbacks) {
      if (callbacks[prop]) {
        this.callbacks[prop] = callbacks[prop];
      }
    }
  }

  setBasicStyles() {
    let container, comments;
    container = this.elements.container;
    comments = this.elements.comments;
    container.style.opacity = 1;
    container.style.transitionDuration = `${this.config.containerTransitionDuration}ms`;
    comments.forEach((comment, index) => {
      comment.style.opacity = 0;
      comment.innerHTML = this.config.commentTexts[index];
    }); // mode: btn

    if (this.config.mode === "btn") {
      this.hideBtn();
    }
  }

  addEvents() {
    document.addEventListener("DOMContentLoaded", () => {
      this.elements.comments[0].style.display = "";
      this.showNextTimeout(this.config.firstShowDelay);
    });

    if (this.config.mode === "btn") {
      this.elements.btn.addEventListener("click", () => {
        this.showNext();
      });
    }
  }

  showNextTimeout(delay) {
    window.setTimeout(() => {
      this.showNext();
    }, delay);
  }

  showNext() {
    // mode: btn
    if (this.config.mode === "btn") {
      if (this.count === this.elements.comments.length) {
        this.hideComment();
        return;
      } else {// this.hideBtn();
      }
    }

    if (this.elements.comments[this.count - 1]) {
      this.elements.comments[this.count - 1].style.display = "none";
    }

    this.elements.comments[this.count].style.display = "";
    this.elements.comments[this.count].style.opacity = "1";
    this.elements.comments[this.count].style.transitionDuration = `${this.config.transitionDuration}ms`;
    this.count++;
    window.setTimeout(() => {
      // mode: auto
      if (this.config.mode === "auto") {
        if (!this.elements.comments[this.count]) {
          this.hideComment();
        } else {
          this.showNextTimeout(0);
        }
      } // mode: btn
      else if (this.config.mode === "btn") {
          this.showBtn();
        }
    }, this.config.commentHideDelay[this.count - 1]);
  }

  hideComment() {
    this.elements.container.style.opacity = 0;
    window.setTimeout(() => {
      this.elements.container.style.display = "none";
    }, this.config.containerTransitionDuration);

    if (this.callbacks && this.callbacks.commentEnd) {
      this.callbacks.commentEnd();
    }
  }

  hideBtn() {
    this.elements.btn.style.opacity = "0";
    this.elements.btn.style.visibility = "hidden";
    this.elements.btn.style.transitionDuration = "";
  }

  showBtn() {
    this.elements.btn.style.opacity = "1";
    this.elements.btn.style.visibility = "visible";
    this.elements.btn.style.transitionDuration = `${this.config.containerTransitionDuration}ms`;
  }

  start() {
    this.setBasicStyles();
    this.addEvents();
  }

}
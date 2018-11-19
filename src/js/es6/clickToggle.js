(function() {
    class ClickToggleClass {
        constructor(HTMLelement, className, callbacks) {
            this.element = HTMLelement;
            this.toggleClassName = className;
            this.callbacks = {
                click: callbacks && callbacks.click || null,
                on: callbacks && callbacks.on || null,
                off: callbacks && callbacks.off || null
            }
        }

        addEvent() {
            this.element.addEventListener("click", () => {
                this.clickEventHandler();
                if (this.callbacks.click) {
                    this.callbacks.click();
                }
            });
        }

        clickEventHandler() {
            if (this.element.classList.contains(this.toggleClassName)) {
                this.off();
                if (this.callbacks.off) {
                    this.callbacks.off();
                }
            } else {
                this.on();
                if (this.callbacks.on) {
                    this.callbacks.on();
                }
            }
        }

        on() {
            this.element.classList.add(this.toggleClassName);
        }

        off() {
            this.element.classList.remove(this.toggleClassName);
        }
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') { console.log(module);
        module.exports = ClickToggleClass;
    } else {
        window.ClickToggleClass = ClickToggleClass;
    }
})();
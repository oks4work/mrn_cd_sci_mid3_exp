class InputConnection {
    constructor(name, inputs, callbacks) {
        this.name = name;
        this.inputs = inputs;
        this.callbacks = callbacks;
    }

    initiate() {
        this.inputs.forEach((input) => {
            input.self = this;
        });
        this.addEvents();

        if (this.callbacks && this.callbacks.initiate) {
            this.callbacks.initiate(this);
        }
    }

    addEvents() {
        this.inputs.forEach((input) => {
            if (this.callbacks && this.callbacks.change) {
                input.addEventListener("change", this.callbacks.change);
            }
        });
    }
}
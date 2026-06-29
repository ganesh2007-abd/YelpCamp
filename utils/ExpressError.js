class expressError extends Error {
    constructor(msg, s) {
        super()
        this.message = msg
        this.status = s;
    }
}

module.exports = expressError
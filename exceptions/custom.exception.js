class CustomError extends Error {
    constructor(message, status = 400) {
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = CustomError;

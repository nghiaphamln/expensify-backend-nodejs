class AuthenticationError extends Error {
    constructor(message = 'Not authorize') {
        super();
        this.status = 401;
        this.message = message;
    }
}

module.exports = AuthenticationError;

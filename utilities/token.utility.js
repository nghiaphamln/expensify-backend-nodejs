const jwt = require('jsonwebtoken')
const CustomError = require('../exceptions/custom.exception');

class TokenUtility {
    GenerateToken = async (data, tokenLife) => {
        if (!data) return null;
        return await jwt.sign(
            {...data, createdAt: new Date()},
            process.env.JWT_KEY,
            {expiresIn: tokenLife}
        );
    }

    VerifyToken = async (token) => {
        if (!token) return new CustomError('Token không hợp lệ');
        return jwt.verify(token, process.env.JWT_KEY);
    }
}

module.exports = new TokenUtility();

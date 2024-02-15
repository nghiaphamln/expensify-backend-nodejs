const UserValidate = require('../validates/user.validate');
const User = require('../models/user.model');
const TokenUtil = require('../utilities/token.utility');
const AuthenError = require('../exceptions/authentication.exception');
const NotFoundError = require("../exceptions/notFound.exception");
const bcrypt = require("bcryptjs");
const CustomError = require("../exceptions/custom.exception");

class AuthService {
    Register = async (userInfo) => {
        const registerInfo = await UserValidate.CheckRegisterInfo(userInfo);
        const newUser = new User({
            ...registerInfo
        });

        await newUser.save();
    }

    Login = async (username, password, source) => {
        UserValidate.ValidateLogin(username, password);

        let user = await User.findOne({
            username,
            isActivated: true,
            isDeleted: false
        }).exec();

        if (!user) {
            throw new CustomError('Thông tin tài khoản hoặc mật khẩu không chính xác');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new CustomError('Thông tin tài khoản hoặc mật khẩu không chính xác');
        }

        return await this.GenAndUpdateToken(user._id, source);
    }

    RefreshToken = async (refreshToken, source) => {
        let {_id} = await TokenUtil.VerifyToken(refreshToken);

        const user = await User.findOne({
            _id,
            isActivated: true,
            refreshTokens: {
                $elemMatch: {token: refreshToken, source}
            },
        }).exec();

        if (!user) throw new AuthenError();

        return await TokenUtil.GenerateToken(
            {_id, source},
            process.env.JWT_LIFE_ACCESS_TOKEN
        );
    }

    GenAndUpdateToken = async (_id, source) => {
        const token = await TokenUtil.GenerateToken(
            { _id, source },
            process.env.JWT_LIFE_ACCESS_TOKEN
        );
        const refreshToken = await TokenUtil.GenerateToken(
            { _id, source },
            process.env.JWT_LIFE_REFRESH_TOKEN
        );

        await User.updateOne({_id}, {$pull: {refreshTokens: {source}}});
        await User.updateOne({_id}, {$push: {refreshTokens: {token: refreshToken, source}}});

        return {token, refreshToken};
    }
}

module.exports = new AuthService();

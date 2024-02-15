const {connect, set} = require('mongoose');

ConnectDatabase = async () => {
    try {
        set('strictQuery', false);
        await connect(process.env.MONGO_URL, {
            retryWrites: true,
        });
        console.log('Kết nối database thành công')
    } catch (error) {
        console.error('Kết nối database thất bại', error);
    }
}

module.exports = {ConnectDatabase};

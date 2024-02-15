module.exports = Logger = (req, res, next) => {
    console.log(`[${req.method}][${req.ip}] ${req.originalUrl}`);
    next();
}

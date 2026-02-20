const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('You must be logged in.');
    }

    const token = authorization.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json('Invalid token');
        }
        req.userId = payload.id;
        next();
    });
};
module.exports ={
    requireAuth : requireAuth
}
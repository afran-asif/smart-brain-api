const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization){
        return res.status(401).json({error: 'You must be logged in.'});
    }
    const token = authorization.replace('Bearer' , '');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) =>{
        if(err){
            return res.status(401).json({error: 'Invalid token'});
        }
        req.userId = payload.id;
        next();
    });
};

module.exports = {
    requireAuth
};
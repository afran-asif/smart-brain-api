const jwt = require('jsonwebtoken');

const handleSignin = ( req , res, db, bcrypt) => {
    const {email,password} = req.body;
    if( !email || !password ){
        return res.status(400).json('Incorrect form submission');
    }
    db.select('email','hash').from('login').where('email' ,'=', email )
    .then ( data => {
        const isValid = bcrypt.compareSync(password , data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where( 'email' , '=' , email )
            .then ( user =>{
                const token = jwt.sign({id : user[0].id}, process.env.JWT_SECRET ,({ expiresIn: '1h'}))
                res.json({
                    user: user[0],
                    token: token
                });
            })
            .catch(err => res.status(400).json('unable to get user'))
        }else{
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}
module.exports = {
    handleSignin: handleSignin
};
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); 
require('dotenv').config();
const signin = require('./Controllers/signin');
const register = require('./Controllers/register');
const profile = require('./Controllers/profile');
const image =require('./Controllers/image');

const PORT = process.env.PORT;
const { requireAuth }= require('./MIddleware/auth')
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false
        }
    }
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const database = {
    users : [
        {
            id: '1',
            name: 'john',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}


app.get('/', (req, res) => {
    res.send('server running...')
})

app.post('/signin', (req,res) => { signin.handleSignin(req,res,db,bcrypt)})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})
    
app.get('/profile/:id',(req, res) => { profile.handleProfile(req, res, db)})

app.put('/image', requireAuth, (req, res) => { image.handleImage(req, res, db)})

app.post('/imageUrl', requireAuth, (req, res) => { image.handleApiCall(req, res)})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
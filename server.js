const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require ('./controllers/register');
const signin = require ('./controllers/signin');
const profile = require ('./controllers/profile');
const image = require ('./controllers/image');

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

/* 			ENDPOINTS
	/ 	 	 			--> res = This is working
	/signin 			--> POST Success/Fail
	/register			--> POST user
	/profile/:id 		--> GET = user
	/image 				--> PUT --> user (updated)
*/

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=>{ res.send('App running...') })

//Full version to clarify
//app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt) })

//We can use this shorter syntax since the function automatically recieves (req, res)
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfile(db))
app.put('/image', image.handleImage(db))
//app.post('/imageurl', image.handleApiCall) //If taking no parameters apart from (req,res) omit ()
app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)} )

//For Deployment
app.listen(process.env.PORT || 3000, ()=>{
	console.log(`App is running on port ${process.env.PORT}`);
})


















//
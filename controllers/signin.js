//Full version for clarity
//const handleSignin = (req, res, db, bcrypt)=>{
//Shorter Syntax
const handleSignin = (db, bcrypt) => (req, res) => {
	const {email, password} = req.body;
	
	//Security - Empty Field Check
	if (!email || !password){
		return res.status(400).json('Incorrect form submission');
	}

	db.select('email','hash').from('login')
		.where('email','=',email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash); 

			if(isValid){
				return db.select('*').from('users')
				.where('email','=',email)
				.then(user => {
					res.json(user[0]);
				})
				.catch(err => res.status(400).json('Unable to get user'))
			}else{
				res.stats(400).json('Wrong credentials1');
			}	
		})
		.catch(err => res.status(400).json('Wrong credentials2'))
}

module.exports = {
	handleSignin: handleSignin
};
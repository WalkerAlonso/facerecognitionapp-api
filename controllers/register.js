const handleRegister = (db, bcrypt) => (req, res) => {
	const { email, name, password } = req.body;

	//Security - Empty Field Check
	if (!email || !name || !password){
		return res.status(400).json('Incorrect form submission');
	}

	const hash = bcrypt.hashSync(password);
	//Transaction necessary when you have to do more than 1 query
	db.transaction(trx=>{
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users').returning('*').insert({
				email: loginEmail[0], 
				name: name,
				joined: new Date()
			}).then(user => {
				res.json(user[0]); 
			})
			.then(trx.commit)
			.catch(trx.rollback)
		}).catch(err => res.status(400).json('Unable to register'))
	})
}

module.exports = {
	handleRegister: handleRegister
};
import bcrypt from 'bcrypt';

const password = 'admin123'; 
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Hash para MongoDB:', hash);
});

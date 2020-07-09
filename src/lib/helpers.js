const bcrypt = require('bcryptjs');

const helpers = {};

// encripta password
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // genera hash o patron
  const hash = await bcrypt.hash(password, salt); // genera cifrado recibiendo password y patron
  return hash;
};

// comparar password cifrada en la bd
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;
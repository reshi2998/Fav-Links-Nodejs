const {format} = require('timeago.js');

// objeto que sera utilizado por vista
const helpers = {};

// timestamp se tiene desde la base de datos
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;
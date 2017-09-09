const cors = require('micro-cors')();
const { router, get, post } = require('microrouter');
const handlers = require('./handlers');

module.exports = cors(router(get('/', handlers.index), post('/', handlers.main)));

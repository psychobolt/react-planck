'use strict';

if (process.env.NODE_ENV === 'development') {
  window.DEBUG = true;
  module.exports = require('./index.dev');
} else {
  window.DEBUG = false;
  module.exports = require('./index.prod');
}

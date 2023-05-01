console.log('Hello Demo');
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
var moment = require('moment');
var date = moment().format('LL');
console.log(date);
console.log('Done');
let moment = require('moment');

// var date = new Date();
// var months = ['Jan', 'Feb'];
// console.log(date.getTime());

// let date = moment();
// date.add(100, 'year').subtract(9, 'month');
// console.log(date.format('Do MMM. YYYY, kk:mm'));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
let date = moment(createdAt);
console.log(date.format('H:mm'));

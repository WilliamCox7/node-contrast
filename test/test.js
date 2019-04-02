let file2 = require('./test2');

module.exports = function() {
  test1();
  test3(5);
  setTimeout(function() {
    test5();
  }, 3000);
  file2();
}

function test1() {
  console.log('test 1');
  try {
    test4();
  } catch(err) {
    test2();
    console.log('errored!');
    return;
  }
}

function test2() {
  console.log('test 2');
}

function test3() {
  console.log('test 3');
}

function test4() {
  console.log('test 4');
  return undefined.toLowerCase();
}

function test5() {
  console.log('test 5');
}

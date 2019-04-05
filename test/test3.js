module.exports = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => { return resolve()}, 500);
  })
  .then(() => {
    return promise1()
  })
  .then(() => {
    return true;
  })
}

function promise1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, 100)
  });
}

function entry() {
  console.log('entry');
}

function exitProm() {
  console.log('exitProm');
}

function exit() {
  console.log('exit');
}
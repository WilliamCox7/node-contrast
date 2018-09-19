const idgen = require('idgen');

/** @module registerEntry generate a unique id to map each stack entry
*/

module.exports = function(entry) {
  let sid = idgen();
  this.map[sid] = entry;
  this.stack.push(sid);
  return sid;
}

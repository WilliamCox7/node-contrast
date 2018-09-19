/** @module getCurrentStackId pop until the correct sid pops
*/

module.exports = function(args) {
  let csid = this.stack.pop();
  while (csid !== args.entryData.sid) {
    csid = this.stack.pop();
  }
  return csid;
}

/** @module buildEntryArgs creates argument object used for output for both entry and exit calls
*/

module.exports = function(args, sid) {
  return {
    name: args.name,
    file: args.file,
    line: args.line,
    ts: Date.now(),
    length: this.stack.length,
    sid: sid
  };
}

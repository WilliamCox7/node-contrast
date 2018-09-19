/** @module buildExitArgs creates argument object used for output for exit calls
*/

module.exports = function(args, ts) {
  return {
    name: args.entryData.name,
    file: args.entryData.file,
    line: args.line,
    span: ts,
    length: this.stack.length,
    returnValue: args.returnValue
  };
}

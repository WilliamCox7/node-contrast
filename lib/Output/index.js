// native node modules
const util = require('util');
const fs = require('fs');
const path = require('path');

// required private modules called by this class
const getIndentation = require('./get-indentation');

// output formatting
var ENTRY = '%s%s "%s" (line %s)\n';
var EXIT = '%s%s ts: %s (line %s)\n';

/** @class  Output      this outputs all entry/exit calls to a file
  * @method constructor this initializes Output with the out stream
  * @method entry       this outputs the entry event
  * @method exit        this outputs the exit event
*/

module.exports = new class Output {

  constructor() {
    let file = path.resolve(process.cwd(), '../node-contrast/test/output.txt');
    let dir = path.dirname(file);
    let stream = fs.createWriteStream(file);
    this.stdout = stream;
    this.stdoutFn = stream.write;
  }

  entry(args) {
    let indent = getIndentation(args.length - 1);
    var msg = util.format(ENTRY, indent, args.name, args.file, args.line);
  	this.stdoutFn.call(this.stdout, msg);
  }

  exit(args) {
    let indent = getIndentation(args.length);
    var msg = util.format(EXIT, indent, args.name, args.span, args.line);
  	this.stdoutFn.call(this.stdout, msg);
  }

}

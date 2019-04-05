// native node modules
const util = require('util');
const fs = require('fs');
const path = require('path');

// required private modules called by this class
const getIndentation = require('./get-indentation');

// output formatting
var ENTRY = '%s--> "%s" @ L%s %s\n';
var EXIT = '%s<-- %ss @ L%s\n%s';

/** @class  Output      this outputs all entry/exit calls to a file
  * @method constructor this initializes Output with the out stream
  * @method entry       this outputs the entry event
  * @method exit        this outputs the exit event
*/

module.exports = new class Output {

  constructor() {
    let file = path.resolve(__dirname, '../../node-contrast.out');
    let stream = fs.createWriteStream(file);
    this.stdout = stream;
    this.stdoutFn = stream.write;
  }

  entry(args) {
    let indent = getIndentation(args.length - 1);
    var msg = util.format(ENTRY, indent, args.file, args.line, args.name);
  	this.stdoutFn.call(this.stdout, msg);
  }

  exit(args) {
    let indent = getIndentation(args.length);
    let newLine = "";
    if (!indent) newLine = "\n";
    var msg = util.format(EXIT, indent, args.span, args.line, newLine);
  	this.stdoutFn.call(this.stdout, msg);
  }

}

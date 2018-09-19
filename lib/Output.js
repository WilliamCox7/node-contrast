const util = require('util');
const fs = require('fs');
const path = require('path');

// --> foo@file.js@12
var ENTRY = '%s%s "%s" (line %s)\n';
// <-- foo@file.js@12, ts: xx, endLine: 129, retVal: xxx"
var EXIT = '%s%s ts: %s (line %s)\n';

class Output {

  constructor() {
    let file = path.resolve(process.cwd(), '../node-contrast/test/output.txt');
    let dir = path.dirname(file);
    let stream = fs.createWriteStream(file);
    this.stdout = stream;
    this.stdoutFn = stream.write;
  }

  entry(args) {
    let indent = getIndentation(args.stack.length - 1);
    var msg = util.format(ENTRY, indent, args.name, args.file, args.line);
  	this.stdoutFn.call(this.stdout, msg);
  }

  exit(args) {
    let indent = getIndentation(args.stack.length);
    var msg = util.format(EXIT, indent, args.name, args.span, args.line);
  	this.stdoutFn.call(this.stdout, msg);
  }

}

module.exports = new Output();

function getIndentation(len) {
  let indent = '';
  for (var i = 0; i < len; i++) {
    indent += '  ';
  }
  return indent;
}

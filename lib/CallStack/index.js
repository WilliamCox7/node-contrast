// require class objects
const Output = require('../Output.js');

// required private modules called by this class
const registerEntry = require('./register-entry');
const buildEntryArgs = require('./build-entry-args');
const buildExitArgs = require('./build-exit-args');
const getCurrentStackId = require('./get-current-stack-id');

/** @class  CallStack   this class handles all events created by our global functions
  * @desc               structured to help with formatting the output
  * @method constructor this initializes CallStack with member variables
  * @method push        this adds an entry onto the stack and returns entry args for exit call
  * @method pop         this removes the last entry from the stack
  * @method catch       peek at the top and remove from stack if current entry is not being executed
*/

module.exports = new class CallStack {

  constructor() {
    this.stack = [];
    this.map = {};
    this.entryArgs = {};
    this.exitArgs = {};
  }

  push(args) {
    let entry = `${args.name}@${args.file}::${args.line}`;
    let sid = registerEntry.call(this, entry);
    let entryArgs = buildEntryArgs.call(this, args, sid);
    Output.entry(entryArgs);
    return entryArgs;
  }

  pop(args) {
    let ts = Date.now() - args.entryData.ts;
    let csid = getCurrentStackId.call(this, args);
    let exitArgs = buildExitArgs.call(this, args, ts);
    Output.exit(exitArgs);
    if (!this.stack.length) this.map = {};
  }

  catch(args) {
    let csid = this.stack[this.stack.length-1];
    while (csid !== args.entryData.sid) {
      csid = this.stack.pop();
      csid = this.stack[this.stack.length-1];
    }
  }

}

const idgen = require('idgen');
const Output = require('./Output.js');

class CallStack {

  constructor() {
    this.stack = [];
    this.map = {};
    this.entryArgs = {};
    this.exitArgs = {};
  }

  push(args) {
    let entry = `${args.name}@${args.file}::${args.line}`;
    // generate a unique id to map each stack entry
    let sid = idgen();
    this.map[sid] = entry;
    this.stack.push(sid);

    // save args to self
    this.entryArgs.name = args.name;
    this.entryArgs.file = args.file;
    this.entryArgs.line = args.line;
    this.entryArgs.stack = this.stack;

    // inform the output to display entry
    Output.entry(this.entryArgs);

    // return exit args
    return {
      name: args.name,
      file: args.file,
      line: args.line,
      ts: Date.now(),
      sid: sid
    };
  }

  pop(args) {
    let ts = Date.now() - args.entryData.ts;
    // pop until the correct sid pops
    let csid = this.stack.pop();
    while (csid !== args.entryData.sid) {
      csid = this.stack.pop();
    }
    // store entry from map
    let entry = this.map[csid];
    // clear map if stack is empty
    if (!this.stack.length) this.map = {};
    this.exitArgs.name = args.entryData.name;
    this.exitArgs.file = args.entryData.file;
    this.exitArgs.line = args.line;
    this.exitArgs.span = ts;
  	this.exitArgs.stack = this.stack;
  	this.exitArgs.returnValue = args.returnValue;

    // inform the output to display exit
    Output.exit(this.exitArgs);
  }

  catch(args) {
    // peek at the top and pop if csid is not being executed
    let csid = this.stack[this.stack.length-1];
    while (csid !== args.entryData.stackId){
      csid = this.stack.pop();
      csid = this.stack[this.stack.length-1];
    }
  }

}

module.exports = new CallStack();

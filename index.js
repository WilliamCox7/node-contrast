const EventEmitter = require('events');
const Module = require('module');
const Injector = require('./lib/Injector');
const CallStack = require('./lib/CallStack');
const path = require('path');

class NodeContrast extends EventEmitter {

  inject(dirname) {
    this.callStack = CallStack;
    injectTracer.call(this, dirname);
    setGlobalFunction.call(this);
  }

}

module.exports = new NodeContrast();

function injectTracer(dirname) {
  // save a reference to _compile
  let compile = Module.prototype._compile;
  // restructure _compile function by injecting code onto the content string
  Module.prototype._compile = function(content, filename) {
    // determine if the source code is encompassed by the module wrapper
    // https://nodejs.org/api/modules.html#modules_the_module_wrapper
    let wrapped = true, shouldWrap = Module.wrapper.length === 2;
    if (shouldWrap) {
      // wrap the source code in the wrapper function
      // Module.wrapper indices represent the start ([0]) and end ([1])
      // of the wrapper function
      content = `${Module.wrapper[0]}\n${content}${Module.wrapper[1]}`;
    } else {
      wrapped = false;
    }
    // trim path
    let pathArray = path.dirname(filename).split('/');
    let displayPath = `/${pathArray[pathArray.length-1]}${filename.replace(dirname, '')}`;
    // inject our tracing component into the source code
    content = Injector.addTracer(content, displayPath, wrapped);
    // our reference to _compile will wrap the source code, so we need to 'unwrap'
    if (shouldWrap) {
      content = content.substring(
        Module.wrapper[0].length, // remove the first x characters
        content.length - Module.wrapper[1].length // remove the last x characters
      );
    }
    // use the reference we stored earlier to complete the compile process
    compile.call(this, content, filename);
  }
}

function setGlobalFunction() {
	var self = this;
  // global function to be injected at beginning of every function
	global.__NodeContrastEntry__ = function(args) {
		return self.callStack.push(args);
	};
  // global function to be injected at end of every function
	global.__NodeContrastExit__ = function(args) {
		self.callStack.pop(args);
	};
  // global function to be injected in every catch clause
	global.__NodeContrastCatch__ = function(args) {
		self.callStack.catch(args);
	};
};

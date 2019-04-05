// node modules
const falafel = require('falafel');

// native node modules
const util = require('util');

// required private modules called by this class
const getFunctionName = require('./get-function-name');
const injectBothEntryAndExit = require('./inject-both-entry-and-exit');
const injectExitAfterArgument = require('./inject-exit-after-argument');
const injectCatch = require('./inject-catch');

// injection strings or "contrast solutions"
const ENTRY = 'var __NodeContrastEntryData__ = __NodeContrastEntry__({file: %s, name: %s, line: %s});';
const EXIT = '__NodeContrastExit__({entryData: __NodeContrastEntryData__, line: %s, returnValue: %s});';
const CATCH = 'if (__NodeContrastCatch__) {\n__NodeContrastCatch__({entryData: __NodeContrastEntryData__});\n}';

/** @class  Syringe        injects the global functions into the user's code
  * @method injectContrast the method that handles the injection
*/

module.exports = new class Syringe {

  injectContrast(content, filename, wrapped) {
    return falafel(content, {
      ranges: true,
      locations: true,
      ecmaVersion: 8
    }, (node) => {
      let startLine = wrapped ? node.loc.start.line - 1 : node.loc.start.line;
  		let exitLine = wrapped ? node.loc.end.line - 1 : node.loc.end.line;
      let name = getFunctionName.call(this, node);
      if (name && node.body.type === 'BlockStatement') {
        injectBothEntryAndExit(node, wrapped, ENTRY, EXIT, startLine, exitLine, filename, name);
      } else if (node.type === 'ReturnStatement') {
        injectExitAfterArgument(node, EXIT, startLine);
      } else if (node.type === 'CatchClause') {
        injectCatch(node, CATCH);
      }
    }).toString();
  }

}

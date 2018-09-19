// native node modules
const util = require('util');

/** @module injectExitAfterArgument return statement could be returning a function, if so we will
  * need to place. the tracer function after the argument
*/

module.exports = (node, EXIT, startLine) => {
  if (node.argument) {
    var tmpVar = '__NodeContrastTmp' + Math.floor(Math.random() * 10000) + '__';
    let exit = util.format(EXIT, startLine, node.argument.source() || 'null');
    node.update(`{\nvar ${tmpVar} = ${node.argument.source()};\n${exit}\nreturn ${tmpVar};\n}`);
  } else {
    // return statement has no argument
    let exit = util.format(EXIT, startLine, 'null');
    node.update(`{${exit}${node.source()}}`);
  }
}

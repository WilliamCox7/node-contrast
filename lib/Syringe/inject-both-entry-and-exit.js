// native node modules
const util = require('util');

// sibling methods
const getFuncBodyParts = require('./get-func-body-parts');

/** @module injectBothEntryAndExit this surrounds the function body with the entry and exit globals
*/

module.exports = (node, wrapped, ENTRY, EXIT, startLine, exitLine, filename, name) => {
  let func = getFuncBodyParts(node);
  if (wrapped && node.loc.start.line === 1) { return; }
  let entry = util.format(ENTRY, JSON.stringify(filename), JSON.stringify(name), startLine);
  let exit = util.format(EXIT, exitLine, 'null');
  let newFuncBody = `\n${entry}\n${func.body}\n${exit}\n`;
  node.update(`${func.declaration}{${newFuncBody}}`);
}

/** @module injectCatch this injects the catch global in all catch clauses
*/

module.exports = (node, CATCH) => {
  var c = node.body.source();
  // Remove the open and close braces "{}"
  c = c.slice(1, c.length - 1);
  node.body.update(`{\n${CATCH}\n${c}\n}`);
}

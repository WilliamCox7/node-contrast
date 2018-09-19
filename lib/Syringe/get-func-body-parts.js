/** @module getFuncBodyParts returns the declaration and body of the function node
*/

module.exports = (node) => {
  return {
    declaration: node.source().slice(0, node.body.range[0] - node.range[0]),
    body: node.body.source().slice(1, node.body.source().length - 1)
  }
}

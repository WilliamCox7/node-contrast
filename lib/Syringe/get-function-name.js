/** @module   getFunctionName           there are several ways to get function name. Avoiding returning 'Anonymous'
  * @function isFunction                determines if the node is a function
  * @function getFunctionNameFromParent if function is anonymous, get the name from it's parent if possible
*/

module.exports = function(node) {
  if (!isFunction(node)) { return; }
  if (node.id) { return node.id.name; }
  return getFunctionNameFromParent(node);
}

function isFunction(node) {
  return ((
    node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  ) &&
    node.range
  );
}

function getFuncDisplay(type) {
  switch(type) {
    case 'ArrowFunctionExpression': return '() =>';
    case 'FunctionExpression': return 'function()';
  }
}

function getFunctionNameFromParent(node) {
  let parent = node.parent;
  switch(parent.type) {
    case 'AssignmentExpression':
      if (parent.left.range) {
        return `${parent.left.source().replace(/"/g, '\\"')}()`;
      }
      break;
    case 'VariableDeclarator':
      return `${parent.id.name}()`;
    case 'CallExpression':
      return parent.callee.id ? `${parent.callee.id.name}()` : getFuncDisplay(node.type);
    default:
      if (typeof parent.length === 'number') {
        return parent.id ? `${parent.id.name}()` : getFuncDisplay(node.type);
      } else if (parent.key && parent.key.type === 'Identifier' &&
        parent.value === node && parent.key.name) {
        return `${parent.key.name}()`;
      }
  }
}

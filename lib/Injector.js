const falafel = require('falafel');
const util = require('util');

const ENTRY = 'var __NodeContrastEntryData__ = __NodeContrastEntry__({file: %s, name: %s, line: %s});';
const EXIT = '__NodeContrastExit__({entryData: __NodeContrastEntryData__, line: %s, returnValue: %s});';
const CATCH = 'if (__NodeContrastCatch__) {\n__NodeContrastCatch__({entryData: __NodeContrastEntryData__});\n}';

class Injector {

  addTracer(content, filename, wrapped) {
    return falafel(content, {
      ranges: true,
      locations: true,
      ecmaVersion: 8
    }, function processASTNode(node) {
      let entry, exit;
      // get the starting/ending line for the function
      let startLine = wrapped ? node.loc.start.line - 1 : node.loc.start.line;
  		let exitLine = wrapped ? node.loc.end.line - 1 : node.loc.end.line;
      // get the name of the function
      let name = getFunctionName.call(this, node);
      if (name && node.body.type === 'BlockStatement') {
        // get function declaration
        let fd = node.source().slice(0, node.body.range[0] - node.range[0]);
        // get the function body
  			let fb = node.body.source().slice(1, node.body.source().length - 1);
        // if first line is wrapped, don't trace
        if (wrapped && node.loc.start.line === 1) {
          // console.log(node.body.source());
          return;
        }
        // create stack entry to be injected as first line of node function
        entry = util.format(
          ENTRY,
          JSON.stringify(filename),
          JSON.stringify(name),
          startLine
        );
        // create entry exit to be injected as last line of node function
        exit = util.format(
          EXIT,
          exitLine,
          'null'
        );
        // inject global entries into node function
        let nfb = `\n${entry}\n${fb}\n${exit}\n`;
        node.update(`${fd}{${nfb}}`);
      } else if (node.type === 'ReturnStatement') {
        // return statement could be returning a function, if so we will need to place
        // the tracer function after the argument
        if (node.argument) {
          var tmpVar = '__NodeContrastTmp' + Math.floor(Math.random() * 10000) + '__';
          exit = util.format(EXIT, startLine, node.argument.source() || 'null');
          node.update(`{\nvar ${tmpVar} = ${node.argument.source()};\n${exit}\nreturn ${tmpVar};\n}`);
        } else {
          // return statement has no argument
          exit = util.format(EXIT, startLine, 'null');
          node.update(`{${exit}${node.source()}}`);
        }
      } else if (node.type === 'CatchClause') {
        // catch the catch
        var c = node.body.source();
        // Remove the open and close braces "{}"
        c = c.slice(1, c.length - 1);
        node.body.update(`{\n${CATCH}\n${c}\n}`);
      }
    }).toString();
  }

}

module.exports = new Injector();

function getFunctionName(node) {
  // make sure node is a function
  if (!isFunction(node)) {
    return;
  }
  // if node has id, return name
  if (node.id) {
    return node.id.name;
  }
  // get name from anonymous FunctionExpression from parent
  let parent = node.parent;
  switch(parent.type) {
    case 'AssignmentExpression':
      if (parent.left.range) {
        return parent.left.source().replace(/"/g, '\\"');
      }
      break;
    case 'VariableDeclarator':
      return parent.id.name;
    case 'CallExpression':
      return parent.callee.id ? parent.callee.id.name : '[Anonymous]';
    default:
      if (typeof parent.length === 'number') {
        return parent.id ? parent.id.name : '[Anonymous]';
      } else if (parent.key && parent.key.type === 'Identifier' &&
        parent.value === node && parent.key.name) {
        return parent.key.name;
      }
  }
  // otherwise, return that it didn't find the function name
  return '[Anonymous]';
}

function isFunction(node) {
  return (
    (
      node.type === 'FunctionDeclaration'
      ||
      node.type === 'FunctionExpression'
      ||
      node.type === 'ArrowFunctionExpression'
    )
    &&
    node.range
  );
}

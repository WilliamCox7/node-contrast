// native node modules
const Module = require('module');
const path = require('path');

// required class objects
const Syringe = require('../lib').Syringe;

module.exports = () => {
  // save a reference to _compile for later use
  let compile = Module.prototype._compile;
  // restructure _compile function by injecting code onto the content string
  Module.prototype._compile = function(content, filename) {
    let wrapped = shouldWrapContent();
    if (wrapped) content = wrapContent(content);
    let displayPath = getDisplayPath(filename);
    // inject our global function calls into the source code
    content = Syringe.injectContrast(content, displayPath, wrapped);
    if (wrapped) content = unwrapContent(content);
    // use the reference we stored earlier to complete the normal compile process
    compile.call(this, content, filename);
  }
}

/** @function shouldWrapContent determine if the source code is encompassed by the module wrapper
  * @desc https://nodejs.org/api/modules.html#modules_the_module_wrapper
*/

function shouldWrapContent() {
  return Module.wrapper.length === 2;
}

/** @function wrapContent wrap the user's source code in the wrapper function
  * @desc Module.wrapper indices represent the start ([0]) and end ([1]) of the wrapper function
*/

function wrapContent(content) {
  return `${Module.wrapper[0]}\n${content}${Module.wrapper[1]}`;
}

/** @function getDisplayPath trim path for display in output
*/

function getDisplayPath(fn) {
  let pathArray = path.dirname(fn).split('/');
  return `/${pathArray[pathArray.length-1]}${fn.replace(path.dirname(fn), '')}`;
}

/** @function unwrapContent our reference to _compile will wrap the content, so we need to 'unwrap'
*/

function unwrapContent(content) {
  return content.substring(
    Module.wrapper[0].length, // remove the first x characters
    content.length - Module.wrapper[1].length // remove the last x characters
  );
}

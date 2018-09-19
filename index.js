// required class objects
const CallStack = require('./lib').CallStack;

// required private modules called by this class
const nodeContrastModules = require('./node_contrast_modules');
const commandeerModuleCompiler = nodeContrastModules.commandeerModuleCompiler;
const setContrastSolution = nodeContrastModules.setContrastSolution;

/** @class  NodeContrast this class creates an instance that will be used by the user's app
  * @method inject       Public method used to administer the "imaging contrast" to user's app
*/

module.exports = new class NodeContrast {

  inject() {
    this.callStack = CallStack;
    commandeerModuleCompiler.call(this);
    setContrastSolution.call(this);
  }

}

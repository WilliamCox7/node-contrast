/** @module    setContrastSolution           this registers global functions to be called by the user's code
  * @function  global.__NodeContrastEntry__  global function to be called at the beginning of every function
  * @function  global.__NodeContrastExit__   global function to be called at the end of every function
  * @function  global.__NodeContrastCatch__  global function to be called at the beginning of every catch clause
*/

module.exports = function() {
	var self = this;
	global.__NodeContrastEntry__ = (args) => self.callStack.push(args);
	global.__NodeContrastExit__ = (args) => self.callStack.pop(args);
	global.__NodeContrastCatch__ = (args) => self.callStack.catch(args);
};
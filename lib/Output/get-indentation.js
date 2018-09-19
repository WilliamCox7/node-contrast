/** @module getIndentation determines the length of the indent for formatting
*/

module.exports = (len) => {
  let indent = '';
  for (var i = 0; i < len; i++) {
    indent += '  ';
  }
  return indent;
}

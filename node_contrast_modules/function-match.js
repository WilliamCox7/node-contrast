var minimatch = require('minimatch');

/**
 * @module   functionMatch   checks if a filepath match the given patterns
 * @function processPatterns returns whether or not it matches the criteria given
*/

module.exports = (filepath, patterns) => {
	if (!patterns || !filepath) { return false; }
	if (!Array.isArray(patterns)) { patterns = [patterns]; }
	if (patterns.length === 0 || filepath.length === 0) { return []; }
	return processPatterns(patterns, filepath);
};

function processPatterns(patterns, filepath) {
	var match = false;
	patterns.forEach(function processPattern(pattern) {
		var exclusion = pattern.indexOf('!') === 0;
		var res = minimatch(filepath, pattern, {flipNegate: true, nocase: true});
		match = match || res;
		if (exclusion && res) { match = false; }
	});
	return match;
}

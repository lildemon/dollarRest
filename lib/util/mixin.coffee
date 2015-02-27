
empty = {}

module.exports = (dest) ->
	dest = {} unless dest
	`
	var i, l, source, name;
	for (i = 1, l = arguments.length; i < l; i += 1) {
		source = arguments[i];
		for (name in source) {
			if (!(name in dest) || (dest[name] !== source[name] && (!(name in empty) || empty[name] !== source[name]))) {
				dest[name] = source[name];
			}
		}
	}
	`
	dest
	
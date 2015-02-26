$ = require('jquery')

###
Normalize HTTP header names using the pseudo camel case.

For example:
	content-type         -> Content-Type
	accepts              -> Accepts
	x-custom-header-name -> X-Custom-Header-Name

@param {string} name the raw header name
@return {string} the normalized header name
###

exports.normalizeHeaderName = (name) ->
	nSplit = name.toLowerCase().split '-'
	$.map nSplit, (chunk) ->
		chunk.charAt(0).toUpperCase() + chunk.slice(1)
	.join '-'
	



interceptor = require('../interceptor')
$ = require('jquery')

module.exports = interceptor
	request: (request, config) ->
		$.extend request.ajaxConfig, 
			cache: false
		request

Q = require('q')
$ = require('jquery')
client = module.exports = require('./ajaxClient')

# builtin interceptors

#alert('hello')
mime = require('./interceptor/mime')

#client = client.wrap mime


window.client = client 
client('/test.json').done (res) ->
	console?.log res
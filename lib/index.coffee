Q = require('q')
$ = require('jquery')
client = module.exports = require('./ajaxClient')

# builtin interceptors
client.interceptors = {}
avaliableInterceptors = [
	'mime'
	'pathPrefix'
	'retry'
	'csrf'
	'noCache'
]

for interceptor in avaliableInterceptors
	client.interceptors[interceptor] = require('./interceptor/' + interceptor)

window.client = client 

mime = require('./interceptor/mime')
noCache = require('./interceptor/noCache')
client = client.wrap(mime).wrap(noCache)



client('/test.json').done (res) ->
	console?.log res
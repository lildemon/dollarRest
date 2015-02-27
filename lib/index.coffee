Q = require('q')
$ = require('jquery')
client = module.exports = require('./ajaxClient')

# builtin interceptors
client.interceptors = {}
for interceptor in ['mime', 'pathPrefix', 'retry']
	client.interceptors[interceptor] = require('./interceptor/' + interceptor)

#mime = require('./interceptor/mime')
#client = client.wrap mime


window.client = client 
client('/test.json').done (res) ->
	console?.log res
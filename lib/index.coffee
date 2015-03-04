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
	'timeout'
]

for interceptor in avaliableInterceptors
	client.interceptors[interceptor] = require('./interceptor/' + interceptor)

client.interceptors.mime.registry = require('./mime/registry')
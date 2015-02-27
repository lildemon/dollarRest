
responsePromise = require('./util/responsePromise')
client = require('./client')
Q = require('q')
ajaxClient = require('./ajaxClient')
$ = require('jquery')
mixin = require('./util/mixin')

defaultInitHandler = (config) ->
	config

defaultRequestHandler = (request, config, meta) ->
	request

defaultResponseHandler = (response, config, meta) ->
	response

race = (promisesOrValues) ->
	new Q.Promise (resolve, reject) ->
		$.each promisesOrValues, (promiseOrValue) ->
			Q(promiseOrValue).then resolve, reject

# when interceptor need to override client, response, etc..	
ComplexRequest = (properties) ->
	unless this instanceof ComplexRequest
		return new ComplexRequest properties
	mixin this, properties

interceptor = (handlers) ->
	handlers       = handlers or {}
	
	initHandler    = handlers.init or defaultInitHandler
	requestHandler = handlers.request or defaultRequestHandler
	successResponseHandler = handlers.success or handlers.response or defaultResponseHandler

	errorResponseHandler = handlers.error or ->
		# Propagate the rejection, with the result of the handler
		Q((handlers.response or defaultResponseHandler).apply(this, arguments)).then Q.reject, Q.reject

	return (target, config) ->
		# target is client being intercepted, config is being passed to custom handlers

		config = target if typeof target is 'object'
		unless typeof target is 'function'
			target = handlers.client or ajaxClient

		config = initHandler(config or {})

		interceptedClient = (request) ->
			context = {}
			# TODO meta's client don't have wrap behavior
			meta = 
				'arguments': Array.prototype.slice.call arguments
				client: interceptedClient

			# TODO $.ajax use url property instead of path?
			request = if typeof request is 'string' then {path: request} else (request or {})

			request.originator = request.originator or interceptedClient

			return responsePromise(
				requestHandler.call(context, request, config, meta),
				(request) ->
					next = target
					if request instanceof ComplexRequest
						# unpack request

						# a promise, use by timeout, response will be rejected by abort, see race()
						abort = request.abort 
						# client might be override by interceptor's request handler
						next = request.client or next
						response = request.response
						# normalize request, must be last
						request = request.request

					# if response got overriden, use it, otherwise get subsequence 'client' response
					# request that return from interceptor can even be a promise that got resolved
					response = response or Q(request).then((request) ->
						Q(next(request)).then (response) ->
							successResponseHandler.call context, response, config, meta
						, (response) ->
							errorResponseHandler.call context, response, config, meta
					)

					return if abort then race [response, abort] else response
				,

				(error) ->
					Q.reject
						request: request
						error: error

			)

		return client interceptedClient, target

interceptor.ComplexRequest = ComplexRequest

module.exports = interceptor


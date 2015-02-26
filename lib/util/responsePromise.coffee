Q = require('q')
misc = require('./misc')
$ = require('jquery')

property = (promise, name) ->
	promise.then (value) ->
		value?[name]
	, (value) ->
		Q.reject value?[name]

entity = ->
	property this, 'entity'

status = ->
	property property(this, 'status'), 'code'

headers = ->
	property this, 'headers'

# Obtain a specific normalized header
header = (headerName) ->
	headerName = misc.normalizeHeaderName headerName
	property @headers(), headerName

###
Follow a related resource

The relationship to follow may be define as a plain string, an object
with the rel and params, or an array containing one or more entries
with the previous forms.

Examples:
response.follow('next')

response.follow({ rel: 'next', params: { pageSize: 100 } })

response.follow([
   { rel: 'items', params: { projection: 'noImages' } },
   'search',
   { rel: 'findByGalleryIsNull', params: { projection: 'noImages' } },
   'items'
])

@param {String|Object|Array} rels one, or more, relationships to follow
@returns ResponsePromise<Response> related resource
###

follow = (rels) ->
	# TODO: use Array.reduce for supported environment
	# TIP: use when.reduce, the returned promise will get resolved then call next accumulator
	accumedResp = this
	rels = [].concat rels
	$.each rels, (i, rel) ->
		rel = { rel: rel } if typeof rel is 'string'
		accumedResp = accumedResp.then (resp) ->
			if typeof resp.entity.clientFor isnt 'function'
				throw new Error 'Hypermedia response expected'
			client = resp.entity.clientFor(rel.rel)
			# return new client request promise is important
			client
				params: rel.params

	# when.reduce counterpart will return default promise, not ResponsePromise, so 'make accumedResp' is required, but not in this case
	accumedResp

###
Wrap a Promise as an ResponsePromise

@param {Promise<Response>} promise the promise for an HTTP Response
@returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods
###

make = (promise) ->
	promise.status = status
	promise.headers = headers
	promise.header = header
	promise.entity = entity
	promise.follow = follow
	promise

responsePromise = (val, thens...)->
	# Q.Promise.resolve == Q ~= Promise.resolve
	p = Q(val)
	make p.then.apply p, thens

responsePromise.make = make

response.Promise.reject = (val) ->
	make Q.reject val

responsePromise.promise = (func) ->
	make Q.Promise func

responsePromise
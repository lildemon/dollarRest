$ = require('jquery')
Q = require('q')
client = require('./client')

UrlBuilder = require('./UrlBuilder')
misc = require('./util/misc')
normalizeHeaderName = misc.normalizeHeaderName
responsePromise = require('./util/responsePromise')

# according to the spec, the line break is '\r\n', but doesn't hold true in practice
headerSplitRE = /[\r|\n]+/

parseHeaders = (raw) ->
	# parse response headers, note Set-Cookie will be removed by the browser
	headers = {}
	return headers unless raw

	$.each $.trim(raw).split(headerSplitRE), (i, header) ->
		boundary = header.indexOf ':'
		name = normalizeHeaderName $.trim(header.substring(0, boundary))
		value = $.trim(header.substring boundary + 1)

		if headers[name]
			if $.isArray headers[name]
				# add to an existing array
				headers[name].push value
			else
				# convert single value to array
				headers[name] = [headers[name], value]
		else
			headers[name] = value

	headers

module.exports = client (request) ->
	return responsePromise.promise (resolve, reject) ->
		# TODO make request $.ajax useful
		request = if typeof request is 'string' then { path: request } else request or {}
		response = {request: request}

		if request.canceled
			response.error = 'precanceled'
			reject response
			return

		# TODO binary entity?
		entity = request.entity
		request.method = request.method or (if entity then 'POST' else 'GET')
		method = request.method

		url = new UrlBuilder(request.path || '', request.params).build()

		

		headers = request.headers
		
		request.canceled = false
		request.cancel = ->
			request.canceled = true
			response.raw.abort()
			reject response

		stateDone = ->
			try
				response.status =
					code: response.raw.status
					text: response.raw.statusText
				response.headers = parseHeaders response.raw.getAllResponseHeaders()
				# http://www.html5rocks.com/zh/tutorials/file/xhr2/
				# xhr2 “text”、“arraybuffer”、“blob”或“document” use xhrClient.response
			catch e
				#

		ajaxConfig = 
			url: url
			type: method
			processData: false
			contentType: false
			data: entity
			#mimeType: null # zepto: mimeType (default: none): override the MIME type of the response
			xhrFields: request.mixin

			# TODO better define zepto and jquery's content-type header override behavior, using 'text' for zepto cause zepto to override Content-Type header with which mime intercepter won't get the actual one from server
			dataType: if $.zepto then 'raw' else 'text' # use mime intercepter, $.ajax currently only handles text response
			beforeSend: (xhr, settings) ->
				response.raw = xhr
				for headerName, val of headers
					if headerName is 'Content-Type' and val is 'multipart/form-data'
						# XMLHttpRequest generates its own Content-Type header with the
						# appropriate multipart boundary when sending multipart/form-data.
						continue
					xhr.setRequestHeader headerName, val

			success: (data, status, xhr) ->
				return if request.canceled
				stateDone()
				response.entity = data
				resolve response

			error: (xhr, errorType, error) ->
				return if request.canceled
				stateDone()
				response.error = errorType
				reject response


		# extend ajax behavior
		# timeout, cache, jsonp, auth, etc..
		$.extend(ajaxConfig, request.ajaxConfig)

		$.ajax ajaxConfig
			

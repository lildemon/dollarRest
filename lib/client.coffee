
module.exports = (impl, target) ->
	if target
		impl.skip = ->
			target

	impl.wrap = (interceptor, config) ->
		interceptor impl, config

	impl
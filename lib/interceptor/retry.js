/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Jeremy Grelle
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var interceptor, Q;

		interceptor = require('../interceptor');
		Q = require('q');

		/**
		 * Retries a rejected request using an exponential backoff.
		 *
		 * Defaults to an initial interval of 100ms, a multiplier of 2, and no max interval.
		 *
		 * @param {Client} [client] client to wrap
		 * @param {number} [config.intial=100] initial interval in ms
		 * @param {number} [config.multiplier=2] interval multiplier
		 * @param {number} [config.max] max interval in ms
		 *
		 * @returns {Client}
		 */
		return interceptor({
			init: function (config) {
				config.initial = config.initial || 100;
				config.multiplier = config.multiplier || 2;
				config.max = config.max || Infinity;
				return config;
			},
			error: function (response, config, meta) {
				var request;

				request = response.request;
				request.retry = request.retry || config.initial;

				return Q(request).delay(request.retry).then(function (request) {
					if (request.canceled) {
						// cancel here in case client doesn't check canceled flag
						return Q.reject({ request: request, error: 'precanceled' });
					}
					request.retry = Math.min(request.retry * config.multiplier, config.max);

					// NOTICE request是经过之前的inetrceptor所构造好的了，所以这里不需要从request.originator重新开始
					return meta.client(request);
				});
			}
		});
	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
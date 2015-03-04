(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Q"), require("$"));
	else if(typeof define === 'function' && define.amd)
		define(["Q", "$"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("Q"), require("$")) : factory(root["Q"], root["$"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packed/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $, Q, avaliableInterceptors, client, interceptor, mime, noCache, _i, _len;

	Q = __webpack_require__(1);

	$ = __webpack_require__(2);

	client = module.exports = __webpack_require__(3);

	client.interceptors = {};

	avaliableInterceptors = ['mime', 'pathPrefix', 'retry', 'csrf', 'noCache'];

	for (_i = 0, _len = avaliableInterceptors.length; _i < _len; _i++) {
	  interceptor = avaliableInterceptors[_i];
	  client.interceptors[interceptor] = __webpack_require__(4)("./" + interceptor);
	}

	window.client = client;

	mime = __webpack_require__(5);

	noCache = __webpack_require__(6);

	client = client.wrap(mime).wrap(noCache);

	client('/test.json').done(function(res) {
	  return typeof console !== "undefined" && console !== null ? console.log(res) : void 0;
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $, Q, UrlBuilder, client, headerSplitRE, misc, normalizeHeaderName, parseHeaders, responsePromise;

	$ = __webpack_require__(2);

	Q = __webpack_require__(1);

	client = __webpack_require__(7);

	UrlBuilder = __webpack_require__(8);

	misc = __webpack_require__(16);

	normalizeHeaderName = misc.normalizeHeaderName;

	responsePromise = __webpack_require__(17);

	headerSplitRE = /[\r|\n]+/;

	parseHeaders = function(raw) {
	  var headers;
	  headers = {};
	  if (!raw) {
	    return headers;
	  }
	  $.each($.trim(raw).split(headerSplitRE), function(i, header) {
	    var boundary, name, value;
	    boundary = header.indexOf(':');
	    name = normalizeHeaderName($.trim(header.substring(0, boundary)));
	    value = $.trim(header.substring(boundary + 1));
	    if (headers[name]) {
	      if ($.isArray(headers[name])) {
	        return headers[name].push(value);
	      } else {
	        return headers[name] = [headers[name], value];
	      }
	    } else {
	      return headers[name] = value;
	    }
	  });
	  return headers;
	};

	module.exports = client(function(request) {
	  return responsePromise.promise(function(resolve, reject) {
	    var ajaxConfig, entity, headers, method, response, stateDone, url;
	    request = typeof request === 'string' ? {
	      path: request
	    } : request || {};
	    response = {
	      request: request
	    };
	    if (request.canceled) {
	      response.error = 'precanceled';
	      reject(response);
	      return;
	    }
	    entity = request.entity;
	    request.method = request.method || (entity ? 'POST' : 'GET');
	    method = request.method;
	    url = new UrlBuilder(request.path || '', request.params).build();
	    headers = request.headers;
	    request.canceled = false;
	    request.cancel = function() {
	      request.canceled = true;
	      response.raw.abort();
	      return reject(response);
	    };
	    stateDone = function() {
	      var e;
	      try {
	        response.status = {
	          code: response.raw.status,
	          text: response.raw.statusText
	        };
	        return response.headers = parseHeaders(response.raw.getAllResponseHeaders());
	      } catch (_error) {
	        e = _error;
	      }
	    };
	    ajaxConfig = {
	      url: url,
	      type: method,
	      processData: false,
	      contentType: false,
	      data: entity,
	      xhrFields: request.mixin,
	      dataType: $.zepto ? 'raw' : 'text',
	      beforeSend: function(xhr, settings) {
	        var headerName, val, _results;
	        response.raw = xhr;
	        _results = [];
	        for (headerName in headers) {
	          val = headers[headerName];
	          if (headerName === 'Content-Type' && val === 'multipart/form-data') {
	            continue;
	          }
	          _results.push(xhr.setRequestHeader(headerName, val));
	        }
	        return _results;
	      },
	      success: function(data, status, xhr) {
	        if (request.canceled) {
	          return;
	        }
	        stateDone();
	        response.entity = data;
	        return resolve(response);
	      },
	      error: function(xhr, errorType, error) {
	        if (request.canceled) {
	          return;
	        }
	        stateDone();
	        response.error = errorType;
	        return reject(response);
	      }
	    };
	    $.extend(ajaxConfig, request.ajaxConfig);
	    return $.ajax(ajaxConfig);
	  });
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./basicAuth": 9,
		"./basicAuth.coffee": 9,
		"./csrf": 10,
		"./csrf.js": 10,
		"./errorCode": 11,
		"./errorCode.js": 11,
		"./jsonp": 12,
		"./jsonp.coffee": 12,
		"./mime": 5,
		"./mime.js": 5,
		"./noCache": 6,
		"./noCache.coffee": 6,
		"./pathPrefix": 13,
		"./pathPrefix.js": 13,
		"./retry": 14,
		"./retry.js": 14,
		"./timeout": 15,
		"./timeout.coffee": 15
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 4;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2014 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var interceptor, mime, registry, noopConverter, Q;

			interceptor = __webpack_require__(18);
			mime = __webpack_require__(19);
			registry = __webpack_require__(20);
			Q = __webpack_require__(1);

			noopConverter = {
				read: function (obj) { return obj; },
				write: function (obj) { return obj; }
			};

			/**
			 * MIME type support for request and response entities.  Entities are
			 * (de)serialized using the converter for the MIME type.
			 *
			 * Request entities are converted using the desired converter and the
			 * 'Accept' request header prefers this MIME.
			 *
			 * Response entities are converted based on the Content-Type response header.
			 *
			 * @param {Client} [client] client to wrap
			 * @param {string} [config.mime='text/plain'] MIME type to encode the request
			 *   entity
			 * @param {string} [config.accept] Accept header for the request
			 * @param {Client} [config.client=<request.originator>] client passed to the
			 *   converter, defaults to the client originating the request
			 * @param {Registry} [config.registry] MIME registry, defaults to the root
			 *   registry
			 * @param {boolean} [config.permissive] Allow an unkown request MIME type
			 *
			 * @returns {Client}
			 */
			return interceptor({
				init: function (config) {
					config.registry = config.registry || registry;
					return config;
				},
				request: function (request, config) {
					var type, headers;

					headers = request.headers || (request.headers = {});
					type = mime.parse(headers['Content-Type'] = headers['Content-Type'] || config.mime || 'text/plain');
					headers.Accept = headers.Accept || config.accept || type.raw + ', application/json;q=0.8, text/plain;q=0.5, */*;q=0.2';

					if (!('entity' in request)) {
						return request;
					}

					return config.registry.lookup(type).fail(function () {
						// failed to resolve converter
						if (config.permissive) {
							return noopConverter;
						}
						throw 'mime-unknown';
					}).then(function (converter) {
						var client = config.client || request.originator;

						return Q.fcall(converter.write, request.entity, { client: client, request: request, mime: type, registry: config.registry })
							.fail(function() {
								throw 'mime-serialization';
							})
							.then(function(entity) {
								request.entity = entity;
								return request;
							});
					});
				},
				response: function (response, config) {
					if (!(response.headers && response.headers['Content-Type'] && response.entity)) {
						return response;
					}

					var type = mime.parse(response.headers['Content-Type']);

					return config.registry.lookup(type).fail(function () { return noopConverter; }).then(function (converter) {
						var client = config.client || response.request && response.request.originator;

						return Q.fcall(converter.read, response.entity, { client: client, response: response, mime: type, registry: config.registry })
							.fail(function (e) {
								response.error = 'mime-deserialization';
								response.cause = e;
								throw response;
							})
							.then(function (entity) {
								response.entity = entity;
								return response;
							});
					});
				}
			});

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var $, interceptor;

	interceptor = __webpack_require__(18);

	$ = __webpack_require__(2);

	module.exports = interceptor({
	  request: function(request, config) {
	    $.extend(request.ajaxConfig, {
	      cache: false
	    });
	    return request;
	  }
	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(impl, target) {
	  if (target) {
	    impl.skip = function() {
	      return target;
	    };
	  }
	  impl.wrap = function(interceptor, config) {
	    return interceptor(impl, config);
	  };
	  return impl;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2013 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define, location) {
		'use strict';

		var undef;

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var mixin, origin, urlRE, absoluteUrlRE, fullyQualifiedUrlRE;

			mixin = __webpack_require__(21);

			urlRE = /([a-z][a-z0-9\+\-\.]*:)\/\/([^@]+@)?(([^:\/]+)(:([0-9]+))?)?(\/[^?#]*)?(\?[^#]*)?(#\S*)?/i;
			absoluteUrlRE = /^([a-z][a-z0-9\-\+\.]*:\/\/|\/)/i;
			fullyQualifiedUrlRE = /([a-z][a-z0-9\+\-\.]*:)\/\/([^@]+@)?(([^:\/]+)(:([0-9]+))?)?\//i;

			/**
			 * Apply params to the template to create a URL.
			 *
			 * Parameters that are not applied directly to the template, are appended
			 * to the URL as query string parameters.
			 *
			 * @param {string} template the URI template
			 * @param {Object} params parameters to apply to the template
			 * @return {string} the resulting URL
			 */
			function buildUrl(template, params) {
				// internal builder to convert template with params.
				var url, name, queryStringParams, re;

				url = template;
				queryStringParams = {};

				if (params) {
					for (name in params) {
						/*jshint forin:false */
						re = new RegExp('\\{' + name + '\\}');
						if (re.test(url)) {
							url = url.replace(re, encodeURIComponent(params[name]), 'g');
						}
						else {
							queryStringParams[name] = params[name];
						}
					}
					for (name in queryStringParams) {
						url += url.indexOf('?') === -1 ? '?' : '&';
						url += encodeURIComponent(name);
						if (queryStringParams[name] !== null && queryStringParams[name] !== undefined) {
							url += '=';
							url += encodeURIComponent(queryStringParams[name]);
						}
					}
				}
				return url;
			}

			function startsWith(str, test) {
				return str.indexOf(test) === 0;
			}

			/**
			 * Create a new URL Builder
			 *
			 * @param {string|UrlBuilder} template the base template to build from, may be another UrlBuilder
			 * @param {Object} [params] base parameters
			 * @constructor
			 */
			function UrlBuilder(template, params) {
				if (!(this instanceof UrlBuilder)) {
					// invoke as a constructor
					return new UrlBuilder(template, params);
				}

				if (template instanceof UrlBuilder) {
					this._template = template.template;
					this._params = mixin({}, this._params, params);
				}
				else {
					this._template = (template || '').toString();
					this._params = params || {};
				}
			}

			UrlBuilder.prototype = {

				/**
				 * Create a new UrlBuilder instance that extends the current builder.
				 * The current builder is unmodified.
				 *
				 * @param {string} [template] URL template to append to the current template
				 * @param {Object} [params] params to combine with current params.  New params override existing params
				 * @return {UrlBuilder} the new builder
				 */
				append: function (template,  params) {
					// TODO consider query strings and fragments
					return new UrlBuilder(this._template + template, mixin({}, this._params, params));
				},

				/**
				 * Create a new UrlBuilder with a fully qualified URL based on the
				 * window's location or base href and the current templates relative URL.
				 *
				 * Path variables are preserved.
				 *
				 * *Browser only*
				 *
				 * @return {UrlBuilder} the fully qualified URL template
				 */
				fullyQualify: function () {
					if (!location) { return this; }
					if (this.isFullyQualified()) { return this; }

					var template = this._template;

					if (startsWith(template, '//')) {
						template = origin.protocol + template;
					}
					else if (startsWith(template, '/')) {
						template = origin.origin + template;
					}
					else if (!this.isAbsolute()) {
						template = origin.origin + origin.pathname.substring(0, origin.pathname.lastIndexOf('/') + 1);
					}

					if (template.indexOf('/', 8) === -1) {
						// default the pathname to '/'
						template = template + '/';
					}

					return new UrlBuilder(template, this._params);
				},

				/**
				 * True if the URL is absolute
				 *
				 * @return {boolean}
				 */
				isAbsolute: function () {
					return absoluteUrlRE.test(this.build());
				},

				/**
				 * True if the URL is fully qualified
				 *
				 * @return {boolean}
				 */
				isFullyQualified: function () {
					return fullyQualifiedUrlRE.test(this.build());
				},

				/**
				 * True if the URL is cross origin. The protocol, host and port must not be
				 * the same in order to be cross origin,
				 *
				 * @return {boolean}
				 */
				isCrossOrigin: function () {
					if (!origin) {
						return true;
					}
					var url = this.parts();
					return url.protocol !== origin.protocol ||
					       url.hostname !== origin.hostname ||
					       url.port !== origin.port;
				},

				/**
				 * Split a URL into its consituent parts following the naming convention of
				 * 'window.location'. One difference is that the port will contain the
				 * protocol default if not specified.
				 *
				 * @see https://developer.mozilla.org/en-US/docs/DOM/window.location
				 *
				 * @returns {Object} a 'window.location'-like object
				 */
				parts: function () {
					/*jshint maxcomplexity:20 */
					var url, parts;
					url = this.fullyQualify().build().match(urlRE);
					parts = {
						href: url[0],
						protocol: url[1],
						host: url[3] || '',
						hostname: url[4] || '',
						port: url[6],
						pathname: url[7] || '',
						search: url[8] || '',
						hash: url[9] || ''
					};
					parts.origin = parts.protocol + '//' + parts.host;
					parts.port = parts.port || (parts.protocol === 'https:' ? '443' : parts.protocol === 'http:' ? '80' : '');
					return parts;
				},

				/**
				 * Expand the template replacing path variables with parameters
				 *
				 * @param {Object} [params] params to combine with current params.  New params override existing params
				 * @return {string} the expanded URL
				 */
				build: function (params) {
					return buildUrl(this._template, mixin({}, this._params, params));
				},

				/**
				 * @see build
				 */
				toString: function () {
					return this.build();
				}

			};

			origin = location ? new UrlBuilder(location.href).parts() : undef;

			return UrlBuilder;
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22),
		typeof window !== 'undefined' ? window.location : void 0
		// Boilerplate for AMD and Node
	));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2013 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var interceptor;

			interceptor = __webpack_require__(18);

			/**
			 * Applies a Cross-Site Request Forgery protection header to a request
			 *
			 * CSRF protection helps a server verify that a request came from a 
			 * trusted  client and not another client that was able to masquerade
			 * as an authorized client. Sites that use cookie based authentication
			 * are particularly vulnerable to request forgeries without extra
			 * protection.
			 *
			 * @see http://en.wikipedia.org/wiki/Cross-site_request_forgery
			 *
			 * @param {Client} [client] client to wrap
			 * @param {string} [config.name='X-Csrf-Token'] name of the request
			 *   header, may be overridden by `request.csrfTokenName`
			 * @param {string} [config.token] CSRF token, may be overridden by
			 *   `request.csrfToken`
			 *
			 * @returns {Client}
			 */
			return interceptor({
				init: function (config) {
					config.name = config.name || 'X-Csrf-Token';
					return config;
				},
				request: function handleRequest(request, config) {
					var headers, name, token;

					headers = request.headers || (request.headers = {});
					name = request.csrfTokenName || config.name;
					token = request.csrfToken || config.token;

					if (token) {
						headers[name] = token;
					}

					return request;
				}
			});

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2013 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var interceptor, q;

			interceptor = __webpack_require__(18);
			Q = __webpack_require__(1);

			/**
			 * Rejects the response promise based on the status code.
			 *
			 * Codes greater than or equal to the provided value are rejected.  Default
			 * value 400.
			 *
			 * @param {Client} [client] client to wrap
			 * @param {number} [config.code=400] code to indicate a rejection
			 *
			 * @returns {Client}
			 */
			return interceptor({
				init: function (config) {
					config.code = config.code || 400;
					return config;
				},
				response: function (response, config) {
					if (response.status && response.status.code >= config.code) {
						return Q.reject(response);
					}
					return response;
				}
			});

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2013 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var interceptor, UrlBuilder;

			interceptor = __webpack_require__(18);
			UrlBuilder = __webpack_require__(8);

			function startsWith(str, prefix) {
				return str.indexOf(prefix) === 0;
			}

			function endsWith(str, suffix) {
				return str.lastIndexOf(suffix) + suffix.length === str.length;
			}

			/**
			 * Prefixes the request path with a common value.
			 *
			 * @param {Client} [client] client to wrap
			 * @param {number} [config.prefix] path prefix
			 *
			 * @returns {Client}
			 */
			return interceptor({
				request: function (request, config) {
					var path;

					if (config.prefix && !(new UrlBuilder(request.path).isFullyQualified())) {
						path = config.prefix;
						if (request.path) {
							if (!endsWith(path, '/') && !startsWith(request.path, '/')) {
								// add missing '/' between path sections
								path += '/';
							}
							path += request.path;
						}
						request.path = path;
					}

					return request;
				}
			});

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2014 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Jeremy Grelle
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var interceptor, Q;

			interceptor = __webpack_require__(18);
			Q = __webpack_require__(1);

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
						return meta.client(request);
					});
				}
			});
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var $;

	$ = __webpack_require__(2);


	/*
	Normalize HTTP header names using the pseudo camel case.

	For example:
		content-type         -> Content-Type
		accepts              -> Accepts
		x-custom-header-name -> X-Custom-Header-Name

	@param {string} name the raw header name
	@return {string} the normalized header name
	 */

	exports.normalizeHeaderName = function(name) {
	  var nSplit;
	  nSplit = name.toLowerCase().split('-');
	  return $.map(nSplit, function(chunk) {
	    return chunk.charAt(0).toUpperCase() + chunk.slice(1);
	  }).join('-');
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var $, Q, entity, follow, header, headers, make, misc, property, responsePromise, status,
	  __slice = [].slice;

	Q = __webpack_require__(1);

	misc = __webpack_require__(16);

	$ = __webpack_require__(2);

	property = function(promise, name) {
	  return promise.then(function(value) {
	    return value != null ? value[name] : void 0;
	  }, function(value) {
	    return Q.reject(value != null ? value[name] : void 0);
	  });
	};

	entity = function() {
	  return property(this, 'entity');
	};

	status = function() {
	  return property(property(this, 'status'), 'code');
	};

	headers = function() {
	  return property(this, 'headers');
	};

	header = function(headerName) {
	  headerName = misc.normalizeHeaderName(headerName);
	  return property(this.headers(), headerName);
	};


	/*
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
	 */

	follow = function(rels) {
	  var accumedResp;
	  accumedResp = this;
	  rels = [].concat(rels);
	  $.each(rels, function(i, rel) {
	    if (typeof rel === 'string') {
	      rel = {
	        rel: rel
	      };
	    }
	    return accumedResp = accumedResp.then(function(resp) {
	      var client;
	      if (typeof resp.entity.clientFor !== 'function') {
	        throw new Error('Hypermedia response expected');
	      }
	      client = resp.entity.clientFor(rel.rel);
	      return client({
	        params: rel.params
	      });
	    });
	  });
	  return make(accumedResp);
	};


	/*
	Wrap a Promise as an ResponsePromise

	@param {Promise<Response>} promise the promise for an HTTP Response
	@returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods
	 */

	make = function(promise) {
	  promise.status = status;
	  promise.headers = headers;
	  promise.header = header;
	  promise.entity = entity;
	  promise.follow = follow;
	  return promise;
	};

	responsePromise = module.exports = function() {
	  var p, thens, val;
	  val = arguments[0], thens = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	  p = Q(val);
	  return make(p.then.apply(p, thens));
	};

	responsePromise.make = make;

	responsePromise.reject = function(val) {
	  return make(Q.reject(val));
	};

	responsePromise.promise = function(func) {
	  return make(Q.Promise(func));
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var $, ComplexRequest, Q, ajaxClient, client, defaultInitHandler, defaultRequestHandler, defaultResponseHandler, interceptor, mixin, race, responsePromise;

	responsePromise = __webpack_require__(17);

	client = __webpack_require__(7);

	Q = __webpack_require__(1);

	ajaxClient = __webpack_require__(3);

	$ = __webpack_require__(2);

	mixin = __webpack_require__(21);

	defaultInitHandler = function(config) {
	  return config;
	};

	defaultRequestHandler = function(request, config, meta) {
	  return request;
	};

	defaultResponseHandler = function(response, config, meta) {
	  return response;
	};

	race = function(promisesOrValues) {
	  return new Q.Promise(function(resolve, reject) {
	    return $.each(promisesOrValues, function(promiseOrValue) {
	      return Q(promiseOrValue).then(resolve, reject);
	    });
	  });
	};

	ComplexRequest = function(properties) {
	  if (!(this instanceof ComplexRequest)) {
	    return new ComplexRequest(properties);
	  }
	  return mixin(this, properties);
	};

	interceptor = function(handlers) {
	  var errorResponseHandler, initHandler, requestHandler, successResponseHandler;
	  handlers = handlers || {};
	  initHandler = handlers.init || defaultInitHandler;
	  requestHandler = handlers.request || defaultRequestHandler;
	  successResponseHandler = handlers.success || handlers.response || defaultResponseHandler;
	  errorResponseHandler = handlers.error || function() {
	    return Q((handlers.response || defaultResponseHandler).apply(this, arguments)).then(Q.reject, Q.reject);
	  };
	  return function(target, config) {
	    var interceptedClient;
	    if (typeof target === 'object') {
	      config = target;
	    }
	    if (typeof target !== 'function') {
	      target = handlers.client || ajaxClient;
	    }
	    config = initHandler(config || {});
	    interceptedClient = function(request) {
	      var context, meta;
	      context = {};
	      meta = {
	        'arguments': Array.prototype.slice.call(arguments),
	        client: interceptedClient
	      };
	      request = typeof request === 'string' ? {
	        path: request
	      } : request || {};
	      request.originator = request.originator || interceptedClient;
	      request.ajaxConfig = request.ajaxConfig || {};
	      return responsePromise(requestHandler.call(context, request, config, meta), function(request) {
	        var abort, next, response;
	        next = target;
	        if (request instanceof ComplexRequest) {
	          abort = request.abort;
	          next = request.client || next;
	          response = request.response;
	          request = request.request;
	        }
	        response = response || Q(request).then(function(request) {
	          return Q(next(request)).then(function(response) {
	            return successResponseHandler.call(context, response, config, meta);
	          }, function(response) {
	            return errorResponseHandler.call(context, response, config, meta);
	          });
	        });
	        if (abort) {
	          return race([response, abort]);
	        } else {
	          return response;
	        }
	      }, function(error) {
	        return Q.reject({
	          request: request,
	          error: error
	        });
	      });
	    };
	    return client(interceptedClient, target);
	  };
	};

	interceptor.ComplexRequest = ComplexRequest;

	module.exports = interceptor;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	* Copyright 2014 the original author or authors
	* @license MIT, see LICENSE.txt for details
	*
	* @author Scott Andrews
	*/

	(function (define) {
		'use strict';

		var undef;

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (/* require */) {

			/**
			 * Parse a MIME type into it's constituent parts
			 *
			 * @param {string} mime MIME type to parse
			 * @return {{
			 *   {string} raw the original MIME type
			 *   {string} type the type and subtype
			 *   {string} [suffix] mime suffix, including the plus, if any
			 *   {Object} params key/value pair of attributes
			 * }}
			 */
			function parse(mime) {
				var params, type;

				params = mime.split(';');
				type = params[0].trim().split('+');

				return {
					raw: mime,
					type: type[0],
					suffix: type[1] ? '+' + type[1] : '',
					params: params.slice(1).reduce(function (params, pair) {
						pair = pair.split('=');
						params[pair[0].trim()] = pair[1] ? pair[1].trim() : undef;
						return params;
					}, {})
				};
			}

			return {
				parse: parse
			};

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2014 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

			var mime, Q, registry;

			mime = __webpack_require__(19);
			Q = __webpack_require__(1);

			function Registry(mimes) {

				/**
				 * Lookup the converter for a MIME type
				 *
				 * @param {string} type the MIME type
				 * @return a promise for the converter
				 */
				this.lookup = function lookup(type) {
					var parsed;

					parsed = typeof type === 'string' ? mime.parse(type) : type;

					if (mimes[parsed.raw]) {
						return mimes[parsed.raw];
					}
					if (mimes[parsed.type + parsed.suffix]) {
						return mimes[parsed.type + parsed.suffix];
					}
					if (mimes[parsed.type]) {
						return mimes[parsed.type];
					}
					if (mimes[parsed.suffix]) {
						return mimes[parsed.suffix];
					}

					return Q.reject(new Error('Unable to locate converter for mime "' + parsed.raw + '"'));
				};

				/**
				 * Create a late dispatched proxy to the target converter.
				 *
				 * Common when a converter is registered under multiple names and
				 * should be kept in sync if updated.
				 *
				 * @param {string} type mime converter to dispatch to
				 * @returns converter whose read/write methods target the desired mime converter
				 */
				this.delegate = function delegate(type) {
					return {
						read: function () {
							var args = arguments;
							return this.lookup(type).then(function (converter) {
								return converter.read.apply(this, args);
							}.bind(this));
						}.bind(this),
						write: function () {
							var args = arguments;
							return this.lookup(type).then(function (converter) {
								return converter.write.apply(this, args);
							}.bind(this));
						}.bind(this)
					};
				};

				/**
				 * Register a custom converter for a MIME type
				 *
				 * @param {string} type the MIME type
				 * @param converter the converter for the MIME type
				 * @return a promise for the converter
				 */
				this.register = function register(type, converter) {
					mimes[type] = Q(converter);
					return mimes[type];
				};

				/**
				 * Create a child registry whoes registered converters remain local, while
				 * able to lookup converters from its parent.
				 *
				 * @returns child MIME registry
				 */
				this.child = function child() {
					return new Registry(Object.create(mimes));
				};

			}

			registry = new Registry({});

			// include provided serializers
			// TODO: hal support disabled
			//registry.register('application/hal', require('./type/application/hal'));
			registry.register('application/json', __webpack_require__(23));
			registry.register('application/x-www-form-urlencoded', __webpack_require__(24));
			registry.register('multipart/form-data', __webpack_require__(25));
			registry.register('text/plain', __webpack_require__(26));

			registry.register('+json', registry.delegate('application/json'));

			return registry;

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var empty;

	empty = {};

	module.exports = function(dest) {
	  if (!dest) {
	    dest = {};
	  }
	  
		var i, l, source, name;
		for (i = 1, l = arguments.length; i < l; i += 1) {
			source = arguments[i];
			for (name in source) {
				if (!(name in dest) || (dest[name] !== source[name] && (!(name in empty) || empty[name] !== source[name]))) {
					dest[name] = source[name];
				}
			}
		}
		;
	  return dest;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012-2015 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (/* require */) {

			/**
			 * Create a new JSON converter with custom reviver/replacer.
			 *
			 * The extended converter must be published to a MIME registry in order
			 * to be used. The existing converter will not be modified.
			 *
			 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
			 *
			 * @param {function} [reviver=undefined] custom JSON.parse reviver
			 * @param {function|Array} [replacer=undefined] custom JSON.stringify replacer
			 */
			function createConverter(reviver, replacer) {
				return {

					read: function (str) {
						return JSON.parse(str, reviver);
					},

					write: function (obj) {
						return JSON.stringify(obj, replacer);
					},

					extend: createConverter

				};
			}

			return createConverter();

		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (/* require */) {

			var encodedSpaceRE, urlEncodedSpaceRE;

			encodedSpaceRE = /%20/g;
			urlEncodedSpaceRE = /\+/g;

			function urlEncode(str) {
				str = encodeURIComponent(str);
				// spec says space should be encoded as '+'
				return str.replace(encodedSpaceRE, '+');
			}

			function urlDecode(str) {
				// spec says space should be encoded as '+'
				str = str.replace(urlEncodedSpaceRE, ' ');
				return decodeURIComponent(str);
			}

			function append(str, name, value) {
				if (Array.isArray(value)) {
					value.forEach(function (value) {
						str = append(str, name, value);
					});
				}
				else {
					if (str.length > 0) {
						str += '&';
					}
					str += urlEncode(name);
					if (value !== undefined && value !== null) {
						str += '=' + urlEncode(value);
					}
				}
				return str;
			}

			return {

				read: function (str) {
					var obj = {};
					str.split('&').forEach(function (entry) {
						var pair, name, value;
						pair = entry.split('=');
						name = urlDecode(pair[0]);
						if (pair.length === 2) {
							value = urlDecode(pair[1]);
						}
						else {
							value = null;
						}
						if (name in obj) {
							if (!Array.isArray(obj[name])) {
								// convert to an array, perserving currnent value
								obj[name] = [obj[name]];
							}
							obj[name].push(value);
						}
						else {
							obj[name] = value;
						}
					});
					return obj;
				},

				write: function (obj) {
					var str = '';
					Object.keys(obj).forEach(function (name) {
						str = append(str, name, obj[name]);
					});
					return str;
				}

			};
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2014 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Michael Jackson
	 */

	/* global FormData, File, Blob */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (/* require */) {

			function isFormElement(object) {
				return object &&
					object.nodeType === 1 && // Node.ELEMENT_NODE
					object.tagName === 'FORM';
			}

			function createFormDataFromObject(object) {
				var formData = new FormData();

				var value;
				for (var property in object) {
					if (object.hasOwnProperty(property)) {
						value = object[property];

						if (value instanceof File) {
							formData.append(property, value, value.name);
						} else if (value instanceof Blob) {
							formData.append(property, value);
						} else {
							formData.append(property, String(value));
						}
					}
				}

				return formData;
			}

			return {

				write: function (object) {
					if (typeof FormData === 'undefined') {
						throw new Error('The multipart/form-data mime serializer requires FormData support');
					}

					// Support FormData directly.
					if (object instanceof FormData) {
						return object;
					}

					// Support <form> elements.
					if (isFormElement(object)) {
						return new FormData(object);
					}

					// Support plain objects, may contain File/Blob as value.
					if (typeof object === 'object' && object !== null) {
						return createFormDataFromObject(object);
					}

					throw new Error('Unable to create FormData from object ' + object);
				}

			};
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Copyright 2012 the original author or authors
	 * @license MIT, see LICENSE.txt for details
	 *
	 * @author Scott Andrews
	 */

	(function (define) {
		'use strict';

		!(__WEBPACK_AMD_DEFINE_RESULT__ = function (/* require */) {

			return {

				read: function (str) {
					return str;
				},

				write: function (obj) {
					return obj.toString();
				}

			};
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	}(
		__webpack_require__(22)
		// Boilerplate for AMD and Node
	));


/***/ }
/******/ ])
});

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var _ = require('lodash');
var fetch = require('node-fetch');
var cors = require('cors');

var pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

var app = express();

var pc = {};
fetch(pcUrl).then(function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(res) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return res.json();

					case 2:
						pc = _context.sent;

						console.log('Fetching... ' + pcUrl);
						console.log('JSON.stringify => ' + JSON.stringify(pc));

					case 5:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}()).catch(function (err) {
	console.log('Что-то пошло не так: ', err);
});

app.use(cors());

app.get('/task3A/volumes/?', function (req, res, next) {
	var obj = pc.hdd.reduce(function (sum, cur) {
		if ((typeof sum === 'undefined' ? 'undefined' : _typeof(sum)) != "object") sum = {};
		if (typeof sum[cur.volume] == "undefined") sum[cur.volume] = cur.size + "B";else sum[cur.volume] = parseInt(sum[cur.volume]) + cur.size + "B";
		return sum;
	}, 0);
	res.json(obj);
});

app.get('/task3A/*', function (req, res, next) {

	var urlParams = req.originalUrl.split('/').slice(2);

	if (urlParams[urlParams.length - 1] == '') urlParams = urlParams.slice(0, -1);

	var paramsCnt = urlParams.length;
	console.log('paramsCnt = ' + paramsCnt);
	var obj = pc;

	while (true) {
		var element = urlParams.shift();
		if (!obj.hasOwnProperty(element) && paramsCnt || (_.isArray(obj) || typeof obj == 'string') && element == 'length') {
			console.log('Error - 404 Not Found');
			res.status(404).send('Not Found');
			return;
		}

		if (obj.hasOwnProperty(element)) obj = obj[element];

		console.log(obj);
		if (!urlParams.length || paramsCnt == 0) {
			console.log('Result OK');
			res.json(obj);
			return;
		}
	}
});

app.listen(3000, function () {
	console.log('App listening on port 3000!');
});
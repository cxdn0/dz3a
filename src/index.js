import {} from 'babel-polyfill';
var express = require('express');
var _ = require('lodash');
var fetch = require('node-fetch');
var cors = require('cors');


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

const app = express();

let pc = {};
fetch(pcUrl)
  .then( async (res) => {
    pc = await res.json();
	console.log('Fetching... ' + pcUrl);
	console.log('JSON.stringify => ' + JSON.stringify(pc));
  })
  .catch(err => {
    console.log('Что-то пошло не так: ', err);
  });

app.use(cors());

app.get('/task3A/volumes/?', (req, res, next) => {
	let obj = pc.hdd.reduce(function(sum, cur) {
		if(typeof(sum)!="object") sum={};
		if(typeof(sum[cur.volume]) == "undefined")
		sum[cur.volume] = cur.size + "B";
		else
		sum[cur.volume] = parseInt(sum[cur.volume]) + cur.size + "B";
		return sum;
	}, 0);
	res.json(obj);
});


app.get('/task3A/*', (req, res, next) => {

	let urlParams = req.originalUrl.split('/').slice(2);
	
	if(urlParams[urlParams.length-1] == '')
	urlParams = urlParams.slice(0, -1);
	
	let paramsCnt = urlParams.length;
	console.log('paramsCnt = ' + paramsCnt);
	let obj = pc;
	
	while(true) {
		let element = urlParams.shift();
		if((!obj.hasOwnProperty(element) && paramsCnt)
			|| ((_.isArray(obj) || typeof(obj)=='string') && element=='length')) {
			console.log('Error - 404 Not Found');
			res.status(404)
			.send('Not Found');
			return;
		}
		
		if(obj.hasOwnProperty(element))
		obj = obj[element];
		
		console.log(obj);
		if(!urlParams.length || paramsCnt == 0) {
		console.log('Result OK');
		res.json(obj);
		return;
		}
	}

});

app.listen(3000, () => {
	console.log('App listening on port 3000!');
});
  
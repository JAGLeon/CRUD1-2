const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		let productsInsale = products.filter(product => product.category == "in-sale");
		let productsVisited = products.filter(product => product.category == "visited");

		res.render('index', {
			productsInsale,
			productsVisited,
			toThousand
		})
	},
	search: (req, res) => {

		let searchResult  = [];
		products.forEach(product => {
			if(product.name.toLowerCase().includes(req.query.keywords.toLowerCase())){
				searchResult.push(product)
			}
		})
		
		render('result',{
			searchResult,
			keyword: req.query.keywords,
			toThousand
		})
	},
};

module.exports = controller;

const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeProducts = data => fs.writeFileSync(productsFilePath,JSON.stringify(data), "utf-8")

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id == productId);

		res.render('detail',{
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastId = 0;

		products.forEach(product => {
			if(product.id > lastId){
				lastId = product.id
			}
		});

		res.send(req.body)
		let newProduct = {
			...req.body,
			id : lastId + 1,
			image: "default-image.png"
		}

		products.push(newProduct);

		writeProducts(products);

		res.send(`El producto ${req.body.name} a sido creado exitosamente`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id == productId);
		
		res.render('product-edit-form',{
			product,
			toThousand
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let productId = +req.params.id;
		
		// products.forEach(product => {
		// 	if (product.id === productId) {
		// 		product.name = req.body.name,
		// 		product.price = req.body.price,
		// 		product.discount = req.body.discount,
		// 		product.category = req.body.category,
		// 		product.description = req.body.description,
		// 	}
		// })

		products = products.map(product => product.id === productId ? {id : product.id , ...req.body , image : product.image} : product)

		writeProducts(products);

		res.send(`Editaste el producto ${req.body.name} exitosamente!`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id == productId);

		products.forEach(product => {
			if(product.id === productId){
				let productToDelete = product.indexOf(product)
				product.splice(productToDelete,1);
			}
		})

		writeProducts(products)
		res.send(`Eliminaste el producto ${product.name}`)
	}
};

module.exports = controller;
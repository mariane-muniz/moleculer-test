"use strict";

const mongoose = require('mongoose');
let Stock = [];
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "database",
	actions: {
		getData: {
			params: {
			},
			handler(ctx) {
				let entityName = ctx.params.entityName;

				if (!this.existModel(entityName)) {
					this.logger.info("create model", entityName);
					this.createModel(entityName);
				}

				return Stock[entityName].find(function (err, stocks) {
					if (err) return console.error(err);
					return stocks;
				});
			}
		}
	},

	methods: {
		uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			})
		},
		createModel(entityName) {
			const stockSchema = new mongoose.Schema({
				name: String
			});
			Stock['Stock'] = mongoose.model('Stock', stockSchema, 'stocks');
		},
		existModel(entityName) {
			let modelNames = mongoose.modelNames();
			let exist = modelNames.includes(entityName);
			this.logger.info("available model names", modelNames);
			this.logger.info("exist model", exist);
			return exist;
		}
	},
	started() {
		mongoose.connect("mongodb://localhost/admin", {
			user: "root",
			pass: "password",
			keepAlive: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
			.then(() => console.log("MongoDB connected…"))
			.catch(err => console.log(err));

		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function () {
			console.log("Connected");
		});
	},
	stopped() {
		mongoose.connection.close();
	}
};

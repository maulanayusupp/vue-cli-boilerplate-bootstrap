import client from '../lib/http-client';
import { buildQuery } from '../lib/helper';

const endpoint = '/articles';

export default {

	// Create categorie
	create(params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		const url = `${endpoint}`;
		client.post(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Create Bulk
	createBulk(articles, cb, errorCb) {
		const url = `${endpoint}/bulk/create`;
		const params = { articles: JSON.stringify(articles) };
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.post(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Get
	get(id, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.get(url)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Get articles
	getArticles(params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		const url = endpoint;
		client.get(url, { params })
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Update articles
	update(id, params, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		client.put(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Delete articles
	delete(id, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		client.delete(url)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Delete bulk articles
	deleteBulk(ids, cb, errorCb) {
		const url = `${endpoint}/bulk/delete`;
		const params = {
			ids,
		};
		client.delete(url, { params })
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	exportList(type, params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		const query = buildQuery(params);
		const url = `${endpoint}/export/${type}?${query}`;
		client.get(url, { responseType: 'blob' })
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Reorder
	reorder(ids, cb, errorCb) {
		const params = {
			ids: JSON.stringify(ids),
		};
		const url = `${endpoint}/reorder`;
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.put(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},
};

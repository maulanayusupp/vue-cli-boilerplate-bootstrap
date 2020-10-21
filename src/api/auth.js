import client from '@/lib/http-client';

const endpoint = '/auth';

export default {
	// Login
	login(params, cb, errorCb) {
		const url = `${endpoint}/login`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Logout
	logout(cb, errorCb) {
		const url = `${endpoint}/logout`;
		client.post(url)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Get User Profile
	getProfile(cb, errorCb) {
		const url = `${endpoint}/profile`;
		client.get(url)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Reset Password
	resetPassword(email, token, params, cb, errorCb) {
		const url = `${endpoint}/password/reset/${email}/${token}`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Change Password
	changePassword(params, cb, errorCb) {
		const url = `${endpoint}/password/change`;
		client.put(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Verify Reset Password Code
	 */
	verifyResetCode(params, cb, errorCb) {
		const url = `${endpoint}/password/verify`;
		client.get(url, { params })
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Set Password
	*/
	setPassword(payload, params, cb, errorCb) {
		const url = `${endpoint}/password/set`;
		client.put(url, payload, { params })
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Register
	*/
	register(params, cb, errorCb) {
		const url = `${endpoint}/register`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Generate auto login
	*/
	generate(params, cb, errorCb) {
		const url = `${endpoint}/login/auto/generate`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Auto login
	*/
	autoLogin(params, cb, errorCb) {
		const url = `${endpoint}/login/auto`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Forgot password
	*/
	forgotPassword(params, cb, errorCb) {
		const url = `${endpoint}/password/forgot`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Register verify
	*/
	verify(params, cb, errorCb) {
		const url = `${endpoint}/register/verified`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Update profile
	*/
	updateProfile(params, cb, errorCb) {
		const url = `${endpoint}/profile`;
		client.put(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	/**
	 * Resend confirmation
	*/
	resendConfirmation(params, cb, errorCb) {
		const url = `${endpoint}/register/resend`;
		client.post(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},
};

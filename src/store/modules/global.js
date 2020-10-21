import router from '@/router';
import client from '@/lib/http-client';
import { removeCookie } from '@/lib/cookie';
import authApi from '@/api/auth';
import { loadLanguageAsync } from '@/setup/i18n-setup';

const TOKEN_KEY = 'access_token';
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT = 'LOGOUT';
const SET_USER = 'SET_USER';
const SET_ROLE = 'SET_ROLE';
const FETCH_USER_START = 'FETCH_USER_START';
const FETCH_USER_END = 'FETCH_USER_END';
const NAVIGATE = 'NAVIGATE';
const SET_LOCALE = 'SET_LOCALE';

const sessionCookieName = 'marimoro_app';

const state = function () {
	return {
		location: '/',
		user: null,
		role: '',
		isFetchingUser: false,
		locale: 'en',
		notifications: [],
		isTokenExist: !!localStorage.getItem(TOKEN_KEY),
		isSocketConnected: false,
		loginError: false,
		isLoggingIn: false,
	};
};

const mutations = {
	[LOGIN](state) {
		state.loginError = false;
		state.isLoggingIn = true;
	},
	[LOGIN_SUCCESS](state) {
		state.isTokenExist = true;
		state.loginError = false;
		state.isLoggingIn = false;
	},
	[LOGIN_FAILED](state, errorMessage) {
		state.loginError = errorMessage;
		state.isLoggingIn = false;
	},
	[LOGOUT](state) {
		state.user = null;
		state.isTokenExist = false;
	},
	[FETCH_USER_START](state) {
		state.isFetchingUser = true;
	},
	[FETCH_USER_END](state) {
		state.isFetchingUser = false;
	},
	[SET_LOCALE](state, locale) {
		state.locale = locale;
	},
	[SET_USER](state, user) {
		state.user = user;
		state.locale = user.language;

		// Load Language
		loadLanguageAsync(user.language);
	},
	[SET_ROLE](state, role) {
		state.isRoleSwitcherVisible = false;
		localStorage.setItem('role', role);
		state.role = role;
	},
	[NAVIGATE](state, to) {
		state.location = to;
	},
	SOCKET_CONNECT(state) {
		state.isSocketConnected = true;
	},
	SOCKET_DISCONNECT(state) {
		state.isSocketConnected = false;
	},
};

const actions = {
	setToken({ commit }, data) {
		const jwt = data.token;
		localStorage.setItem(TOKEN_KEY, jwt);
		client.defaults.headers.Authorization = `Bearer ${jwt}`;
		commit(LOGIN_SUCCESS);
	},
	logout({ commit }) {
		const callback = () => {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem('role');
			delete client.defaults.headers.Authorization;
			removeCookie(sessionCookieName);
			commit(LOGOUT);
			router.push('/login');
		};
		authApi.logout(callback);
	},
	navigate({ commit }, to) {
		commit(NAVIGATE, to);
	},
	setLocale({ commit }, locale) {
		commit(SET_LOCALE, locale);
	},
	setUser({ commit }, user) {
		commit(SET_USER, user);
	},
	fetchUser({ commit }) {
		if (this.isFetchingUser) return;
		commit(FETCH_USER_START);
		const callback = function (response) {
			const user = response.data;
			commit(FETCH_USER_END);
			commit(SET_USER, user);

			const role = localStorage.getItem('role');
			const roles = typeof (user.roles) === 'string' ? JSON.parse(user.roles) : user.roles;
			if (role && roles.includes(role)) {
				commit(SET_ROLE, role);
			} else {
				const firstRole = roles[0];
				commit(SET_ROLE, firstRole);
			}
		};
		const errorCallback = function () {
			commit(FETCH_USER_END);
		};
		authApi.getProfile(callback, errorCallback);
	},
	setRole({ commit }, role) {
		commit(SET_ROLE, role);
	},
	switchRole({ commit }, role) {
		commit(SET_ROLE, role);
		router.push('/');
	},
	setLoggedIn({ commit }) {
		commit(LOGIN_SUCCESS);
	},
};

const getters = {
	location: state => state.location,
	user: state => state.user,
	role: state => state.role,
	isSuperAdmin: state => state.user && state.user.role === 'super_admin',
	locale: state => state.locale,
	isLoggingIn: state => state.isLoggingIn,
	isTokenExist: state => state.isTokenExist,
	isFetchingUser: state => state.isFetchingUser,
	isSocketConnected: state => state.isSocketConnected,
	loginError: state => state.loginError,
	notifications: state => state.notifications,
};

export default {
	state,
	getters,
	actions,
	mutations,
};

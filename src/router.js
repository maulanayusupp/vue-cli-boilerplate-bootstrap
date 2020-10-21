import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const APP_NAME = process.env.VUE_APP_NAME;
// lazy load function
function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);
}
export default new Router({
    mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
	routes: [
        {
			path: '/',
			name: 'Home',
			component: loadView('Home'),
			meta: {
				title: `Home - ${APP_NAME}`,
				gtm: 'Home',
			},
		},
		{
			path: '/login',
			name: 'Login',
			component: loadView('Login'),
			meta: {
				title: `Login - ${APP_NAME}`,
				gtm: 'Login',
			},
		},
		{
			path: '/reset-password',
			name: 'ResetPassword',
			component: loadView('ResetPassword'),
			meta: {
				title: `Reset Password - ${APP_NAME}`,
				gtm: 'Reset Password',
			},
		},
		{
			path: '/password/reset',
			name: 'ResetPasswordVerify',
			component: loadView('ResetPasswordVerify'),
			meta: {
				title: `Reset Password Verify - ${APP_NAME}`,
				gtm: 'Reset Password Verify',
			},
		},
		{
			path: '/register',
			name: 'Register',
			component: loadView('Register'),
			meta: {
				title: `Register - ${APP_NAME}`,
				gtm: 'Register',
			},
		},
		{
			path: '/user/verify',
			name: 'UserVerify',
			component: loadView('UserVerify'),
			meta: {
				title: `User Verify - ${APP_NAME}`,
				gtm: 'User Verify',
			},
		},
		{
			path: '/magic-link',
			name: 'AutoLogin',
			component: loadView('AutoLogin'),
			meta: {
				title: `Magic Link - ${APP_NAME}`,
				gtm: 'Magic Link',
			},
		},
		{
			path: '/auto_login',
			name: 'AutoLoginVerify',
			component: loadView('AutoLoginVerify'),
			meta: {
				title: `Magic Link Verification - ${APP_NAME}`,
				gtm: 'Magic Link Verification',
			},
		},
		{
			path: '/users',
			name: 'Users',
			component: loadView('Users'),
			meta: {
				title: `Users - ${APP_NAME}`,
				gtm: 'Users',
			},
		},
		{
			path: '/categories',
			name: 'Categories',
			component: loadView('Categories'),
			meta: {
				title: `Categories - ${APP_NAME}`,
				gtm: 'Categories',
			},
		},
		{
			path: '/articles',
			name: 'Articles',
			component: loadView('Articles'),
			meta: {
				title: `Articles - ${APP_NAME}`,
				gtm: 'Articles',
			},
		},
		{
			path: '/profiles',
			name: 'Profile',
			component: loadView('Profile'),
			meta: {
				title: 'Profiles',
				gtm: 'Profiles',
			},
		},
		{
			path: '/error-404',
			name: 'Error404',
			component: loadView('Error404'),
			meta: {
				title: '404',
				gtm: 'Error 404',
				hideSidebar: true,
			},
		},
		// Redirect to 404 page, if no match found
		{
			path: '*',
			redirect: '/error-404',
		},
	],
});

<template>
	<nav class="navbar navbar-expand-lg navbar-light" v-if="activeRouteName !== 'Error404'">
		<div class="container">
			<router-link to="/" class="navbar-brand">MariMoro</router-link>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse justify-content-between" id="mainNavbar">
				<ul class="navbar-nav">
					<li class="nav-item">
						<router-link to="/users" class="nav-link">{{ $t('Users') }}</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/categories" class="nav-link">{{ $t('Categories') }}</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/articles" class="nav-link">{{ $t('Articles') }}</router-link>
					</li>
					<li class="nav-item">
						<md-menu md-align-trigger :md-offset-x="0" class="pointer">
							<a class="nav-link" md-menu-trigger>
								{{ $t('Settings') }}
							</a>
							<md-menu-content>
								<md-menu-item><span class="minw-150">{{ $t('Statistics') }}</span></md-menu-item>
								<md-menu-item><span class="minw-150">{{ $t('Report') }}</span></md-menu-item>
							</md-menu-content>
						</md-menu>
					</li>
				</ul>
				<ul class="navbar-nav">
					<li class="nav-item profile-dropdown">
						<md-menu md-align-trigger :md-offset-x="-50" class="pointer">
							<a class="nav-link" md-menu-trigger>
								<span class="nav-link-name inline-item">{{ userName }}</span>
								<span class="nav-link-avatar inline-item">{{ initialUserName }}</span>
							</a>
							<md-menu-content>
								<router-link to="/profiles" tag="div"><md-menu-item><span class="minw-150">{{ $t('My Profile') }}</span></md-menu-item></router-link>
								<md-menu-item><span class="minw-150">{{ $t('Feedback and Request') }}</span></md-menu-item>
								<md-menu-item><span class="minw-150">{{ $t('Help and Support') }}</span></md-menu-item>
								<md-menu-item @click="logout()"><span class="minw-150">{{ $t('Logout') }}</span></md-menu-item>
							</md-menu-content>
						</md-menu>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import { initialText } from '@/lib/helper';

export default {
	name: 'Navbar',
	components: {},
	data() {
		return {};
	},
	sockets: {
	},
	mounted() {},
	created() {},
	destroyed() {},
	beforeDestroy() {
	},
	computed: {
		...mapGetters({
			user: 'user',
		}),
		userName() {
			return this.user && this.user.profile ? this.user.profile.name : 'MM';
		},
		initialUserName() {
			return initialText(this.userName);
		},
		activeRouteName() {
			return this.$route.name;
		},
	},
	methods: {
		...mapActions({
			logout: 'logout',
		}),
	},
};
</script>

<style lang="scss" scoped>
</style>

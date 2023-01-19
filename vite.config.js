import {
	sveltekit
} from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	ssr:{
		noExternal:['chart.js'],
	},
	plugins: [
		sveltekit()
	],
	define: {
		global: {}
	},
	// server: {
	// 	cors: true
	// }
};

export default config;
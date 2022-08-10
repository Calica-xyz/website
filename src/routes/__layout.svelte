<script type="ts">
	import "../app.css";
	import AuthLogin from "../lib/AuthLogin.svelte";
	import { connected } from "svelte-ethers-store";
</script>

{#if $connected}
	<slot />
{:else}
	<AuthLogin />
{/if}

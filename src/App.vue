<template>
    <transition name="custom-classes-transition" :enter-active-class="enterTransitionName">
        <router-view/>
    </transition>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {
                enterTransitionName: null,
            }
        },
        created() {
            window.addEventListener('beforeunload', e => this.update(e));
        },
        methods: {
            // 刷新或关闭调用
            update() {
                let cartMap = this.$store.getters.getCartMap;
                if (cartMap.size === 0) localStorage.removeItem('cart');
                else localStorage.setItem('cart', JSON.stringify(Array.from(cartMap)));

                const order = this.$store.getters.getCurrent;
                if (order !== null)
                    sessionStorage.setItem('current', JSON.stringify(order));
            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path === '/search') this.enterTransitionName = 'animated slideInDown';
                else if (to.path === '/home' && from.path === '/search') this.enterTransitionName = 'animated slideInUp';
            }
        },
        destroyed() {
            window.removeEventListener('beforeunload', e => this.update(e))
        }
    }
</script>

<style>
    @import "../src/style/cover.css";

    @import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

    @import "../src/style/gloab.css";

</style>

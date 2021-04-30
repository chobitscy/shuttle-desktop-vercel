<template>
    <div class="header-container">
        <div id="heard" class="shadow">
            <div id="heard-container">
                <div style="display:flex;justify-content: center;align-items: center">
                    <el-menu
                            :default-active="activeIndex"
                            class="el-menu-demo"
                            background-color="#fff"
                            text-color="#000"
                            active-text-color="#409EFF"
                            @select="handleSelect"
                            :collapse="true">
                        <el-menu-item index="/">
                            <i class="el-icon-house"></i>
                            <div slot="title">首页</div>
                        </el-menu-item>
                        <el-menu-item index="/order">
                            <i class="el-icon-tickets"></i>
                            <div slot="title">订单</div>
                        </el-menu-item>
                        <el-menu-item index="/receive">
                            <i class="el-icon-sell"></i>
                            <div slot="title">接单</div>
                        </el-menu-item>
                        <el-menu-item index="/admin">
                            <i class="el-icon-data-analysis"></i>
                            <div slot="title">管理</div>
                        </el-menu-item>
                        <el-menu-item index="/search">
                            <i class="el-icon-search"></i>
                            <div slot="title">搜索</div>
                        </el-menu-item>
                        <el-menu-item index="/star">
                            <i class="el-icon-star-off"></i>
                            <div slot="title">收藏</div>
                        </el-menu-item>
                        <el-menu-item index="/luck">
                            <i class="el-icon-orange"></i>
                            <div slot="title">随机</div>
                        </el-menu-item>
                    </el-menu>
                </div>
            </div>
        </div>
        <transition name="custom-classes-transition" :enter-active-class="enterTransitionName">
            <router-view/>
        </transition>
        <div class="helper">
            <el-button type="warning" @click="$router.push('/cart')" plain>
                <i class="el-icon-shopping-cart-1" v-if="$store.getters.getCount === 0"></i>
                <div v-text="$store.getters.getCount" v-if="$store.getters.getCount > 0"/>
            </el-button>
            <el-button icon="el-icon-service" @click="$router.push('/chat')" type="primary" plain/>
            <el-button icon="el-icon-arrow-up"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "page-header",
        data() {
            return {
                userInfo: {
                    address: null,
                    admin: false,
                    id: 0,
                    name: null,
                    password: null,
                    phone: null,
                    score: 0
                },
                activeIndex: '/',
                enterTransitionName: null,
            }
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        },
        computed: {
            avatarUrl: function () {
                if (this.userInfo.name === null) {
                    return `https://api.multiavatar.com/null.png`;
                }
                return `https://api.multiavatar.com/${this.userInfo.name}.png`;
            },
        },
        methods: {
            openAdminWeb() {
                window.open(process.env.VUE_APP_ADMIN + 'login/' + localStorage.getItem('token'));
            },
            handleSelect(key) {
                if (key === '/admin') {
                    this.openAdminWeb();
                } else {
                    this.$router.push(key);
                }
            }
        },
        watch: {
            '$route'(to) {
                if (to.path === '/chat') this.enterTransitionName = 'animated slideInDown';
                else this.enterTransitionName = null;
            }
        },
    }
</script>

<style scoped>
    .header-container {
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    }

    #heard {
        background-color: #fff;
        display: flex;
        position: fixed;
        top: 25%;
        left: 3.9%;
        z-index: 10;
    }

    #heard-container {
        width: 75%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .helper {
        position: fixed;
        top: 65%;
        right: 5%;
        display: flex;
        flex-direction: column;
    }

    .helper > .el-button {
        margin: 5px 0;
    }
</style>
<template>
    <Page>
        <div class="box-container" slot="center">
            <div class="box">
                <div class="left shadow" v-if="getCount !== 0">
                    <el-scrollbar class="product">
                        <el-page-header @back="$router.back()"
                                        style="display: flex;padding: 10px 0;;align-items: center">
                            <el-breadcrumb slot="content" separator="/"
                                           style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item>购物车</el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-page-header>
                        <CartItem :item="item[1]" v-for="item in cart" :key="item[1].id" :count="item[1].count"/>
                    </el-scrollbar>
                </div>
                <div class="left shadow" v-if="getCount === 0">
                    <el-page-header @back="$router.back()"
                                    style="display: flex;padding: 10px 0;;align-items: center">
                        <el-breadcrumb slot="content" separator="/"
                                       style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>购物车</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-page-header>
                    <Empty description="购物车暂无商品" :svg="require('@/assets/undraw_empty_cart_co35.svg')"/>
                </div>
                <div class="right shadow">
                    <div class="cart-center" style="flex:1;">
                        <div class="cart-info">
                            <el-divider><i class="el-icon-view"></i> 用户信息</el-divider>
                            <div class="user">
                                <div><i class="el-icon-user"> 昵称</i></div>
                                <div v-text="userInfo.name"/>
                            </div>
                            <div class="address">
                                <div><i class="el-icon-school"> 地址</i></div>
                                <div v-text="userInfo.address"/>
                            </div>
                        </div>
                        <div class="expand">
                            <el-divider class="divider"><i class="el-icon-setting"> 可选操作</i></el-divider>
                            <el-input
                                    class="option"
                                    type="textarea"
                                    v-model="note"
                                    :rows="2"
                                    placeholder="备注">
                            </el-input>
                            <el-switch
                                    class="option"
                                    v-model="expired"
                                    active-text="自动取消（超过15分钟未有人接单）">
                            </el-switch>
                        </div>
                    </div>
                    <div class="operate">
                        <div class="total">
                            <div class="total-info"><i class="el-icon-price-tag"> 商品金额（运费 ¥1）</i></div>
                            <div class="total-txt"><span>共计：</span><span class="count-text">¥{{totalPrice}}</span>
                            </div>
                        </div>
                        <el-button class="operate-btn" type="primary" :disabled="$store.getters.getCount === 0"
                                   @click="submit">下单
                        </el-button>
                        <el-button class="operate-btn" type="success" :disabled="$store.getters.getCount === 0"
                                   @click="clearCart">清空购物车
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </Page>
</template>

<script>
    import Page from "@/layout/page";
    import CartItem from "@/components/cart-item";
    import common from "@/utils/common";
    import Empty from "@/components/empty";
    import {insertOrder} from "@/utils/api/order";

    export default {
        name: "cart",
        components: {Empty, CartItem, Page},
        data() {
            return {
                cart: Array.from(this.$store.getters.getCartMap),
                expired: false,
                userInfo: {
                    name: null,
                    address: null
                },
                note: null
            }
        },
        computed: {
            getCount() {
                return this.$store.getters.getCount;
            },
            totalPrice() {
                if (this.getCount !== 0) {
                    let count = 0;
                    this.$store.getters.getCartMap.forEach(function (product) {
                        count += product.count * product.price + 100
                    });
                    return common.changePrice(count);
                } else return '0.00'
            },
        },
        created() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo.name === null || userInfo.address === null) this.perfectUserInfo();
            else this.userInfo = userInfo;
        },
        methods: {
            clearCart() {
                this.$store.commit('clear');
                this.cart = [];
                this.$notify({
                    title: '成功',
                    message: '清空购物车成功！',
                    type: 'success',
                    duration: 2000,
                    position: 'bottom-left'
                });
            },
            perfectUserInfo() {
                this.$notify({
                    title: '请完善个人信息',
                    message: '跳转到个人界面',
                    type: 'warning'
                });
                this.$router.push('/user');
            },
            submit() {
                let userInfo = common.getUserInfo();
                let orders = [];
                let date = this.changeDate(new Date());
                this.$store.getters.getCartMap.forEach(function (value) {
                    for (let n = 0; n < value.count; n++) {
                        let type = value.extend.type;
                        let note, file;
                        if (type === 'note') note = value.extend.value;
                        else if (type === 'file') file = value.extend.value.url;
                        orders.push({
                            pid: value.id,
                            cid: userInfo.id,
                            sid: 1,
                            date: date,
                            address: userInfo.address,
                            note: note,
                            file: file,
                            status: -1,
                            client: {
                                phone: userInfo.phone,
                                address: userInfo.address,
                                name: userInfo.name
                            },
                            serviceId: value.serviceId,
                            product: {
                                name: value.name
                            },
                            storeName: value.storeName
                        })
                    }
                });
                insertOrder(orders, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }, this.expired).then(res => {
                    if (res.code === 1) {
                        this.$store.commit('clear');
                        this.$message({
                            message: '下单成功',
                            type: 'success'
                        });
                        this.$router.push('/order');
                    }
                });
            },
            changeDate(date) {
                return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
            },
        }
    }
</script>

<style scoped>

    .box-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .box {
        margin: 30px 0;
        width: 75%;
        display: flex;
    }

    .left {
        padding: 10px;
        width: 70%;
        background-color: white;
        display: flex;
        flex-direction: column;
        margin-right: 20px;
    }

    .right {
        width: 30%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: white;
    }

    .cart-info {
        padding: 30px 0 0 0;
        width: 100%;
    }

    .cart-info > div {
        margin: 10px 0;
    }

    .user {
        padding: 3px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .address {
        padding: 3px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .expand {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .expand::after {
        height: 2px;
        background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
        background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
        background-size: 80px;
        content: '';
    }

    .option {
        margin-bottom: 10px;
    }

    .total {
        padding: 10px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .operate {
        width: 80%;
        display: flex;
        flex-direction: column;
        padding: 10px;
    }

    .operate-btn {
        width: 100%;
        margin: 3px 0;
    }

    .cart-center {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .product {
        flex: 1;
        overflow-y: scroll
    }

    .product::-webkit-scrollbar {
        width: 0 !important
    }

    .count-text {
        color: #f56c6c;
    }

    .option {
        margin-bottom: 20px;
    }
</style>
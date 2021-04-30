<template>
    <Page>
        <el-scrollbar slot="center">
            <div class="center-container">
                <div class="box">
                    <div class="store-info shadow" v-if="store !== null">
                        <el-page-header @back="$router.back()"
                                        style="display: flex;padding: 10px 20px;;align-items: center">
                            <el-breadcrumb slot="content" separator="/"
                                           style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item>商店详情</el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-page-header>
                        <div class="info">
                            <div style="display:flex;">
                                <div class="image">
                                    <el-image :src="store.image" :preview-src-list="[store.image]"
                                              style="width: 200px;height: 150px;"/>
                                </div>
                                <div class="store-info-txt">
                                    <div class="title" v-text="store.name"/>
                                    <div class="tag">
                                        <el-tag size="mini" effect="dark" v-text="store.services.name"
                                                :style="'border-color:' + store.services.color"
                                                :color="store.services.color"/>
                                    </div>
                                    <div class="sales">
                                        <i class="el-icon-medal"></i> 销量：{{store.sales}}
                                    </div>
                                    <div class="rate">
                                        <el-rate v-model="store.rate" disabled show-score
                                                 text-color="#ff9900"></el-rate>
                                    </div>
                                </div>
                            </div>
                            <div class="operate">
                                <el-button icon="el-icon-circle-check" type="warning" @click="dialogRateVisible = true">
                                    评分
                                </el-button>
                                <el-button :type="isStar ? 'success' : 'info'" @click="star">
                                    <i :class="isStar ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                                    <span v-text="isStar ? '已收藏' : '收藏'"></span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="shadow" style="width: 100%;display: flex;flex-direction: column;margin: 20px 0;">
                        <div class="product">
                            <Product :products="products" :pageNo="pageNo"
                                     :pageSize="pageSize" :total="total"/>
                        </div>
                    </div>
                    <div class="comment-container shadow">
                        <div class="comment">
                            <Comment :store-id="id"/>
                        </div>
                    </div>
                    <el-dialog title="请评价该商店" :visible.sync="dialogRateVisible" width="20%" center>
                        <div class="rate-dialog">
                            <el-rate v-model="rate" show-text/>
                            <div class="rate-button-dialog">
                                <el-button type="primary" size="mini" :disabled="rate === 0" @click="changeRate">确认
                                </el-button>
                            </div>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </el-scrollbar>
    </Page>
</template>

<script>
    import Page from "@/layout/page";
    import Product from "@/components/product";
    import Comment from "@/components/comment";
    import {findProductsByStoreIdByPagination} from "@/utils/api/product";
    import {findStoreById} from "@/utils/api/store";
    import {isStarByStoreId, star, unStar} from "@/utils/api/star";
    import common from "@/utils/common";

    export default {
        name: "store",
        components: {Comment, Product, Page},
        props: ['id'],
        data() {
            return {
                value: 3,
                products: [],
                store: null,
                pageNo: 1,
                pageSize: 8,
                total: 0,
                dialogRateVisible: false,
                rate: 0,
                stars: []
            }
        },
        created() {
            this.getProducts(this.pageNo);
            let storeList = this.$store.getters.getStoreById(parseInt(this.id));
            if (storeList.length === 0) {
                findStoreById(this.id).then(res => {
                    if (res.code === 1) {
                        this.store = res.data[0];
                    }
                });
            } else this.store = storeList[0];
            this.isStarByStoreId();
        },
        computed: {
            isStar: function () {
                return this.stars.length !== 0;
            }
        },
        methods: {
            getProducts(pageNo) {
                if (this.$store.getters.productsCache(parseInt(this.id))) {
                    this.products = this.$store.getters.getProducts(parseInt(this.id));
                    this.total = this.products.length;
                } else {
                    findProductsByStoreIdByPagination(this.id, pageNo, this.pageSize).then(res => {
                        if (res.code === 1) {
                            let data = res.data.list;
                            this.products = data;
                            this.$store.commit('setProducts', data);
                        }
                    });
                }
            },
            star() {
                if (this.isStar) {
                    this.$confirm('确认取消收藏?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        unStar({
                            id: this.stars[0].id,
                            uid: common.getUserInfo().id
                        }).then(res => {
                            if (res.code === 1) {
                                this.$notify({
                                    title: '操作成功',
                                    message: '已取消收藏',
                                    type: 'success'
                                });
                                this.isStarByStoreId();
                            }
                        });
                    }).catch();
                } else {
                    this.$confirm('确认收藏该商店?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        star({
                            sid: this.id,
                            type: false
                        }).then(res => {
                            if (res.code === 1) {
                                this.isStarByStoreId();
                                this.$notify({
                                    title: '操作成功',
                                    message: '收藏商店成功！',
                                    type: 'success'
                                });
                            }
                        });
                    }).catch();
                }
            },
            changeRate() {
                this.dialogRateVisible = false;
                this.$notify({
                    title: '操作成功',
                    message: '商店评分成功！',
                    type: 'success'
                });
            },
            isStarByStoreId() {
                isStarByStoreId(this.id).then(res => {
                    if (res.code === 1) {
                        this.stars = res.data;
                    }
                })
            }
        }
    }
</script>

<style scoped>

    .center-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .box {
        margin: 30px 0;
        width: 75%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .store-info {
        width: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        flex-direction: column
    }

    .store-info-txt {
        margin: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center
    }

    .store-info-txt > div {
        margin: 5px;
    }

    .info {
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .info > div {
        margin: 5px 0;
    }

    .operate {
        display: flex;
    }

    .comment-container {
        width: 100%;
        flex: 0.2;
    }

    .comment {
        margin-top: 30px;
        width: 100%;
    }

    .rate-dialog {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .rate-button-dialog {
        margin-top: 30px;
    }
</style>
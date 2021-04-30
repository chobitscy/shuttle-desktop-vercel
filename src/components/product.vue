<template>
    <div class="container">
        <div class="content">
            <el-row>
                <el-col :span="4" v-for="product in products" :key="product.id">
                    <el-card :body-style="{ padding: '0px' }" style="margin: 10px;" shadow="hover">
                        <div style="display: flex;justify-content: center;align-items: center">
                            <el-image :src="product.image"
                                      class="image" style="height: 150px;width: 150px;" fit="cover"/>
                        </div>
                        <div class="store-info">
                            <div class="product-info">
                                <div class="store-title">
                                    <span v-text="product.name"></span>
                                </div>
                                <div class="info-text"><i class="el-icon-medal"></i>
                                    <span> 销量：</span>
                                    <span v-text="product.sales"/>
                                </div>
                                <div class="info-text"><i class="el-icon-price-tag"></i>
                                    <span> 价格：</span>
                                    <span v-text="changePrice(product.price)"/>
                                </div>
                                <el-rate v-model="product.rate" disabled show-score text-color="#ff9900"></el-rate>
                            </div>
                            <div style="display:flex;justify-content: space-between">
                                <ProductDialog :product="product" :value="value">
                                    <el-button size="mini" type="primary" style="width: 100%;" slot="btn">加入购物车
                                    </el-button>
                                </ProductDialog>
                                <el-button icon="el-icon-star-on" type="warning" style="padding:0 10px"
                                           @click="star(product.id)"/>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <Empty :description="'该商店暂无产品'" :svg="require('@/assets/undraw_empty_xct9.svg')"
                   class="product" v-if="products.length === 0" style="height: unset;"/>
            <div class="more" v-if="total !== 0">
                <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="total"
                               @current-change="pageCurrent"/>
            </div>
        </div>
    </div>
</template>

<script>
    import ProductDialog from "@/components/product-dialog";
    import common from "@/utils/common";
    import Empty from "@/components/empty";
    import {isStarByProductId, star, unStar} from "@/utils/api/star";

    export default {
        name: "product",
        components: {Empty, ProductDialog},
        props: {products: Array, pageNo: Number, pageSize: Number, total: Number, FontAwesomeIcon: Object},
        data() {
            return {
                filter: false,
                category: '全部',
                sort: '最新',
                advanced: '正序',
                value: null,
                isStar: false
            }
        },
        computed: {
            changePrice() {
                return (price) => {
                    return common.changePrice(price);
                }
            }
        },
        methods: {
            pageCurrent(current) {
                this.$parent.getProducts(current);
            },
            star(id) {
                isStarByProductId(id).then(res => {
                    if (res.code === 1) {
                        let stars = res.data;
                        if (stars.length !== 0) {
                            this.$confirm('该产品已被收藏，确定取消该收藏？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                center: true
                            }).then(() => {
                                    this.unStar(stars[0].id);
                                }
                            ).catch();
                        } else {
                            this.$confirm('确认收藏该产品?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                center: true
                            }).then(() => {
                                star({
                                    pid: id,
                                    type: true
                                }).then(res => {
                                    if (res.code === 1) {
                                        this.$notify({
                                            title: '操作成功',
                                            message: '收藏商店成功！',
                                            type: 'success'
                                        });
                                    }
                                });
                            }).catch(() => {
                                this.$notify({
                                    title: '操作成功',
                                    message: '已取消收藏！',
                                    type: 'warning'
                                });
                            });
                        }
                    }
                });
            },
            unStar(id) {
                unStar({
                    id: id,
                    uid: common.getUserInfo().id
                }).then(res => {
                    if (res.code === 1) {
                        this.$notify({
                            title: '操作成功',
                            message: '已取消收藏',
                            type: 'success'
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

    .container {
        padding: 10px;
    }

    .image {
        width: 100%;
        display: block;
    }

    .store-info {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .store-info > div {
        margin: 2px;
    }

    .more {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info-text {
        font-size: 10px;
        color: gray;
    }

    .product-info {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column
    }

    .product-info > div {
        margin: 2px;
    }

    .product {
        height: 100%;
    }
</style>
<template>
    <div class="container">
        <div class="content">
            <el-row v-if="stars.length !== 0 && type === '商店'">
                <el-col :span="span" v-for="star in stars" :key="star.id">
                    <el-card :body-style="{ padding: '0px' }" style="margin: 10px;" shadow="hover"
                             v-if="star.store !== null" @click.native="unStar(star.id)">
                        <img :src="star.store.image" class="image" style="height: 160px">
                        <div class="store-info">
                            <div class="store-title">
                                <span v-text="star.store.name"></span>
                            </div>
                            <el-rate v-model="star.store.rate" disabled show-score text-color="#ff9900"></el-rate>
                            <div class="sales"><i class="el-icon-medal"></i> 销量：<span v-text="star.store.sales"></span>
                            </div>
                            <div style="padding: 5px;display: flex" @click.stop.prevent>
                                <el-button size="mini" @click="$router.push('/store/' + star.store.id)">进入商店</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row v-if="stars.length !== 0 && type === '产品'">
                <el-col :span="4" v-for="star in stars" :key="star.id">
                    <el-card :body-style="{ padding: '0px' }" style="margin: 10px;" shadow="hover"
                             v-if="star.product !== null" @click.native="unStar(star.id)">
                        <div style="display: flex;justify-content: center;align-items: center">
                            <el-image :src="star.product.image"
                                      class="image" style="height: 150px;width: 150px;" fit="cover"/>
                        </div>
                        <div class="store-info">
                            <div class="product-info">
                                <div class="store-title">
                                    <span v-text="star.product.name"></span> <el-tag v-text="star.product.store.name" size="mini" effect="dark"/>
                                </div>
                                <div class="info-text"><i class="el-icon-medal"></i>
                                    <span> 销量：</span>
                                    <span v-text="star.product.sales"/>
                                </div>
                                <div class="info-text"><i class="el-icon-price-tag"></i>
                                    <span> 价格：</span>
                                    <span v-text="changePrice(star.product.price)"/>
                                </div>
                                <el-rate v-model="star.product.rate" disabled show-score text-color="#ff9900"></el-rate>
                            </div>
                            <div @click.stop.prevent>
                                <ProductDialog :product="star.product" :value="value">
                                    <el-button size="mini" style="width: 100%;" slot="btn">加入购物车
                                    </el-button>
                                </ProductDialog>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <Empty :description="type === '商店' ? '暂无商店收藏' : '暂无产品收藏'" :svg="require('@/assets/undraw_mpty_street.svg')"
                   v-if="stars.length === 0"/>
        </div>
    </div>
</template>

<script>
    import Empty from "@/components/empty";
    import {unStar} from "@/utils/api/star";
    import common from "@/utils/common";
    import ProductDialog from "@/components/product-dialog";

    export default {
        name: "star-item",
        components: {ProductDialog, Empty},
        props: ['stars', 'span', 'type'],
        data() {
            return {
                filter: false,
                category: '全部',
                sort: '最新',
                advanced: '正序',
                userInfo: null,
                value: null
            }
        },
        created() {
            this.userInfo = common.getUserInfo();
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
                this.getStores(current, this.pageSize);
            },
            unStar: function (id) {
                this.$confirm('确认取消收藏?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    unStar({
                        id: id,
                        uid: this.userInfo.id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$notify({
                                title: '操作成功',
                                message: '已取消收藏',
                                type: 'success'
                            });
                            this.$parent.getData();
                        }
                    });
                }).catch(() => {
                });
            }
        }
    }
</script>

<style scoped>

    .container {
        flex: 1;
        padding: 10px 0;
    }

    .image {
        width: 100%;
        display: block;
    }

    .content {
        height: 100%;
        padding: 10px 10px;
    }

    .store-info {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .sales {
        font-size: 10px;
    }

    .operate-btn {
        margin: 6px;
        display: flex;
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

    .store-title{
        display: flex;
        justify-content: space-between;
    }

    .store-title > .el-tag{
        margin: 0 3px;
    }
</style>
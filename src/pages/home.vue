<template>
    <Page>
        <el-scrollbar slot="center">
            <div class="center-box">
                <div class="center-container" style="padding-top: 30px;">
                    <el-carousel :interval="3000" type="card" height="200px" class="shadow" style="width: 73%;margin: 20px 0">
                        <el-carousel-item v-for="ad in ads" :key="ad.id">
                            <el-image :src="ad.image" @click="$router.push('/store/' + ad.storeId)"/>
                        </el-carousel-item>
                    </el-carousel>
                    <SummaryCard class="shadow" style="margin-left: 20px;flex: 1"/>
                </div>
            </div>
            <div class="center-box" style="padding-bottom: 30px;">
                <div class="center-container">
                    <div class="service shadow">
                        <div style="width: 100%;display: flex;justify-content: space-between">
                            <el-radio-group v-model="radio" style="padding-left: 20px">
                                <el-radio-button typeof="info" v-for="service in services" :key="service.id" :label="service.id">
                                    <i :class="service.icon"></i> <span v-text="service.name"></span>
                                </el-radio-button>
                            </el-radio-group>

                            <el-button icon="el-icon-setting" @click="option = true" style="margin-right: 20px;">选项</el-button>
                        </div>
                        <Service :stores="stores" :span="6"/>
                        <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="total"
                                       @current-change="pageCurrent" v-if="total !== 0"
                                       style="width: 100%;display: flex;justify-content: center">
                        </el-pagination>
                    </div>
                    <div class="rank shadow">
                        <div class="rank-title"><i class="el-icon-medal"></i> 排行榜</div>
                        <el-tabs v-model="rank" :stretch="true">
                            <el-tab-pane label="商店" name="store">
                                <PopularItem :item="item" v-for="item in popularStore" :key="item.id"/>
                            </el-tab-pane>
                            <el-tab-pane label="产品" name="product">
                                <PopularItem :item="item" v-for="item in popularProduct" :key="item.id"/>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <el-dialog
                            title="选项" width="30%"
                            :visible.sync="option"
                            :center="true">
                        <template slot="title"><i class="el-icon-setting"> 选项</i></template>
                        <div class="filter">
                            <div class="item">
                                <span>分类：</span>
                                <el-button-group>
                                    <el-radio-group v-model="categoryId">
                                        <el-radio-button label="0">全部</el-radio-button>
                                        <el-radio-button v-for="category in categories" :key="category.id"
                                                         :label="category.id">{{category.name}}
                                        </el-radio-button>
                                    </el-radio-group>
                                </el-button-group>
                            </div>
                            <div class="item">
                                <span>排序：</span>
                                <el-button-group>
                                    <el-radio-group v-model="sort">
                                        <el-radio-button label="id">最新</el-radio-button>
                                        <el-radio-button label="rate">评分</el-radio-button>
                                        <el-radio-button label="sales">销量</el-radio-button>
                                    </el-radio-group>
                                </el-button-group>
                            </div>
                            <div class="item">
                                <span>高级：</span>
                                <el-radio-group v-model="advanced">
                                    <el-radio-button label="ASC">正序</el-radio-button>
                                    <el-radio-button label="DESC">倒序</el-radio-button>
                                </el-radio-group>
                            </div>
                            <el-button class="item" style="margin-top: 20px" @click="filer">应用</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </el-scrollbar>
    </Page>
</template>

<script>
    import Service from "@/components/service";
    import PopularItem from "@/components/popular-item";
    import Page from "@/layout/page";
    import {findAllService} from "@/utils/api/service";
    import {findPopularProduct} from "@/utils/api/product";
    import {findByCategoryId, findPopularStore, findStoreByServiceId} from "@/utils/api/store";
    import {findAllAds} from "@/utils/api/ads";
    import {findCategoryByServiceId} from "@/utils/api/category";
    import SummaryCard from "@/components/summary-card";

    export default {
        name: "home",
        components: {SummaryCard, Page, PopularItem, Service},
        data() {
            return {
                rank: 'store',
                popularProduct: [],
                popularStore: [],
                services: [],
                ads: [],
                radio: '1',
                pageSize: 8,
                pageNo: 1,
                total: null,
                stores: [],
                option: false,
                categoryId: '0',
                sort: 'id',
                advanced: 'ASC',
                categories: []
            }
        },
        created() {
            let services = sessionStorage.getItem('services');
            if (services === null) this.getService();
            else this.services = JSON.parse(services);
            this.getPopular();
            this.getAds();
            this.getStores(this.pageNo);
            this.getCategory();
        },
        methods: {
            getService() {
                findAllService().then(res => {
                    if (res.code === 1) {
                        this.services = res.data.list;
                        sessionStorage.setItem('services', JSON.stringify(this.services));
                    }
                });
            },
            getPopular() {
                findPopularProduct(5).then(res => {
                    if (res.code === 1) {
                        this.popularProduct = res.data;
                    }
                });
                findPopularStore(5).then(res => {
                    if (res.code === 1) {
                        this.popularStore = res.data;
                    }
                });
            },
            getAds() {
                let ads = JSON.parse(sessionStorage.getItem('ads'));
                if (ads === null) {
                    findAllAds().then(res => {
                        if (res.code === 1) {
                            const ads = res.data;
                            this.ads = ads;
                            sessionStorage.setItem('ads', JSON.stringify(ads));
                        }
                    });
                } else {
                    this.ads = ads;
                }
            },
            getStores(pageNo) {
                if (this.$store.getters.storesCache(parseInt(this.radio))) {
                    this.stores = this.$store.getters.getStoresBySid(parseInt(this.radio));
                    this.total = this.stores.length;
                } else {
                    findStoreByServiceId(parseInt(this.radio), pageNo, this.pageSize, this.advanced, this.sort).then(res => {
                        if (res.code === 1) {
                            this.stores = res.data.list;
                            this.total = res.data.total;
                            this.$store.commit('setStores', this.stores);
                        }
                    });
                }
            },
            pageCurrent(current) {
                this.getStores(current, this.pageSize);
            },
            getCategory() {
                if (this.$store.getters.categoriesCache(parseInt(this.radio))) {
                    this.categories = this.$store.getters.getCategories(parseInt(this.radio));
                } else {
                    findCategoryByServiceId(this.radio).then(res => {
                        if (res.code === 1) {
                            this.categories = res.data;
                            this.$store.commit('setCategories', this.categories);
                        }
                    });
                }
            },
            filer() {
                this.$store.commit('clearStores');
                this.getStores(this.pageNo);
                this.option = false;
            }
        },
        watch: {
            radio: function () {
                if (this.$store.getters.storesCache(parseInt(this.radio))) {
                    this.stores = this.$store.getters.getStoresBySid(parseInt(this.radio));
                    this.total = this.stores.length;
                } else this.getStores(this.pageNo, this.pageSize);
                this.getCategory();
            },
            categoryId: function () {
                let categoryId = this.categoryId;
                if (categoryId === '0') {
                    this.getStores(this.pageNo);
                } else {
                    findByCategoryId(categoryId).then(res => {
                        if (res.code === 1) {
                            this.stores = res.data.list;
                        }
                    });
                }
                this.option = false;
            }
        }
    }
</script>

<style scoped>

    .center-box {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .center-container {
        width: 75%;
        height: 100%;
        display: flex;
    }

    .service {
        padding: 20px 0;
        width: 80%;
        height: 100%;
    }

    .rank {
        margin-left: 20px;
        margin-bottom: 20px;
        width: 25%;
        height: 100%;
        background-color: white;
        padding: 0 15px;
    }

    .rank-title {
        text-align: center;
        padding-top: 10px;
    }

    .filter {
        padding: 10px;
        display: flex;
        flex-direction: column;
    }

    .item {
        margin: 3px 0;
    }
</style>
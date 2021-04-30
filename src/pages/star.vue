<template>
    <Page>
        <div slot="center" class="user-container">
            <div class="content">
                <div class="box shadow">
                    <div class="radio">
                        <el-page-header @back="$router.back()"
                                        style="display: flex;padding: 10px 20px;;align-items: center">
                            <el-breadcrumb slot="content" separator="/"
                                           style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item>收藏</el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-page-header>
                        <el-radio-group v-model="radio">
                            <el-radio-button label="商店"></el-radio-button>
                            <el-radio-button label="产品"></el-radio-button>
                        </el-radio-group>
                        <div style="width: 240px;"/>
                    </div>
                    <div class="data">
                        <StarItem :stars="stars" :span="4" v-if="radio === '商店'" :type="radio"/>

                        <StarItem :stars="stars" :span="4" v-if="radio === '产品'" :type="radio"/>

                        <el-pagination class="pagination" layout="prev, pager, next" :total="total"
                                       :page-size="pageSize"
                                       v-if="total !== 0" @current-change="getPageData">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </Page>
</template>

<script>

    import {findStarByProduct, findStarByStore} from "@/utils/api/star";
    import StarItem from "@/components/star-item";

    export default {
        name: "star",
        components: {StarItem},
        data() {
            return {
                radio: '商店',
                pageNo: 1,
                stars: [],
                pageSize: 8,
                total: 0
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getStores() {
                findStarByStore(this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        let data = res.data;
                        this.stars = data.list;
                        this.total = data.total;
                    }
                })
            },
            getProducts() {
                findStarByProduct(this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        let data = res.data;
                        this.stars = data.list;
                        this.total = data.total;

                    }
                });
            },
            getData() {
                if (this.radio === '商店') {
                    this.getStores();
                } else if (this.radio === '产品') {
                    this.getProducts();
                }
            },
            getPageData(currentPage) {
                this.pageNo = currentPage;
                this.getData();
            }
        },
        watch: {
            radio: function () {
                this.getData();
            }
        }
    }
</script>

<style scoped>

    .user-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .box {
        height: 100%;
        width: 75%;
        background-color: white;
        display: flex;
        margin: 20px;
        flex-direction: column;
        align-items: center;
    }

    .radio {
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .data {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }
</style>
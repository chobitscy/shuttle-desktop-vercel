<template>
    <div class="container">
        <div class="content">
            <el-row v-if="stores.length !== 0">
                <el-col :span="span" v-for="store in stores" :key="store.id">
                    <el-card :body-style="{ padding: '0px' }" style="margin: 10px;" shadow="hover"
                             @click.native="$router.push('/store/' + store.id)">
                        <img :src="store.image"
                             class="image" style="height: 160px">
                        <div class="store-info">
                            <div class="store-title">
                                <span v-text="store.name"></span> <el-tag v-text="store.category.name" size="mini" effect="dark"/>
                            </div>
                            <el-rate v-model="store.rate" disabled show-score text-color="#ff9900"></el-rate>
                            <div class="sales"><i class="el-icon-medal"></i> 销量：<span v-text="store.sales"></span></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <Empty :description="'该服务暂无商店'" :svg="require('@/assets/undraw_mpty_street.svg')"
                   style="height: unset;" v-if="stores.length === 0"/>
        </div>
    </div>
</template>

<script>
    import Empty from "@/components/empty";

    export default {
        name: "service",
        components: {Empty},
        props: ['stores','span'],
        data() {
            return {
                value: 3,
                filter: false,
                category: '全部',
                sort: '最新',
                advanced: '正序'
            }
        },
        created() {

        },
        methods: {
            pageCurrent(current) {
                this.getStores(current, this.pageSize);
            }
        }
    }
</script>

<style scoped>

    .container {
        padding: 10px 0;
    }

    .image {
        width: 100%;
        display: block;
    }

    .content {
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
</style>
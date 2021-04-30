<template>
    <transition name="slide-fade">
        <div class="list-item" @click="goStore">
            <el-image class="item-image" :src="item.image" fit="cover"/>
            <div type="flex" class="goods-info">
                <div class="item-info">
                    <span v-text="item.name" class="item-name"></span>
                    <el-tag size="mini" v-text="item.store.name" effect="dark" class="tag" type="warning" slot="tag"
                            v-if="item.price != null"/>
                    <el-tag size="mini" v-text="item.services.name" effect="dark" class="tag"
                            :style="'border-color:' + item.services.color"
                            slot="tag" :color="item.services.color" v-if="item.services != null"/>
                </div>
                <div class="item-desc">
                    <el-rate v-model="item.rate" disabled text-color="#ff9900" show-score/>
                </div>
                <div class="item-tag">
                    <div>
                        <div v-if="item.price != null">
                            <i class="el-icon-price-tag"></i> 价格:
                            <span class="price-text" v-text="changePrice(item.price)"/>
                        </div>
                        <div>
                            <i class="el-icon-medal"></i> 销量: <span>{{ + item.sales}}</span>
                        </div>
                    </div>
                    <ProductDialog :product="item" :value="null">
                        <el-button v-if="item.price != null" size="mini" icon="el-icon-plus" slot="btn" round/>
                    </ProductDialog>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import ProductDialog from "@/components/product-dialog";
    import common from "@/utils/common";

    export default {
        name: "popular-item",
        components: {ProductDialog},
        props: ['item'],


        computed:{
            changePrice(){
                return(price)=>{
                    return common.changePrice(price);
                }
            }
        },
        methods: {
            goStore() {
                if (this.item.services != null) this.$router.push('/store/' + this.item.id)
            }
        }
    }
</script>

<style scoped lang="scss">
    .list-item {
        display: flex;
        background-color: #ffffff;
        border-bottom: 1px solid #dddddd;
        font-size: smaller;
        padding: 10px 0;

        & > * {
            margin: 5px;
        }

        .goods-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;

            .item-desc {
                margin: 3px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .create {
                align-self: flex-end;
            }
        }
    }

    .el-tag--mini {
        height: 18px;
        line-height: 17px;
    }

    .item-tag {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .item-image {
        width: 80px;
        height: 80px;
        margin-top: 10px
    }

    .item-info {
        display: flex;
        align-items: center;
    }

    .item-name {
        margin: 3px;
        font-size: 15px
    }

    .item-button {
        float: right;
    }

</style>
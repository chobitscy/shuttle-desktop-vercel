<template>
    <transition name="slide-fade">
        <div class="list-item" v-if="count == null?true:count > 0">
            <el-image class="item-image" :src="item.image" fit="cover"/>
            <div type="flex" class="goods-info">
                <div>
                    <div class="item-info">
                        <span v-text="item.name" class="item-name"></span>
                        <el-tag size="mini" v-text="item.storeName" effect="dark" class="tag" type="warning"
                                slot="tag"/>
                    </div>
                    <div class="item-desc">
                        <el-rate v-model="item.rate" disabled text-color="#ff9900" show-score/>
                    </div>
                    <div class="item-tag">
                        <div>
                            <div>
                                <i class="el-icon-price-tag"></i> 价格:
                                <span v-text="getPrice(item.price)"/>
                            </div>
                            <div>
                                <i class="el-icon-medal"></i> 销量: <span>{{ + item.sales}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-number">
                    <el-input-number v-model="item.count" :min="0" size="mini"
                                     @change="(currentValue, oldValue) => {change(currentValue, oldValue, item)}"/>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import common from "@/utils/common";

    export default {
        name: "cart-item",
        props: ['item', 'count'],
        methods: {
            change(currentValue, oldValue, order) {
                this.$store.commit('changeCart',
                    {'currentValue': currentValue, 'oldValue': oldValue, 'id': order.id});
            },
            getPrice(price) {
                return common.changePrice(price);
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
            flex: 1;
            justify-content: space-between;

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

    .input-number {
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
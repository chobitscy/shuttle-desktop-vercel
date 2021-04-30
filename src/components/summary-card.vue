<template>
    <div class="card">
        <el-avatar
                :src="avatarUrl"
                @click.native="$router.push('/user')"
                :size="50"
        />
        <div v-text="userInfo.name" style="color: #e6a23c;margin: 10px;font-size: 18px;"/>
        <div class="count">
            <div v-for="item in countItems" :key="item" class="count-item">
                <div class="count-item-num" v-text="item.count"/>
                <div class="count-item-name" v-text="item.name"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "summary-card",
        data() {
            return {
                userInfo: {},
                countItems: [
                    {name: "待接单", count: 1},
                    {name: "已接单", count: 2},
                    {name: "已完成", count: 6},
                    {name: "已下单", count: 3},
                ],
            };
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
        },
        computed: {
            avatarUrl: function () {
                if (this.userInfo.name === null) {
                    return `https://api.multiavatar.com/null.png`;
                }
                return `https://api.multiavatar.com/${this.userInfo.name}.png`;
            },
        },
    };
</script>

<style scoped lang="scss">
    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 16px 0;
        justify-content: center;
    }

    .count {
        display: flex;
        justify-content: space-around;
        align-self: normal;
        margin: 16px 0;

        > .count-item {
            > .count-item-num {
                color: #409eff;
                text-align: center;
                font-size: 20px;
                font-weight: bolder;
            }
        }
    }
</style>
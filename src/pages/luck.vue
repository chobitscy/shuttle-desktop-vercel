<template>
    <Page>
        <div slot="center" class="user-container">
            <div class="content">
                <div class="box">
                    <LuckyGrid
                            ref="LuckDraw"
                            width="600px"
                            height="600px"
                            :prizes="prizes"
                            :blocks="blocks"
                            :buttons="buttons"
                            :default-style="defaultStyle"
                            :active-style="activeStyle"
                            @start="startCallBack"
                            @end="endCallBack"
                    />
                </div>
            </div>
        </div>
    </Page>
</template>

<script>

    import LuckDraw from 'vue-luck-draw'

    export default {
        name: "luck",
        components: [LuckDraw],
        data() {
            return {
                prizes: [],
                blocks: [
                    {padding: '1px', background: '#e2cea3', borderRadius: '13px'},
                    {padding: '5px 0px', background: '#f3ecdc', borderRadius: '13px'},
                    {padding: '1px', background: '#e2cea3', borderRadius: '8px'},
                    {padding: '15px 10px', background: '#fffcf5', borderRadius: '8px'},
                ],
                buttons: [{
                    x: 1, y: 1, background: 'rgba(0, 0, 0, 0)',
                    fonts: [
                        {
                            text: '开始',
                            top: '50%'
                        }
                    ]
                }],
                defaultStyle: {
                    background: '#ffefd6',
                    borderRadius: '5px',
                    fontColor: '#755c28',
                    fontSize: '10px',
                    lineHeight: '12px'
                },
                activeStyle: {
                    background: '#de7247',
                    fontColor: '#ffefd6',
                }
            }
        },
        mounted() {
            this.getPrizesList()
        },
        methods: {
            getPrizesList() {
                const prizes = [];
                let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
                let data = this.stores = this.$store.getters.getStoresBySid(1);
                axis.forEach((item, index) => {
                    prizes.push({
                        x: item[0], y: item[1],
                        title: data[index].name,
                        imgs: [{
                            width: '100%',
                            height: '100%',
                            src: data[index].image,
                            activeSrc: require(`../assets/undraw_Choose_bwbs.svg`)
                        }]
                    })
                });
                this.prizes = prizes
            },
            startCallBack() {
                this.$refs.LuckDraw.play();
                setTimeout(() => {
                    this.$refs.LuckDraw.stop(Math.random() * 8 >> 0)
                }, 2000)
            },
            endCallBack(prize) {
                this.$notify({
                    title: '抽奖成功！',
                    message: '今天吃 ' + prize.title,
                    type: 'warning'
                })
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
        box-shadow: 0 10px 40px -10px rgb(0 64 128 / 20%);
        border-radius: 6px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
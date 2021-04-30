<template>
    <Page>
        <div slot="center" class="order-container">
            <div class="box shadow">
                <div class="header">
                    <el-page-header @back="$router.back()"
                                    style="display: flex;padding: 10px 20px;;align-items: center">
                        <el-breadcrumb slot="content" separator="/"
                                       style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>接单</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-page-header>
                    <div class="radio">
                        <el-radio-group v-model="radio">
                            <el-radio-button label="待接单"></el-radio-button>
                            <el-radio-button label="已接收"></el-radio-button>
                            <el-radio-button label="已完成"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="tip" style="width: 240px;">
                        <div class="spinner" v-if="wsSwitch">
                            <div class="double-bounce1"></div>
                            <div class="double-bounce2"></div>
                        </div>
                        <div class="spinner" v-if="!wsSwitch">
                            <div class="double-bounce1-off"></div>
                        </div>
                        <span>实时推送：</span>
                        <el-switch
                                v-model="wsSwitch"
                                active-text="开"
                                inactive-text="关">
                        </el-switch>
                    </div>
                </div>

                <div class="filter">
                    <div>截至下单时间</div>
                    <el-date-picker
                            v-model="date"
                            type="daterange"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                    <div>服务</div>
                    <el-select v-model="serviceId" placeholder="请选择" style="width: 150px;">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <div>地址</div>
                    <el-input placeholder="请输入" v-model="address" style="width: 150px;"></el-input>
                    <div>
                        <el-button @click="filter" :disabled="!isReset || tableData.length === 0">搜索</el-button>
                    </div>
                    <div>
                        <el-button @click="reset" :disabled="isReset" type="warning" plain>重置</el-button>
                    </div>
                    <div>
                        <el-button @click="selection = !selection" v-text="selection ? '取消':'多选'"
                                   :disabled="tableData.length === 0"></el-button>
                    </div>
                </div>
                <OrderTable :table-data="tableData" :selection="selection" v-on:sectionValue="getSectionValue"
                            v-on:deleteOrder="deleteOrder" :type="'receive'" v-on:receive="receive"/>
                <div class="delete-btn">
                    <el-button v-if="selection && radio === '已完成'" type="danger" :disabled="sectionValue.length === 0"
                               @click="batchDelete()">批量删除
                    </el-button>
                    <el-button v-if="selection && radio === '待接单'" type="success" :disabled="sectionValue.length === 0">
                        批量接单
                    </el-button>
                </div>
                <el-pagination class="pagination" layout="prev, pager, next" :total="total" :page-size="pageSize"
                               v-if="total !== 0 && !selection" @current-change="getPageData">
                </el-pagination>
            </div>
        </div>
    </Page>
</template>

<script>

    import Page from "@/layout/page";
    import OrderTable from "@/components/order-table";
    import {
        deleteOrder, findByReceive, findBySidOrPresent, findBySidOrCompleted, searchByReceive, Receive
    } from "@/utils/api/order";
    import common from "@/utils/common";

    export default {
        name: "receive",
        components: {OrderTable, Page},
        data() {
            return {
                activeName: 'first',
                tableData: [],
                total: 0,
                pageSize: 9,
                pageNo: 1,
                radio: '待接单',
                date: null,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                options: [
                    {
                        value: 1,
                        label: '外卖'
                    },
                    {
                        value: 2,
                        label: '超市'
                    },
                    {
                        value: 3,
                        label: '打印'
                    }
                ],
                serviceId: null,
                address: null,
                isReset: true,
                selection: false,
                sectionValue: [],
                wsSwitch: true,
                ws: null,
                userInfo: null
            }
        },
        created() {
            this.enableWs();
            this.userInfo = common.getUserInfo();
        },
        computed: {
            getService() {
                return (serviceId) => {
                    const serviceList = this.$store.getters.getService;
                    return serviceList.filter(service => service.id === serviceId)[0];
                }
            }
        },
        mounted() {
            this.load();
        },
        methods: {
            changeDate(date) {
                return new Date(date).toLocaleDateString()
            },
            getStatusIcon(status) {
                if (status === -1) {
                    return 'el-icon-loading'
                } else if (status === 0) {
                    return 'el-icon-shopping-cart-full'
                } else if (status === 1) {
                    return 'el-icon-circle-check'
                }
            },
            getStatusType(status) {
                if (status === -1) {
                    return 'primary'
                } else if (status === 0) {
                    return 'warning'
                } else if (status === 1) {
                    return 'success'
                }
            },
            getStatus(status) {
                if (status === -1) {
                    return '待接单'
                } else if (status === 0) {
                    return '配送中'
                } else if (status === 1) {
                    return '已完成'
                }
            },
            findByReceive() {
                findByReceive(this.pageNo).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                });
            },
            findBySidOrPresent() {
                findBySidOrPresent(this.userInfo.id, this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            findBySidOrCompleted() {
                findBySidOrCompleted(this.userInfo.id, this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            getPageData(currentPage) {
                this.pageNo = currentPage;
                this.load()
            },
            getOrderStatus() {
                if (this.radio === '已下单') {
                    return -1;
                } else if (this.radio === '配送中') {
                    return 0;
                } else if (this.radio === '已完成') {
                    return 1;
                }
            },
            changeDateToLocaleDateString(date) {
                return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
            },
            filter() {
                let start = null;
                let end = null;
                let serviceId = this.serviceId;
                let address = this.address;
                if (this.date !== null) {
                    start = this.changeDateToLocaleDateString(this.date[0]);
                    end = this.changeDateToLocaleDateString(this.date[1]);
                }
                if (this.serviceId === null) {
                    serviceId = 0;
                }
                searchByReceive(1, 1, 8, start, end, serviceId, address).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                        this.isReset = false;
                    }
                });

            },
            reset() {
                this.date = null;
                this.serviceId = null;
                this.address = null;
                this.isReset = true;
                this.load();
            },
            getSectionValue(value) {
                this.sectionValue = value;
            },
            batchDelete() {
                this.$confirm('此操作将永久批量删除该订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    deleteOrder(this.sectionValue,
                        {
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                        if (res.code === 1) {
                            this.$notify({
                                title: '删除成功！',
                                message: '订单已永久删除',
                                duration: 1500,
                                type: 'success'
                            });
                            this.load();
                            this.selection = false;
                        }
                    })
                }).catch(() => {
                    this.$notify({
                        title: '已取消删除',
                        message: '操作已取消',
                        duration: 1500,
                        type: 'warning'
                    });
                });
            },
            load() {
                if (this.radio === '待接单') {
                    this.findByReceive();
                } else if (this.radio === '已接收') {
                    this.findBySidOrPresent();
                } else if (this.radio === '已完成') {
                    this.findBySidOrCompleted();
                }
            },
            deleteOrder(row) {
                this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    deleteOrder([{
                            id: row.id,
                            cid: row.cid,
                            status: row.status
                        }],
                        {
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        }).then(res => {
                        if (res.code === 1) {
                            this.$notify({
                                title: '删除成功！',
                                message: '订单已永久删除',
                                duration: 1500,
                                type: 'success'
                            });
                            this.load();
                        }
                    })
                }).catch(() => {
                    this.$notify({
                        title: '已取消删除',
                        message: '操作已取消',
                        duration: 1500,
                        type: 'warning'
                    });
                });
            },
            enableWs() {
                this.ws = new WebSocket(process.env.VUE_APP_WS);
                let self = this;
                this.ws.onopen = function () {
                    self.$notify({
                        title: '已连接',
                        message: '实时推送已打开',
                        type: 'success',
                        duration: 2000,
                        position: 'bottom-right'
                    });
                };
                this.ws.onmessage = function (evt) {
                    self.tableData.unshift(JSON.parse(evt.data));
                };
                this.ws.onclose = function () {
                    self.$notify({
                        title: '已关闭',
                        message: '实时推送已关闭',
                        type: 'warning',
                        duration: 2000,
                        position: 'bottom-right'
                    });
                };
            },
            receive(orderId) {
                this.$confirm('接单会消耗1积分，确定接受该订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Receive({
                        orderId: orderId,
                        userId: common.getUserInfo().id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$notify({
                                type: 'success',
                                title: '操作成功',
                                message: '接单成功'
                            });
                            this.load();
                        }
                    })
                }).catch(() => {
                });
            },
        },
        watch: {
            radio: function () {
                this.load();
            },
            wsSwitch: function () {
                if (("WebSocket" in window) && this.wsSwitch) {
                    this.enableWs();
                }
                if (!this.wsSwitch) {
                    this.$notify({
                        title: '已关闭',
                        message: '实时推送已关闭',
                        type: 'warning',
                        duration: 2000,
                        position: 'bottom-right'
                    });
                }
            }
        }
    }
</script>

<style scoped>

    @import "../style/spinner.css";

    .order-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .box {
        margin: 30px 0;
        background-color: white;
        display: flex;
        flex-direction: column;
        width: 75%;
    }

    .radio {
        margin: 10px 25px;
        display: flex;
        justify-content: space-between;
    }

    .pagination {
        flex: 1;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .filter {
        width: 100%;
        margin: 10px 0;
        color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .filter > div {
        margin-left: 12px;
    }

    .delete-btn {
        width: 100%;
        display: flex;
        margin-top: 3px;
        justify-content: center;
    }

    .tip {
        display: flex;
        justify-content: center;
        align-items: center;
        color: gray;
        font-size: 13px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center
    }
</style>
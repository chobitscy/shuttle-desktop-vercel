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
                            <el-breadcrumb-item>订单</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-page-header>
                    <div class="radio">
                        <el-radio-group v-model="radio">
                            <el-radio-button label="已下单"></el-radio-button>
                            <el-radio-button label="配送中"></el-radio-button>
                            <el-radio-button label="已完成"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div style="width: 240px;"/>
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
                    <div>产品</div>
                    <el-select v-model="productId" placeholder="请选择" style="width: 150px;">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <div>服务者</div>
                    <el-input placeholder="请输入" v-model="serverId" style="width: 150px;"></el-input>
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
                            v-on:deleteOrder="deleteOrder" :type="'order'" v-on:completeOrder="completeOrder"/>
                <div class="delete-btn">
                    <el-button v-if="selection" type="danger" :disabled="sectionValue.length === 0"
                               @click="batchDelete()">批量删除
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
        findByCidOrOrder,
        findByCidOrPresent,
        findByCidOrCompleted,
        searchByCid,
        deleteOrder, complete
    } from "@/utils/api/order";
    import common from "@/utils/common";

    export default {
        name: "order",
        components: {OrderTable, Page},
        data() {
            return {
                activeName: 'first',
                tableData: [],
                total: 0,
                pageSize: 8,
                pageNo: 1,
                radio: '已下单',
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
                        label: '咖啡馆'
                    },
                    {
                        value: 2,
                        label: '咖啡馆'
                    },
                    {
                        value: 3,
                        label: '咖啡馆'
                    }
                ],
                productId: null,
                serverId: null,
                isReset: true,
                selection: false,
                sectionValue: [],
                userInfo: null
            }
        },
        created() {
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
            if (this.radio === '已下单') {
                this.getOrder();
            } else if (this.radio === '配送中') {
                this.getOrdersByCidOrPresent();
            } else if (this.radio === '已完成') {
                this.getOrdersByCidOrCompleted();
            }
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
            getOrder() {
                findByCidOrOrder(this.userInfo.id, this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            getOrdersByCidOrPresent() {
                findByCidOrPresent(this.userInfo.id, this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            getOrdersByCidOrCompleted() {
                findByCidOrCompleted(this.userInfo.id, this.pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            getPageData(currentPage) {
                this.pageNo = currentPage;
                if (this.radio === '已下单') {
                    this.getOrder();
                } else if (this.radio === '配送中') {
                    this.getOrdersByCidOrPresent()
                } else if (this.radio === '已完成') {
                    this.getOrdersByCidOrCompleted()
                }
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
                let productId = this.productId;
                let serverId = this.serverId;
                if (this.date !== null) {
                    start = this.changeDateToLocaleDateString(this.date[0]);
                    end = this.changeDateToLocaleDateString(this.date[1]);
                }
                if (this.productId === null) {
                    productId = 0;
                }
                if (this.serverId === null) {
                    serverId = 0;
                }
                searchByCid(1, 1, 8, start, end, productId, parseInt(serverId), this.getOrderStatus()).then(res => {
                    if (res.code === 1) {
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                        this.isReset = false;
                    }
                });

            },
            reset() {
                this.date = null;
                this.productId = null;
                this.serverId = null;
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
                if (this.radio === '已下单') {
                    this.getOrder();
                } else if (this.radio === '配送中') {
                    this.getOrdersByCidOrPresent();
                } else if (this.radio === '已完成') {
                    this.getOrdersByCidOrCompleted();
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
            completeOrder(order) {
                const data = {
                    id: order.id,
                    cid: order.cid,
                    sid: order.sid,
                    pid: order.pid,
                    file: order.file
                };
                this.$confirm('请确定商品已配送到，确定完成该订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    complete(data).then(res => {
                        if (res.code === 1) {
                            this.$message.success('签收成功！');
                            this.load();
                        } else {
                            this.$message.error('订单已取消');
                        }
                    });
                }).catch(() => {
                });
            },
        },
        watch: {
            radio: function () {
                if (this.radio === '已下单') {
                    this.getOrder();
                } else if (this.radio === '配送中') {
                    this.getOrdersByCidOrPresent()
                } else if (this.radio === '已完成') {
                    this.getOrdersByCidOrCompleted()
                }
            }
        }
    }
</script>

<style scoped>

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
        margin: 10px 0;
        display: flex;
        justify-content: center;
    }

    .pagination {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
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

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center
    }
</style>
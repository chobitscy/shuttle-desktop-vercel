<template>
    <div class="container">
        <el-table
                style="width: 100%;"
                :stretch="true"
                :data="tableData"
                @selection-change="handleSelectionChange">
            <el-table-column
                    v-if="selection"
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="product"
                    align="center">
                <template slot="header">
                    <i class="el-icon-goods"> 商品</i>
                </template>
                <template slot-scope="scope">
                    <el-tag effect="dark" v-text="scope.row.product.name"></el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center">
                <template slot="header">
                    <i class="el-icon-price-tag"> 价格</i>
                </template>
                <template slot-scope="scope">
                    <div class="price-txt" v-text="changePrice(scope.row.product.price)"></div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="storeName"
                    align="center">
                <template slot="header">
                    <i class="el-icon-shopping-cart-1"> 商店</i>
                </template>
            </el-table-column>
            <el-table-column
                    align="center">
                <template slot="header">
                    <i class="el-icon-guide"> 服务</i>
                </template>
                <template>
                    <div v-text="'外卖'"></div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="type === 'receive'"
                    prop="address"
                    align="center">
                <template slot="header">
                    <i class="el-icon-school"> 地址</i>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="type === 'receive'"
                    align="center">
                <template slot="header">
                    <i class="el-icon-user"> 客户</i>
                </template>
                <temlate slot-scope="scope">
                    <el-link v-text="scope.row.client.name" @click="showClientInfo(scope.row.client)"></el-link>
                </temlate>
            </el-table-column>
            <el-table-column
                    v-if="type === 'order'"
                    align="center">
                <template slot="header">
                    <i class="el-icon-headset"> 服务者</i>
                </template>
                <template slot-scope="scope">
                    <div v-text="scope.row.status === -1 ? '暂无':scope.row.service.name"/>
                </template>
            </el-table-column>
            <el-table-column
                    prop="file"
                    align="center">
                <template slot="header">
                    <i class="el-icon-files"> 文件</i>
                </template>
                <template slot-scope="scope">
                    <div v-if="scope.row.file === null">无</div>
                    <el-link :href="'/api/file/download/' + scope.row.file" v-if="scope.row.file !== null"
                             type="primary">下载
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="note"
                    align="center">
                <template slot="header">
                    <i class="el-icon-notebook-1"> 备注</i>
                </template>
                <template slot-scope="scope">
                    <div v-if="scope.row.note === null">无</div>
                    <el-link v-if="scope.row.note !== null" type="warning" @click="showData(scope.row.note)">查看
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column
                    width="200px"
                    align="center">
                <template slot="header">
                    <i class="el-icon-time"> 时间</i>
                </template>
                <template slot-scope="scope">
                    <div v-text="changeDateToLocaleDateString(scope.row.date)"></div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    align="center">
                <template slot="header">
                    <i class="el-icon-coordinate"> 状态</i>
                </template>
                <template slot-scope="scope">
                    <el-tag :type="getStatusType(scope.row.status)">
                        <i :class="getStatusIcon(scope.row.status)"></i>
                        {{getStatus(scope.row.status)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center">
                <template slot="header">
                    <i class="el-icon-s-operation"> 操作</i>
                </template>
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteOrder(scope.row)"
                               v-if="(type === 'order' && scope.row.status !== 0) || (type === 'receive' && scope.row.status >= 0)"
                               :disabled="scope.row.status === 0">删除
                    </el-button>
                    <el-button type="success" size="mini" v-if="type === 'receive' && scope.row.status === -1"
                               @click="receive(scope.row.id)">接单
                    </el-button>
                    <el-button type="success" size="mini" v-if="(type === 'order' && scope.row.status === 0)"
                               @click="completeOrder(scope.row)">
                        完成
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Empty :description="'暂无订单数据'" :svg="require('@/assets/undraw_blank_canvas_3rbb.svg')"
               v-if="tableData.length === 0"/>
        <el-dialog title="客户详情" :visible.sync="dialogClientVisible" width="20%" center>
            <div class="client-dialog">
                <div>
                    <i class="el-icon-phone"></i> <span v-text="'电话：' + client.phone"></span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import Empty from "@/components/empty";
    import common from "@/utils/common";

    export default {
        name: "order-table",
        components: {Empty},
        props: ['tableData', 'selection', 'type'],
        data() {
            return {
                dialogClientVisible: false,
                client: {
                    phone: null
                }
            }
        },
        computed: {
            changePrice() {
                return (price) => {
                    return common.changePrice(price);
                }
            }
        },
        methods: {
            changeDateToLocaleDateString(date) {
                return new Date(date).toLocaleString()
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
            deleteOrder(row) {
                this.$emit('deleteOrder', row);
            },
            changeDate(date) {
                return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
            },
            handleSelectionChange(val) {
                this.$emit('sectionValue', val);
            },
            showData(data) {
                this.$alert(data, '详情', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$notify({
                            type: 'info',
                            title: action
                        });
                    }
                });
            },
            receive(orderId) {
                this.$emit('receive', orderId);
            },
            completeOrder(order) {
                this.$emit('completeOrder', order);
            },
            showClientInfo(client) {
                this.dialogClientVisible = true;
                this.client.phone = client.phone;
            }
        }
    }
</script>

<style scoped>

    .container {
        display: flex;
        flex-direction: column;
    }

    .price-txt {
        color: #e6a23c;
    }

    .client-dialog {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .client-dialog > div{
        margin: 3px 0;
    }
</style>
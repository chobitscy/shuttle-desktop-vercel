<template>
    <Page>
        <div slot="center" class="user-container">
            <div class="content">
                <div class="box shadow">
                    <div class="left">
                        <div class="cells">
                            <div>
                                <el-page-header @back="$router.back()"
                                                style="display: flex;padding: 10px 5px;;align-items: center">
                                    <el-breadcrumb slot="content" separator="/"
                                                   style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                                        <el-breadcrumb-item>用户</el-breadcrumb-item>
                                        <el-breadcrumb-item v-text="status()" v-if="status() !== ''"
                                                            style="color:#606266;"></el-breadcrumb-item>
                                    </el-breadcrumb>
                                </el-page-header>
                            </div>
                            <div class="cell" @click="showRight('name')">
                                <div class="cell-content">
                                    <div><i class="el-icon-user"> 昵称</i></div>
                                    <div v-text="userInfo.name" class="cell-text"></div>
                                </div>
                                <div>
                                    <div class="spinner-in" v-if="showName">
                                        <div class="double-bounce1-in"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="cell" @click="showRight('phone')">
                                <div class="cell-content">
                                    <div><i class="el-icon-mobile-phone"> 电话</i></div>
                                    <div v-text="userInfo.phone" class="cell-text"></div>
                                </div>
                                <div>
                                    <div class="spinner-in" v-if="showPhone">
                                        <div class="double-bounce1-in"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="cell" @click="showRight('email')">
                                <div class="cell-content">
                                    <div><i class="el-icon-message"> 邮箱</i></div>
                                    <div v-text="userInfo.email" class="cell-text"></div>
                                </div>
                                <div>
                                    <div class="spinner-in" v-if="showEmail">
                                        <div class="double-bounce1-in"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="cell" @click="showRight('address')">
                                <div class="cell-content">
                                    <div><i class="el-icon-location-information"> 地址</i></div>
                                    <div v-text="userInfo.address" class="cell-text"></div>
                                </div>
                                <div>
                                    <div class="spinner-in" v-if="showAddress">
                                        <div class="double-bounce1-in"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="cell" @click="showRight('recharge')">
                                <div class="cell-content">
                                    <div><i class="el-icon-bank-card"> 充值</i></div>
                                    <div v-text="score" class="cell-text"/>
                                </div>
                                <div>
                                    <div class="spinner-in" v-if="showRecharge">
                                        <div class="double-bounce1-in"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="cell" @click="showRight('resetPassword')">
                                <div class="cell-content">
                                    <div><i class="el-icon-lock"> 修改密码</i></div>
                                </div>
                                <div>
                                    <div class="spinner-in" v-if="showResetPassword">
                                        <div class="double-bounce1-in"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <el-button type="danger" icon="el-icon-switch-button" style="width: 100%;" @click="exit()">
                                退出登录
                            </el-button>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-container" v-if="showName">
                            <img src="../assets/undraw_Profile_data_re_v81r.svg" class="svg">
                            <el-input style="width: 300px;" v-model="inputValue.name" placeholder="输入昵称，回车以保存"
                                      @change="updateUserInfo"/>
                        </div>
                        <div class="right-container" v-if="showPhone">
                            <img src="../assets/undraw_phone_call_grmk.svg" class="svg">
                            <el-input style="width: 300px;" v-model="inputValue.phone" placeholder="请输入手机号，回车以保存"
                                      @change="updateUserInfo"/>
                        </div>
                        <div class="right-container" v-if="showEmail">
                            <img src="../assets/undraw_phone_call_grmk.svg" class="svg">
                            <el-input style="width: 300px;" v-model="inputValue.email" placeholder="请输入邮箱，回车以保存"
                                      @change="updateUserInfo"/>
                        </div>
                        <div class="right-container" v-if="showAddress">
                            <img src="../assets/undraw_delivery_address_03n0.svg" class="svg">
                            <el-input style="width: 300px;" v-model="inputValue.address" placeholder="请输入地址，回车以保存"
                                      @change="updateUserInfo"/>
                        </div>
                        <div class="right-container" v-if="showResetPassword">
                            <img src="../assets/undraw_secure_login_pdn4.svg" class="svg">
                            <el-input style="width: 300px;" v-model="resetPassword" placeholder="请输入新密码"
                                      type="password"/>
                            <el-input style="width: 300px;margin-top: 20px" v-model="reResetPassword"
                                      placeholder="请再次输入新密码，回车以修改" @change="reset" type="password"/>
                        </div>
                        <div class="right-container" v-if="showRecharge">
                            <img src="../assets/undraw_pay_online_b1hk.svg" class="svg">
                            <div style="width: 50%;">
                                <el-input placeholder="请输入充值金额" v-model="total" suffix-icon="el-icon-wallet"/>
                                <el-divider>
                                    <span style="color: #909399">快捷支付金额</span>
                                </el-divider>
                                <el-row :gutter="20" class="opthin-area">
                                    <el-col :span="8" v-for="item in options" :key="'o-' + item"
                                            @click.native="total = item">
                                        <div class="item" v-text="item"/>
                                    </el-col>
                                </el-row>
                                <div class="balance" style="margin-top: 30px">
                                    <div><i class="el-icon-coin"></i> 余额：</div>
                                    <div style="color: #e6a23c" v-text="score + '积分'"></div>
                                </div>
                                <form action="/api/user/recharge" method="post" class="recharge-form">
                                    <input :value="userInfo.id" name="userId" style="display: none"/>
                                    <input :value="total" name="total" style="display: none" required/>
                                    <button type="submit" class="btn" @click="check"
                                            :style="total === ''?'background-color: #a0cfff':''">
                                        充值
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div class="right-container" v-if="empty">
                            <Empty :svg="require('@/assets/undraw_Choose_bwbs.svg')" :description="'请选择左侧对应选项'"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Page>
</template>

<script>

    import Page from "@/layout/page";
    import {findScore, reset, update} from "@/utils/api/user";
    import Empty from "@/components/empty";

    export default {
        components: {Empty, Page,},
        name: "edit",
        data() {
            return {
                userInfo: {
                    name: null,
                    phone: null,
                    address: null,
                },
                resetPassword: null,
                reResetPassword: null,
                showName: false,
                showPhone: false,
                showAddress: false,
                showResetPassword: false,
                inputValue: {
                    name: null,
                    phone: null,
                    address: null,
                    email: null
                },
                showRecharge: false,
                options: [5, 10, 20, 30, 50, 100, 200, 300, 500],
                total: '',
                score: 0,
                showEmail: false
            };
        },
        created() {
            this.getUserInfo();
            this.getScore();
        },
        methods: {
            getUserInfo() {
                this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            },
            setName: function (res) {
                this.userInfo.name = res;
                this.updateUserInfo()
            },
            setPhone: function (res) {
                this.userInfo.phone = res;
                this.updateUserInfo()
            },
            setLocal: function (res) {
                this.userInfo.address = res;
                this.updateUserInfo()
            },
            updateUserInfo() {
                let value = this.inputValue;
                value.id = this.userInfo.id;
                if (this.inputValue.name === null) {
                    value.name = this.userInfo.name;
                }
                if (this.inputValue.phone === null) {
                    value.phone = this.userInfo.phone;
                }
                if (this.inputValue.address === null) {
                    value.address = this.userInfo.address;
                }
                if (this.inputValue.email === null) {
                    value.email = this.userInfo.email;
                }
                update(value).then(res => {
                    if (res.code === 1) {
                        this.$message.success('更新成功!');
                        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                        userInfo.phone = value.phone;
                        userInfo.address = value.address;
                        userInfo.name = value.name;
                        userInfo.email = value.email;
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        this.getUserInfo()
                    }
                })
            },
            reset() {
                if (this.resetPassword === null || this.reResetPassword === null) this.$message.error('密码不能为空');
                else if (this.resetPassword === this.reResetPassword) {
                    reset({
                        id: this.userInfo.id,
                        password: this.resetPassword
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message.success('修改成功！');
                            this.dialogResetPasswordVisible = false;
                        }
                    })
                } else this.$message.error('两次密码不一致')
            },
            clickAvatar() {
                this.$confirm('头像根据昵称改变', '提示', {
                    type: 'info'
                }).then(() => {
                }).catch(() => {
                });
            },
            changeInput(value) {
                if (value === '') this.disabled = true;
                else this.disabled = false;
            },
            showRight(action) {
                if (action === 'name') {
                    this.showName = !this.showName;
                    this.showPhone = false;
                    this.showAddress = false;
                    this.showResetPassword = false;
                    this.showRecharge = false;
                    this.showEmail = false;
                } else if (action === 'phone') {
                    this.showName = false;
                    this.showPhone = !this.showPhone;
                    this.showAddress = false;
                    this.showResetPassword = false;
                    this.showRecharge = false;
                    this.showEmail = false;
                } else if (action === 'address') {
                    this.showName = false;
                    this.showPhone = false;
                    this.showAddress = !this.showAddress;
                    this.showResetPassword = false;
                    this.showRecharge = false;
                    this.showEmail = false;
                } else if (action === 'resetPassword') {
                    this.showName = false;
                    this.showPhone = false;
                    this.showAddress = false;
                    this.showResetPassword = !this.showResetPassword;
                    this.showRecharge = false;
                    this.showEmail = false;
                } else if (action === 'recharge') {
                    this.showName = false;
                    this.showPhone = false;
                    this.showAddress = false;
                    this.showResetPassword = false;
                    this.showRecharge = !this.showRecharge;
                    this.showEmail = false;
                } else if (action === 'email') {
                    this.showName = false;
                    this.showPhone = false;
                    this.showAddress = false;
                    this.showResetPassword = false;
                    this.showRecharge = false;
                    this.showEmail = !this.showEmail
                }
            },
            exit() {
                this.showRight('exit');
                this.$confirm('确定退出当前账户？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                }).catch(() => {
                });
            },
            check() {
                if (this.total === null) this.$message.error("请输入或选择金额")
            },
            getScore() {
                findScore(this.userInfo.id).then(res => {
                    if (res.code === 1) {
                        this.score = res.data;
                    }
                })
            },
            status() {
                if (this.showName) return '修改昵称';
                else if (this.showPhone) return '修改电话号';
                else if (this.showAddress) return '修改地址';
                else if (this.showResetPassword) return '修改密码';
                else if (this.showRecharge) return '充值';
                else if (this.showEmail) return '邮件';
                else return '';
            }
        },
        computed: {
            avatarUrl: function () {
                return `https://api.multiavatar.com/${this.userInfo.name}.png`;
            },
            empty() {
                return !this.showName && !this.showAddress && !this.showPhone && !this.showResetPassword && !this.showExit && !this.showRecharge;
            }
        },
    }
</script>

<style scoped>

    @import "../style/spinner.css";

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
    }

    .left {
        width: 100%;
        height: 100%;
        background-color: #f8f8f8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .right {
        width: 100%;
        height: 100%;
        background-color: #f8f8f8;
        border-left: 1px rgba(0, 0, 0, .1) solid;
    }

    .right-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .right-div {
        margin: 20px 0;
    }


    .cells {
        padding: 0 10px;
        background-color: white;
    }

    .cell {
        height: 50px;
        /*border-bottom: 1px rgba(0, 0, 0, .1) solid;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    .cell-text {
        color: gray;
    }

    .cell-content {
        display: flex;
    }

    .cell-content > div {
        margin: 5px;
    }

    .svg {
        margin-bottom: 10px;
        width: 200px;
    }

    .item {
        border-radius: 8px;
        height: 60px;
        border: 1px solid #1979db;
        margin: 8px;
        line-height: 60px;
        text-align: center;
        color: #1979db;
        font-weight: bolder;
    }

    .recharge {
        width: 100%;
    }

    .recharge-form {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .tip {
        color: #909399;
        padding: 0 30px;
    }

    .balance {
        display: flex;
        justify-content: space-between;
    }

    .btn {
        width: 100%;
        margin: 10px 0;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #409EFF;
        border: 1px solid #DCDFE6;
        color: white;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        transition: .1s;
        font-weight: 500;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
    }
</style>
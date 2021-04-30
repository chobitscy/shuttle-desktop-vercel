<template>
    <div class="container">
        <div class="box">
            <div class="right">
                <div class="right-container" style="flex: 1;width: 100%;height: 100%;">
                    <div class="info">
                        <div>shuttle</div>
                        <div style="color:gray;font-size: 15px;margin: 5px 0;">校园服务平台</div>
                    </div>
                    <div class="input-container">
                        <div v-if="send">
                            <el-input class="input" v-model="email" prefix-icon="el-icon-message" placeholder="邮箱"/>
                            <el-button style="width: 100%;margin: 10px 0" type="warning" @click="sendEmail">发送验证码
                            </el-button>
                        </div>
                        <div v-if="send === false">
                            <el-input class="input" v-model="verification" prefix-icon="el-icon-chat-dot-square"
                                      placeholder="验证码"/>
                            <el-input class="input" v-model="password" prefix-icon="el-icon-key" placeholder="密码"
                                      type="password"/>
                            <el-input class="input" v-model="rePassword" prefix-icon="el-icon-key" placeholder="重复密码"
                                      type="password"/>
                            <el-button style="width: 100%;margin: 10px 0" type="warning" @click="forget">修改密码
                            </el-button>
                        </div>
                    </div>
                    <div class="expired">
                    </div>
                </div>
                <div class="expand">
                    <div class="expand-container">
                        <div class="forget" style="display:flex;">
                            <span>已有账号？ </span>
                            <el-link style="font-size: 10px" @click="$router.push('/login')">立即登录
                            </el-link>
                        </div>
                        <div style="display:flex;">
                            <span>还没有注册？ </span>
                            <el-link style="font-size: 10px" type="primary" @click="$router.push('/register')">立即注册
                            </el-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {forget, sendEmail} from "@/utils/api/user";

    export default {
        name: "forget",
        data() {
            return {
                send: true,
                email: null,
                verification: null,
                password: null,
                rePassword: null
            }
        },
        methods: {
            forget() {
                forget({
                    token: this.verification,
                    newPassword: this.password
                }).then(res => {
                    if (res.code === 1) {
                        this.$message.success('修改成功！');
                        this.$router.push('/login');
                    }
                });
            },
            sendEmail() {
                sendEmail({
                    email: this.email
                }).then(res => {
                    if (res.code === 1) {
                        this.$message.success('发送成功！');
                        this.send = false;
                    }
                })
            }
        }
    }
</script>

<style scoped>

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #7F7FD5; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    .box {
        width: 30%;
        height: 50%;
        display: flex;
    }

    .right {
        background: rgba(255, 255, 255, .7);
        backdrop-filter: blur(10);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .right-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .info {
        margin: 0 20px;
        width: 75%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .input-container {
        width: 75%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .input {
        margin: 10px 0 0 0;
    }

    .expired {
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 5px;
    }

    .expand {
        width: 100%;
    }

    .expand-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #606266;
        font-size: 5px;
        padding: 10px;
    }
</style>
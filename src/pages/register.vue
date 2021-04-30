<template>
    <div class="container">
        <div class="box">
            <!--            <div class="left"></div>-->
            <div class="right">
                <div class="right-container" style="flex: 1;width: 100%;height: 100%;">
                    <div class="info">
                        <div>shuttle</div>
                        <div style="color:gray;font-size: 15px;margin: 5px 0;">校园服务平台</div>
                    </div>
                    <div class="input-container">
                        <el-input class="input" v-model="register_from.email" prefix-icon="el-icon-message"
                                  placeholder="邮箱"/>
                        <el-input class="input" v-model="register_from.password" prefix-icon="el-icon-key"
                                  placeholder="密码" type="password"/>
                        <el-input class="input" v-model="register_from.rePassword" prefix-icon="el-icon-key"
                                  placeholder="重复密码" type="password"/>
                        <el-button style="width: 100%;margin: 10px 0" type="success" @click="register">注册</el-button>
                    </div>
                    <div class="expired">
                    </div>
                </div>
                <div class="expand">
                    <div class="expand-container">
                        <el-link style="font-size: 10px" class="forget" @click="$router.push('/forget')"><i
                                class="el-icon-question"></i> 忘记密码
                        </el-link>
                        <div style="display:flex;">
                            <span>已有账号？ </span>
                            <el-link style="font-size: 10px" type="primary" @click="$router.push('/login')">立即登录
                            </el-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Login, Register} from "@/utils/api/user";

    export default {
        name: "register",
        data() {
            return {
                register_from: {
                    email: null,
                    password: null,
                    rePassword: null,
                }
            }
        },
        methods: {
            register() {
                const phoneRegEx = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!Object.values(this.register_from).every(v => !!v)) {
                    this.$message.error('请输入 邮箱 或 密码 或 寝室号 或 昵称');
                } else if (this.register_from.password !== this.register_from.rePassword) {
                    this.$message.error('两次输入密码不一致');
                } else if (!phoneRegEx.test(this.register_from.email)) {
                    this.$message.error('邮箱格式错误');
                } else {
                    Register(this.register_from).then(res => {
                        if (res.code === 1) {
                            this.$message.success("注册成功！");
                            let data = {
                                account: this.register_from.email,
                                password: this.register_from.password,
                                expired: 60
                            };
                            Login(data).then(res => {
                                if (res.code === 1) {
                                    let user = res.data.user;
                                    localStorage.setItem('token', res.data.token);
                                    localStorage.setItem('userInfo', JSON.stringify(user));
                                    this.$router.push('/')
                                }
                            })
                        }
                    })
                }
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

    /*.left {*/
    /*    background-image: url("https://ae01.alicdn.com/kf/U1672d1fe49424875bd06dfcfaaf4e48fG.jpg");*/
    /*    background-size: cover;*/
    /*    width: 35%;*/
    /*    height: 100%;*/
    /*    display: flex;*/
    /*    justify-content: center;*/
    /*    align-items: center;*/
    /*}*/

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

    .radio {
        display: flex;
    }

    .expired-text {
        font-size: 10px;
        margin: 10px;
    }
</style>
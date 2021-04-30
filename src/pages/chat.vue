<template>
    <div class="chat-container">
        <el-page-header @back="$router.back()" style="width: 75%;display: flex;padding: 10px 5px;;align-items: center">
            <el-breadcrumb slot="content" separator="/"
                           style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>聊天室</el-breadcrumb-item>
            </el-breadcrumb>
        </el-page-header>
        <div class="chat-panel ui-flex shadow">
            <div class="dialog-list-section">
                <div v-for="dialog in dialogList"
                     :key="dialog"
                     class="dialog-item ui-flex"
                     :class="{ active: selectedDialog == dialog.key }"
                     @click="selectedDialog = dialog.key">
                    <el-avatar class="icon" :src="dialog.icon" :size="40"/>
                    <div class="pre-view ui-flex" flex="@1 column">
                        <div v-text="dialog.title"/>
                        <div class="msg" v-text="newestMsg[dialog.key]"/>
                    </div>
                </div>
            </div>
            <div class="chat-section ui-flex" flex="@1 column">
                <div class="message-section ui-scrollbar" flex="@1 @scroll">
                    <div class="message-item ui-flex"
                         v-for="msg in messageList"
                         :key="msg"
                         :class="{ self: msg.sender.id == userInfo.id }">
                        <el-avatar class="avatar"
                                   :src="`https://api.multiavatar.com/${msg.sender.name}.png`"
                                   :size="32"/>
                        <div class="content shadow" v-text="msg.content"/>
                    </div>
                </div>
                <div class="text-input-section">
                    <textarea class="textarea ui-scrollbar" v-model="textareaValue"/>
                    <div class="ui-flex">
                        <div flex="@1"/>
                        <el-button type="primary"
                                   :disabled="textareaValue.length == 0"
                                   size="medium"
                                   @click="sendMsg">
                            <i class="el-icon-s-promotion"></i> 发送
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                textareaValue: "",
                selectedDialog: "o3LL99gg547P",
                userInfo: JSON.parse(localStorage.getItem("userInfo")),
                dialogList: [
                    {
                        title: "客服",
                        type: "dialog.person",
                        icon: "https://api.multiavatar.com/service.png",
                        key: "o3LL99gg547P",
                    },
                ],
                message: {
                    o3LL99gg547P: [
                        {
                            sender: {name: "service"},
                            type: "MSG.TEXT",
                            content: "请问需要什么帮助吗？",
                            timestamp: new Date().getTime(),
                        },
                    ],
                    HYq6hm8S5KqP: [],
                    H5Q45sewK6be: [],
                },
                newestMsg: {
                    o3LL99gg547P: "hello world",
                },
            };
        },
        created: function () {
            for (var key in this.$data.message) {
                let msgList = this.$data.message[key] || [];
                if (msgList.length === 0) {
                    continue;
                }
                this.$data.newestMsg[key] = msgList[msgList.length - 1].content;
            }
        },
        methods: {
            sendMsg: function () {
                let msgList = this.messageList;
                msgList.push({
                    sender: this.$data.userInfo,
                    type: "MSG.TEXT",
                    content: this.$data.textareaValue,
                    timestamp: new Date().getTime(),
                });
                setTimeout(() => {
                    msgList.push(
                        {
                            sender: {name: "service"},
                            type: "MSG.TEXT",
                            content: "你的反馈已发送到后台，等待处理中...",
                            timestamp: new Date().getTime(),
                        },
                    )
                }, 2000);
                this.$data.newestMsg[
                    this.$data.selectedDialog
                    ] = this.$data.textareaValue;
                this.$data.textareaValue = "";
            },
        },
        computed: {
            messageList() {
                return this.$data.message[this.$data.selectedDialog];
            },
        },
    };
</script>

<style lang="scss" scoped>
    .chat-panel {
        width: 75vw;
        height: 85%;
        border-radius: 6px;
        overflow: hidden;

        & > .dialog-list-section {
            width: 200px;
            border-right: 1px solid #ddd;

            & > .dialog-item {
                padding: 10px;
                border-bottom: 1px solid #ddd;
                cursor: pointer;

                & > .icon {
                    margin-right: 10px;
                }

                & > .pre-view > .msg {
                    font-size: xx-small;
                    word-break: break-word;
                    max-height: 2em;
                    color: gray;
                }
            }

            & > .dialog-item.active {
                background-color: #ddd;
            }
        }

        & > .chat-section {
            & > .message-section {
                padding: 10px;

                & > .message-item {
                    margin: 10px 0;

                    &.self {
                        flex-direction: row-reverse;
                    }

                    & > .avatar {
                        flex-shrink: 0;
                    }

                    & > .content {
                        background-color: #eee;
                        padding: 6px;
                        border-radius: 6px;
                        margin: 0 7px;
                        align-self: baseline;
                        word-wrap: break-word;
                        word-break: break-word;
                    }
                }
            }

            & > .text-input-section {
                padding: 10px;
                box-shadow: 0 0 5px 0px #c5c5c58c;

                & > .textarea {
                    height: 6em;
                    width: 100%;
                    border: none;
                    padding: 0;
                    resize: none;
                    background-color: transparent;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }

    .ui-scrollbar {
        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: #55555540;
        }

        &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: transparent;
        }
    }

    /* flex布局 */
    .ui-flex {
        display: flex;

        &[flex~="column"] {
            flex-direction: column;
        }

        & > [flex~="@1"] {
            flex: 1;
            overflow: hidden;
        }

        & > [flex~="@1"][flex~="@scroll"] {
            overflow-y: auto;
        }
    }

    .chat-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>
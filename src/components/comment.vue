<template>
    <div class="container">
        <div class="input-container">
            <div>
                <el-input type="textarea" v-model="content" rows="5" placeholder="请输入评论"/>
            </div>
            <div class="operate">
                <el-button @click="send">提交</el-button>
            </div>
        </div>
        <div class="comments" v-if="comments.length !== 0">
            <div class="count" v-text="total + ' 评论'"></div>
            <div class="item" v-for="item in comments" :key="item.id">

                <div class="item-info">
                    <div class="avatar">
                        <el-avatar :size="35" :src="avatarUrl(item.name)"></el-avatar>
                    </div>
                    <div class="info">
                        <div class="name" v-text="item.name"></div>
                        <div class="date" v-text="getRelativeTime(item.date)"></div>
                    </div>
                </div>
                <div class="content-container">
                    <div class="content" v-text="item.content"></div>
                    <div v-if="showDel(item.name)">
                        <el-button type="text" class="delete" @click="del(item.id)">删除</el-button>
                    </div>
                </div>
            </div>
            <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="total" class="pagination"
                           @current-change="pageCurrent"/>
        </div>
        <Empty :description="'该商店当前没有评论'" :svg="require('@/assets/undraw_Short_bio_re_fmx0.svg')"
               v-if="comments.length === 0"/>
    </div>
</template>

<script>
    import moment from 'moment'
    import {delComments, findByStoreId, insertComments} from "@/utils/api/comments";
    import Empty from "@/components/empty";

    export default {
        name: "comment",
        components: {Empty},
        props: ['storeId'],
        data() {
            return {
                comments: [],
                content: null,
                userInfo: JSON.parse(localStorage.getItem('userInfo')),
                pageNo: 1,
                pageSize: 5,
                total: 0
            }
        },
        created() {
            this.getComments(this.pageNo, this.pageSize);
            moment.locale('zh-cn');
        },
        computed: {
            avatarUrl() {
                return (name) => {
                    return `https://api.multiavatar.com/${name}.png`;
                }
            },
            showDel() {
                return (userId) => {
                    return this.userInfo.name === userId;
                }
            },
            getRelativeTime() {
                return (date) => {
                    return moment(date).fromNow();
                }
            },
        },
        methods: {
            send() {
                insertComments({
                    content: this.content,
                    name: this.userInfo.name,
                    date: this.changeDate(new Date()),
                    storeId: this.storeId,
                    userId: this.userInfo.id
                }).then(res => {
                    if (res.code === 1) {
                        this.$message.success('发送成功！');
                        this.content = null;
                        this.pageNo = 1;
                        this.getComments(this.pageNo, this.pageSize);
                    }
                })
            },
            del(id) {
                this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delComments({
                        id: id,
                        userId: this.userInfo.id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message.success('删除成功！');
                            this.pageNo = 1;
                            this.getComments(this.pageNo, this.pageSize);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            getComments(pageNo, pageSize) {
                findByStoreId(this.storeId, pageNo, pageSize).then(res => {
                    if (res.code === 1) {
                        this.comments = res.data.list;
                        this.total = res.data.count;
                    }
                });
            },
            changeDate(date) {
                return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
            },
            pageCurrent(current) {
                this.getComments(current, this.pageSize);
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
        flex-direction: column;
    }

    .input-container {
        padding: 0 20px;
    }
    .operate {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }

    .comments {
        padding: 10px 20px;
    }

    .count {
        padding: 5px;
    }

    .item-info {
        display: flex;
    }

    .info {
        margin: 0 10px;
        font-size: 10px;
    }

    .date {
        color: gray;
    }

    .content {
        margin: 10px 43px;
        background-color: #eee;
        padding: 6px;
        border-radius: 6px;
        /*margin: 0 7px;*/
        align-self: baseline;
        word-wrap: break-word;
        word-break: break-word;
    }

    .item {
        margin: 20px 0;
    }

    .delete {
        color: #f56c6c;
    }

    .content-container {
        display: flex;
        justify-content: space-between;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
<template>
    <Page>
        <PageHeader slot="header"/>

        <div slot="center" class="add-container">
            <div class="box shadow">
                <el-page-header @back="$router.push('/user')" style="display: flex;padding: 10px 20px;;align-items: center">
                    <el-breadcrumb slot="content" separator="/"
                                   style="height: 35px;width: 100%;display: flex;justify-content: center;align-items: center">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>用户</el-breadcrumb-item>
                        <el-breadcrumb-item>充值结果</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-page-header>
                <Empty description="充值成功！" :svg="require('@/assets/undraw_successful_purchase_uyin.svg')" v-if="status === '1'"/>
                <Empty description="充值失败！" :svg="require('@/assets/undraw_cancel_u1it.svg')" v-if="status === '0'"/>
            </div>
        </div>
    </Page>
</template>

<script>

    import PageHeader from "@/components/page-header";
    import Page from "@/layout/page";
    import Empty from "@/components/empty";

    export default {
        name: "result",
        components: {Empty, Page, PageHeader},
        props: {status: String}
    }
</script>

<style scoped>

    .add-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .box {
        width: 75%;
        margin: 30px 0;
    }

</style>
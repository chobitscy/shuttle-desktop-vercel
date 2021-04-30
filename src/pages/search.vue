<template>
    <div class="container">
        <div class="search">
            <el-input suffix-icon="el-icon-search" v-model="keywords" placeholder="搜索你感兴趣的内容" @change="search()"
                      @input="show_search=false"/>
            <div class="history" v-if="show_history || keywords.length === 0">
                <div v-if="history_words.length !== 0">
                    <div class="divider">
                        <li class="el-icon-time divider"> 搜索历史</li>
                    </div>
                    <el-tag
                            v-for="word in history_words"
                            :key="word.keywords"
                            closable
                            class="history"
                            @click="clickTag(word.keywords)"
                            @close="removeWords(word)"
                            :disable-transitions="false"
                            :color="word.color"
                            :style="'border-color:' + word.color">
                        {{word.keywords}}
                    </el-tag>
                </div>
            </div>
            <div style="flex: 1" v-if="show_search">
                <div v-if="results.length === 0" class="empty">
                    暂无搜索结果
                </div>
                <div v-if="results.length > 0" class="result">
                    <PopularItem v-for="result in results" :key="result.content.name" :item="result.content"
                                 class="item"/>
                </div>
            </div>
        </div>
        <div class="close"><i class="el-icon-close" style="font-size: 35px;color: white" @click="$router.back()"></i>
        </div>
    </div>
</template>

<script>
    import common from "@/utils/common";
    import {searchProduct} from "@/utils/api/product";
    import PopularItem from "@/components/popular-item";

    export default {
        name: "search",
        components: {PopularItem},
        data() {
            return {
                keywords: null,
                history_words: this.getHistory(),
                results: [],
                show_history: true,
                timeOutEvent: 0,
                show_search: false
            }
        },
        computed: {
            getPrice() {
                return (price) => {
                    return common.changePrice(price)
                }
            },
            getServiceColor() {
                return (serviceId) => {
                    return this.$store.getters.getService.filter(service => service.id === serviceId)[0].color;
                }
            }
        },
        methods: {
            getHistory() {
                const history = localStorage.getItem('history-words');
                if (history === null) {
                    return [];
                } else {
                    return JSON.parse(history);
                }
            },
            search() {
                if (this.keywords !== '') {
                    this.show_history = false;
                    this.show_search = true;
                    searchProduct(this.keywords).then(res => {
                        if (res.code === 1) {
                            this.results = res.data.searchHits;
                        }
                        this.addWords(res.data);
                    });
                }
            },
            removeWords(word) {
                this.history_words = common.arrayRemove(this.history_words, word);
                let history = JSON.parse(localStorage.getItem('history-words'));
                let newHistory = history.filter(his => his.keywords !== word.keywords);
                localStorage.setItem('history-words', JSON.stringify(newHistory));
            },
            addWords(results) {
                const keywordsData = {
                    keywords: this.keywords,
                    color: '#909399'
                };
                if (results.length > 0) keywordsData.color = this.getServiceColor(results[0].store.serviceId);
                if (this.history_words.filter(his => his.keywords === this.keywords).length === 0)
                    this.history_words.push(keywordsData);
                let history = localStorage.getItem('history-words');
                if (history === null) history = [keywordsData];
                else {
                    history = JSON.parse(history);
                    if (history.filter(his => his.keywords === this.keywords).length === 0)
                        history.push(keywordsData);
                }
                localStorage.setItem('history-words', JSON.stringify(history));
            },
            clickTag(value) {
                this.keywords = value;
                this.search();
            }
        }
    }
</script>

<style scoped>

    .container {
        background-size: cover;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #74ebd5; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #ACB6E5, #74ebd5); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    .search {
        width: 35%;
        height: 90%;
    }

    .close {
        position: absolute;
        top: 15px;
        right: 15px;
    }

    .history {
        margin: 5px 5px;
        color: white;
        flex: 1;
    }

    .divider {
        width: 100%;
        text-align: center;
        margin: 10px 0;
        color: white;
        font-size: 2vh;
    }

    .item {
        background-color: unset;
        border-bottom: unset;
    }

    .result {
        width: 100%;
        height: 600px;
        overflow-y: scroll;
        overflow-x: unset;
    }

    .result::-webkit-scrollbar {
        width: 0 !important;
    }

    .el-tag__close {
        color: white !important;
    }

    .el-divider__text {
        background-color: #75aadf !important;
        color: #f2f6fc !important;
    }

    .el-divider {
        background-color: #f2f6fc !important;
    }

    .empty{
        width: 100%;
        height: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
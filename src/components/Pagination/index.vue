<template>
    <div class="pagination">
        <el-pagination
         v-if="mount"
         background
         layout="prev, pager, next, total"
         :total="total"
         :size="size"
         :page-size.sync="pageSize"
         :current-page.sync="currentPage"
         @current-change="changePage"
        ></el-pagination>
    </div>
</template>

<script>
import {copyObj} from '@/common/utils'
export default {
    name: 'pagination',
    props: {
        total: {
            required: true
        },
        mount: {
            default: true
        },
        size: {
            default: true
        }
    },
    watch: {
        total () {
            let currentPage = this.currentPage
            this.currentPage = 1
            this.$nextTick(() => {
                this.currentPage = currentPage
            })
        }
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 8,
        }
    },
    mounted () {
        let query = copyObj(this.$route.query)
        this.currentPage = parseInt(query.page || 1)
        this.pageSize = parseInt(this.size || 8)
    },
    methods: {
        changePage () {
            let query = copyObj(this.$route.query)
            query.page = parseInt(this.currentPage)
            this.$router.push({ name: this.$route.name, query: query })
        }
    }
}
</script>

<style lang="scss" scoped>
.pagination {
    position: absolute;
    bottom: 0.5;
    margin-top: 10px;
    width: 98%;
    text-align: center;
}
</style>

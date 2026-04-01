<template>
  <div>
    <el-card :bordered="false" shadow="never" class="ivu-mb-16" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form
          ref="formValidate"
          :model="formValidate"
          :label-width="labelWidth"
          :label-position="labelPosition"
          @submit.native.prevent
          inline
        >
          <el-form-item label="是否显示：" label-for="status">
            <el-select v-model="status" placeholder="الرجاء اختيار " clearable @change="userSearchs" class="form_content_width">
              <el-option value="all" label="全部"></el-option>
              <el-option value="1" label="显示"></el-option>
              <el-option value="0" label="不显示"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类الاسم：" prop="title" label-for="status2">
            <el-input clearable placeholder="الرجاء إدخال 分类الاسم" v-model="formValidate.title" class="form_content_width" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-db-click @click="userSearchs">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card :bordered="false" shadow="never">
      <el-button v-auth="['cms-category-create']" type="primary" v-db-click @click="add">إضافة文章分类</el-button>
      <vxe-table
        class="vxeTable mt14"
        highlight-hover-row
        :loading="loading"
        header-row-class-name="false"
        :tree-config="{ children: 'children' }"
        :data="categoryList"
      >
        <vxe-table-column field="id" title="ID" tooltip width="80"></vxe-table-column>
        <vxe-table-column field="title" tree-node title="分类الاسم" min-width="130">
          <template v-slot="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="image" title="分类图片" min-width="130">
          <template v-slot="{ row }">
            <div class="tabBox_img" v-viewer v-if="row.image">
              <img v-lazy="row.image" />
            </div>
            <div v-else>--</div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="الحالة" min-width="120">
          <template v-slot="{ row }">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="row.status"
              :value="row.status"
              @change="onchangeIsShow(row)"
              size="large"
            >
            </el-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="date" title="الخيارات" width="160" fixed="right">
          <template v-slot="{ row }">
            <a v-db-click @click="edit(row)">تحرير</a>
            <el-divider direction="vertical"></el-divider>
            <a v-db-click @click="del(row, 'حذف文章分类')">حذف</a>
            <el-divider direction="vertical"></el-divider>
            <a v-db-click @click="lookUp(row)">查看文章</a>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div class="acea-row row-right page">
        <pagination
          v-if="total"
          :total="total"
          :page.sync="formValidate.page"
          :limit.sync="formValidate.limit"
          @pagination="getList"
        />
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { categoryAddApi, categoryEditApi, categoryListApi, statusApi } from '@/api/cms';
export default {
  name: 'articleCategory',
  data() {
    return {
      grid: {
        xl: 7,
        lg: 7,
        md: 12,
        sm: 24,
        xs: 24,
      },
      loading: false,
      formValidate: {
        status: '',
        page: 1,
        limit: 20,
        type: 0,
      },
      status: '',
      total: 0,
      
      FromData: null,
      modalTitleSs: '',
      categoryId: 0,
      categoryList: [],
    };
  },
  computed: {
    ...mapState('media', ['isMobile']),
    labelWidth() {
      return this.isMobile ? undefined : '80px';
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'right';
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    ...mapMutations('userLevel', ['getCategoryId']),
    // إضافة
    add() {
      this.$modalForm(categoryAddApi()).then(() => this.getList());
    },
    // تحرير
    edit(row) {
      this.$modalForm(categoryEditApi(row.id)).then(() => this.getList());
    },
    // حذف
    del(row, tit) {
      let delfromData = {
        title: tit,
        num: 0,
        url: `cms/category/${row.id}`,
        method: 'DELETE',
        ids: '',
      };
      this.$modalSure(delfromData)
        .then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    // 列表
    getList() {
      this.loading = true;
      this.formValidate.status = this.status === 'all' ? '' : this.status;
      categoryListApi(this.formValidate)
        .then(async (res) => {
          let data = res.data;
          this.categoryList = data.list;
          this.total = data.count;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.msg);
        });
    },
    // 表格بحث
    userSearchs() {
      this.formValidate.page = 1;
      this.getList();
    },
    // تعديل是否显示
    onchangeIsShow(row) {
      let data = {
        id: row.id,
        status: row.status,
      };
      statusApi(data)
        .then(async (res) => {
          this.$message.success(res.msg);
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    // 查看文章
    lookUp(row) {
      this.$router.push({
        path: this.$routeProStr + '/cms/article/index',
        query: {
          id: row.id,
        },
      });
      //xia mian chu cun mei yong;
      this.getCategoryId(row.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabBox_img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

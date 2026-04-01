<template>
  <div>
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form
          ref="artFrom"
          :model="artFrom"
          label-width="80px"
          label-position="right"
          class="tabform"
          @submit.native.prevent
          inline
        >
          <el-form-item label="规格بحث：">
            <el-input
              clearable
              v-model="artFrom.rule_name"
              placeholder="الرجاء إدخال 规格الاسم"
              class="form_content_width"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-db-click @click="userSearchs">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card :bordered="false" shadow="never" class="ivu-mt mt16">
      <el-button v-auth="['product-rule-save']" type="primary" v-db-click @click="addAttr">إضافة商品规格</el-button>
      <el-button v-auth="['product-product-rule-delete']" v-db-click @click="del(null, '批量حذف规格')"
        >批量حذف</el-button
      >
      <el-table
        ref="table"
        :data="tableList"
        v-loading="loading"
        highlight-current-row
        :row-key="getRowKey"
        @selection-change="handleSelectRow"
        empty-text="暂无数据"
        class="mt14"
      >
        <el-table-column type="selection" width="60" :reserve-selection="true"> </el-table-column>
        <el-table-column label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模版الاسم" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.rule_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格الاسم" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.attr_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品属性" min-width="130">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.attr_value"
              :key="index"
              v-text="item"
              style="display: block"
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="الخيارات" fixed="right" width="120">
          <template slot-scope="scope">
            <a v-db-click @click="edit(scope.row)">تحرير</a>
            <el-divider direction="vertical"></el-divider>
            <a v-db-click @click="del(scope.row, 'حذف规格', scope.$index)">حذف</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="acea-row row-right page">
        <pagination
          v-if="total"
          :total="total"
          :page.sync="artFrom.page"
          :limit.sync="artFrom.limit"
          @pagination="getDataList"
        />
      </div>
    </el-card>
    <add-attr ref="addattr" @getList="userSearchs"></add-attr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import addAttr from './addAttr';
import { ruleListApi } from '@/api/product';
export default {
  name: 'productAttr',
  components: { addAttr },
  data() {
    return {
      loading: false,
      artFrom: {
        page: 1,
        limit: 20,
        rule_name: '',
      },
      tableList: [],
      total: 0,
      selectedIds: new Set(), //选中合并项的id
      ids: [],
      multipleSelection: [],
    };
  },
  computed: {
    ...mapState('admin/order', ['orderChartType']),
  },
  created() {
    this.getDataList();
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    //全选和إلغاء全选时触发
    handleSelectAll(selection) {
      if (selection.length === 0) {
        //获取table的数据；
        let data = this.$refs.table.data;
        data.forEach((item) => {
          if (this.selectedIds.has(item.id)) {
            this.selectedIds.delete(item.id);
          }
        });
      } else {
        selection.forEach((item) => {
          this.selectedIds.add(item.id);
        });
      }
      this.$nextTick(() => {
        //确保dom加载完毕
        this.setChecked();
      });
    },
    //  选中某一行
    handleSelectRow(selection) {
      const uniqueArr = [];
      const ids = [];
      for (let i = 0; i < selection.length; i++) {
        const item = selection[i];
        if (!ids.includes(item.id)) {
          uniqueArr.push(item);
          ids.push(item.id);
        }
      }
      this.selectedIds = ids;
      this.multipleSelection = uniqueArr;
      this.$nextTick((e) => {
        this.setChecked();
      });
    },
    setChecked() {
      //将new Set()转化为数组
      this.ids = [...this.selectedIds].join(',');
    },
    // حذف
    del(row, tit) {
      let data = {};
      if (tit === '批量حذف规格') {
        if (this.selectedIds.size === 0) return this.$message.warning('الرجاء اختيار 要حذف的规格！');
        data = {
          ids: this.ids,
        };
      } else {
        data = {
          ids: row.id,
        };
      }
      let delfromData = {
        title: tit,
        num: 0,
        url: `product/product/rule/delete`,
        method: 'DELETE',
        ids: data,
      };
      this.$modalSure(delfromData)
        .then((res) => {
          this.$message.success(res.msg);
          this.getDataList();
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    addAttr() {
      this.$refs.addattr.modal = true;
    },
    // تحرير
    edit(row) {
      this.$refs.addattr.modal = true;
      this.$refs.addattr.getIofo(row);
    },
    // 列表；
    getDataList() {
      this.loading = true;
      ruleListApi(this.artFrom)
        .then((res) => {
          let data = res.data;
          this.tableList = data.list;
          this.$nextTick(() => {
            //确保dom加载完毕
            this.setChecked();
          });
          this.total = res.data.count;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.msg);
        });
    },
    // 表格بحث
    userSearchs() {
      this.artFrom.page = 1;
      this.getDataList();
    },
  },
};
</script>

<style scoped></style>

<template>
  <div>
    <el-card :bordered="false" shadow="never" class="ivu-mb-16" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form
          ref="formValidate"
          :model="formValidate"
          label-width="80px"
          label-position="right"
          @submit.native.prevent
          inline
        >
          <el-form-item label="الحالة：" label-for="status1">
            <el-select v-model="status" placeholder="الرجاء اختيار " @change="userSearchs" clearable class="form_content_width">
              <el-option value="all" label="全部"></el-option>
              <el-option value="1" label="开启"></el-option>
              <el-option value="0" label="关闭"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="بحث：" label-for="status2">
            <el-input
              clearable
              placeholder="الرجاء إدخال 姓名或者账号"
              v-model="formValidate.name"
              class="form_content_width"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-db-click @click="userSearchs">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card :bordered="false" shadow="never" class="ivu-mt">
      <el-button v-auth="['setting-system_admin-add']" type="primary" v-db-click @click="add">إضافةإدارة员</el-button>
      <el-table
        :data="list"
        class="mt14"
        no-userFrom-text="暂无数据"
        no-filtered-userFrom-text="暂无筛选结果"
        v-loading="loading"
        highlight-current-row
      >
        <el-table-column label="姓名" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份" min-width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.roles.length !== 0">
              <el-tag v-for="(item, index) in scope.row.roles.split(',')" :key="index">{{ item }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后一次تسجيل الدخولالوقت" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row._last_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后一次تسجيل الدخولip" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.last_ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开启" min-width="70">
          <template slot-scope="scope">
            <el-switch
              class="defineSwitch"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
              :value="scope.row.status"
              @change="onchangeIsShow(scope.row)"
              size="large"
              active-text="开启"
              inactive-text="关闭"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="الخيارات" fixed="right" width="100">
          <template slot-scope="scope">
            <a v-db-click @click="edit(scope.row)">تحرير</a>
            <el-divider direction="vertical"></el-divider>
            <a v-db-click @click="del(scope.row, 'حذفإدارة员', scope.$index)">حذف</a>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- إضافة تحرير -->
    <admin-from :FromData="FromData" ref="adminfrom" @submitFail="submitFail"></admin-from>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { adminListApi, adminFromApi, adminEditFromApi, setShowApi } from '@/api/systemAdmin';
import adminFrom from '../../../components/from/from';
export default {
  name: 'systemAdmin',
  components: { adminFrom },
  data() {
    return {
      grid: {
        xl: 7,
        lg: 7,
        md: 12,
        sm: 24,
        xs: 24,
      },
      total: 0,
      loading: false,
      roleData: {
        status1: '',
      },
      formValidate: {
        roles: '',
        status: '',
        name: '',
        page: 1, // 当前页
        limit: 20, // 每页显示条数
      },
      status: '',
      list: [],
      FromData: null,
      modalTitleSs: '',
      ids: Number,
    };
  },
  computed: {
    ...mapState('media', ['isMobile']),
    labelWidth() {
      return this.isMobile ? undefined : '50px';
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'left';
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // تعديل是否开启
    onchangeIsShow(row) {
      let data = {
        id: row.id,
        status: row.status,
      };
      setShowApi(data)
        .then(async (res) => {
          this.$message.success(res.msg);
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    // 请求列表
    submitFail() {
      this.getList();
    },
    // 列表
    getList() {
      this.loading = true;
      this.formValidate.roles = this.formValidate.roles || '';
      adminListApi(this.formValidate)
        .then(async (res) => {
          this.total = res.data.count;
          this.list = res.data.list;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.msg);
        });
    },
    // إضافة表单
    add() {
      adminFromApi()
        .then(async (res) => {
          this.FromData = res.data;
          this.$refs.adminfrom.modals = true;
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    // تحرير
    edit(row) {
      adminEditFromApi(row.id)
        .then(async (res) => {
          if (res.data.status === false) {
            return this.$authLapse(res.data);
          }
          this.FromData = res.data;
          this.$refs.adminfrom.modals = true;
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    // حذف
    del(row, tit, num) {
      let delfromData = {
        title: tit,
        num: num,
        url: `setting/admin/${row.id}`,
        method: 'DELETE',
        ids: '',
      };
      this.$modalSure(delfromData)
        .then((res) => {
          this.$message.success(res.msg);
          this.list.splice(num, 1);
        })
        .catch((res) => {
          this.$message.error(res.msg);
        });
    },
    // 表格بحث
    userSearchs() {
      this.formValidate.status = this.status === 'all' ? '' : this.status;
      this.formValidate.page = 1;
      this.list = [];
      this.getList();
    },
  },
};
</script>

<style scoped></style>

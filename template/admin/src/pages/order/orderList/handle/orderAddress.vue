<!-- تعديل发送地址 -->
<template>
  <div class="order-address">
    <el-dialog
      title="تعديل发送地址"
      :visible.sync="modals"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="form.real_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.user_phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.user_address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-db-click @click="modals = false">إلغاء</el-button>
        <el-button type="primary" v-db-click @click="submitForm('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    addressData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      modals: false,
      form: {
        real_name: '',
        user_phone: '',
        user_address: '',
      },
    };
  },
  computed: {
    rules() {
      return {
        real_name: [{ required: true, message: 'الرجاء إدخال 收货人', trigger: 'blur' }],
        user_phone: [{ required: true, message: 'الرجاء إدخال 手机号', trigger: 'blur' }],
        user_address: [{ required: true, message: 'الرجاء إدخال 详细地址', trigger: 'blur' }],
      };
    },
  },
  watch: {
    addressData: {
      handler(newVal) {
        if (newVal) {
          this.form = newVal;
        }
      },
      deep: true,
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submitSuccess', this.form);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

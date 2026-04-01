const ruleShip = {
  deliver_name: [
    {
      required: true,
      type: 'string',
      message: 'الرجاء اختيار 快递公司',
      trigger: 'select',
    },
  ],
  deliver_number: [
    {
      required: true,
      message: 'الرجاء إدخال 快递单号',
      trigger: 'blur',
    },
  ],
};
const ruleMark = {
  mark: [
    {
      required: true,
      message: 'الرجاء إدخال 备注信息',
      trigger: 'blur',
    },
  ],
};
export { ruleShip, ruleMark };

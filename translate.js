const fs = require('fs');
const path = require('path');

const dictionary = {
    "保存": "حفظ",
    "提交": "إرسال",
    "确认": "تأكيد",
    "取消": "إلغاء",
    "搜索": "بحث",
    "删除": "حذف",
    "编辑": "تحرير",
    "修改": "تعديل",
    "添加": "إضافة",
    "返回": "عودة",
    "操作": "الخيارات",
    "详情": "تفاصيل",
    "状态": "الحالة",
    "请输入": "الرجاء إدخال ",
    "请选择": "الرجاء اختيار ",
    "用户名": "اسم المستخدم",
    "密码": "كلمة المرور",
    "时间": "الوقت",
    "名称": "الاسم",
    "确定要删除吗": "هل أنت متأكد من الحذف؟",
    "提示": "تنبيه",
    "登录": "تسجيل الدخول",
    "刷新": "تحديث",
    "管理": "إدارة"
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function translateFiles(rootDir) {
    let modifiedFiles = 0;
    walkDir(rootDir, function(filePath) {
        if (filePath.endsWith('.vue') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;
            
            for (let ch in dictionary) {
                let ar = dictionary[ch];
                let regex = new RegExp(ch, 'g');
                content = content.replace(regex, ar);
            }
            
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                modifiedFiles++;
                console.log(`Translated: ${filePath}`);
            }
        }
    });
    console.log(`Total files modified in ${rootDir}: ${modifiedFiles}`);
}

const targetDirs = [
    path.join(__dirname, 'template/admin/src'),
    path.join(__dirname, 'template/uni-app')
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Starting translation on ${dir}...`);
        translateFiles(dir);
    }
});

console.log('Automated translation complete.');

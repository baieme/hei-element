<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="userInfo.query"
            class="input-with-select input"
            clearable
            @clear="clear"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="check"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addUser"
            >添加新用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 用户列表区域 -->
      <div class="table">
              <el-table :data="userData" style="width: 100%" border>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="role_name" label="身份"> </el-table-column>
        <el-table-column prop="mobile" label="地址"> </el-table-column>
        <el-table-column prop="email" label="邮件"> </el-table-column>
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scoped.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="light"
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[2, 3, 4, 10]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- //新增用户 -->
    <el-dialog
      title="新增用户"
      :visible.sync="userVisible"
      width="30%"
      @close="closeAdd"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="userRules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息 -->
    <el-dialog title="提示" :visible.sync="editVisible" width="30%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="editRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="deleteVisible" width="30%">
      <div>
        <i class="el-icon-delete-solid" style="color: red;font-size:20px;margin-right:5px;"></i>
        <span>确定删除这条信息</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDeleteUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //   进行邮箱的验证
    var validateEmail = (rule, value, callback) => {
      var emailExp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!emailExp.test(value)) {
        callback(new Error("请输入邮箱"));
      } else {
        callback();
      }
    };
    //进行手机号的验证
    var validateNumber = (rule, value, callback) => {
      var numberExp = /^1\d{10}/;
      if (!numberExp.test(value)) {
        callback(new Error("请再次输入手机号"));
      } else {
        callback();
      }
    };
    return {
      input3: "",
      userData: [],
      userInfo: {
        query: "",
        pagenum: 1,
        pagesize: "2",
      },
      total: 0,
      userVisible: false,
      form: {
        username: "",
        password: "",
        mobile: "",
        email: "",
      },
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: "3", max: "8", message: "长度在3到8", trigger: "blur" },
        ],
        mobile: [{ validator: validateNumber, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
      },
      editVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
      editRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" },
        ],
      },
      deleteVisible: false,
      id:''
    };
  },
  methods: {
    // 获取用户数据
    async getUserData() {
      const { data: ref } = await this.$http.get("/users", {
        params: this.userInfo,
      });
      if (ref.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userData = ref.data.users;
      this.total = ref.data.total;
      console.log(this.userData);
      console.log(this.total);
      // this.userData = ref
      console.log(ref);
    },
    //pageSize 改变时会触发
    handleSizeChange(size) {
      this.userInfo.pagesize = size;
      this.getUserData();
    },
    //currentPage 改变时会触发
    handleCurrentChange(current) {
      this.userInfo.pagenum = current;
      this.getUserData();
    },
    //搜索查找
    check() {
      this.getUserData();
    },
    //搜索框清空
    clear() {
      this.getUserData();
    },
    // 添加新用户
    addUser() {
      this.userVisible = true;
    },
    submitAddUser() {
      console.log(this.form);
      this.$refs.form.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: ref } = await this.$http.post("users", this.form);
        if (ref.meta.status !== 201) {
          return this.$message.error("创建不成功");
        }
        this.$message.success("创建成功"), this.getUserData();
        this.userVisible = false;
        console.log(ref);
      });
    },
    //重置新增用户
    closeAdd() {
      this.$refs.form.resetFields();
    },
    //编辑用户
    editUser(row) {
      this.editVisible = true;
      this.editForm = row;
    },
    //确定编辑用户
    submitEditUser() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        const { data: ref } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        );
        console.log(ref, 11234);
        if (ref.meta.status !== 200) {
          return this.$message.error("编辑用户失败");
        }
        this.$message.success("编辑用户成功"), this.getUserData();
        this.editVisible = false;
      });
    },
    //修改状态
    async changeState(row) {
      const { data: ref } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (ref.meta.status !== 200) {
        return this.$message.error("设置用户状态失败");
      }
      this.$message.success("用户状态设置成功");
    },
    //删除用户
    deleteUser(row) {
      this.deleteVisible = true;
      this.id = row.id
    },
    //确定删除用户
    async submitDeleteUser(){
        this.deleteVisible = false;
        const{data:ref} = await this.$http.delete(`users/${this.id}`);
        if(ref.meta.status !== 200){
            return this.$message.error('删除失败')
        }
        this.$message.success('删除成功');
        this.getUserData();
        console.log(ref)
    }
  },
  created() {
    this.getUserData();
  },
};
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
.table {
    margin-top: 30px;
    max-height: 400px;
    overflow: auto;
}
</style>
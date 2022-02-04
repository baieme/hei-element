<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <div class="table">
        <el-table :data="roleData" style="width: 100%" border>
          <el-table-column type="expand">
            <template slot-scope="scoped">
              <div class="expand">
                <el-row
                  v-for="item in scoped.row.children"
                  :key="item.id"
                  class="col border"
                >
                  <el-col :span="5">
                    <el-tag closable @close="handleClose(scoped.row, item)">{{
                      item.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row
                      v-for="(itemChildren, index) in item.children"
                      :key="itemChildren.id"
                      class="col"
                      :class="[index !== 0 ? 'border' : '']"
                    >
                      <el-col :span="8" class="item_col">
                        <el-tag
                          type="success"
                          closable
                          @close="handleClose(scoped.row, itemChildren)"
                          >{{ itemChildren.authName }}</el-tag
                        >
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="16">
                        <el-tag
                          v-for="itemLast in itemChildren.children"
                          :key="itemLast.id"
                          type="danger"
                          closable
                          @close="handleClose(scoped.row, itemLast)"
                        >
                          {{ itemLast.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="300">
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述" width="300">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editRole(scoped.row)"
                >编辑</el-button
              >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-share"
                @click="assignRole(scoped.row)"
                >分配权限</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteRole(scoped.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="addRoleVisible"
      width="30%"
      @close="closeAddRole"
    >
      <el-form
        :model="roleForm"
        :rules="roleRules"
        ref="roleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="assignVisible"
      width="30%"
      @close="roleArray = []"
    >
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        highlight-current
        :default-checked-keys="roleArray"
        :props="defaultProps"
        ref="tree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssignVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑权限 -->
    <el-dialog title="提示" :visible.sync="editRoleVisible" width="30%">
      <el-form
        :model="editRoleForm"
        :rules="editRoleRules"
        ref="editRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleData: [],
      roleForm: {
        roleName: "",
        roleDesc: "",
      },
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      addRoleVisible: false,
      assignVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      roleArray: [],
      role: null,
      id: null,
      editRoleVisible: false,
      editRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getRoleData() {
      const { data: ref } = await this.$http.get("roles");
      if (ref.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.roleData = ref.data;
      console.log(this.roleData);
      console.log(ref, "1");
    },
    //取消权限
    async handleClose(row, tag) {
      const result = await this.$confirm("是否确认取消权限？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).catch((err) => err);
      if (result == "confirm") {
        const { data: ref } = await this.$http.delete(
          `roles/${row.id}/rights/${tag.id}`
        );
        if (ref.meta.status !== 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("取消权限成功");
        row.children = ref.data;
        console.log(ref, "234");
      } else {
        return;
      }
    },
    //添加角色
    addRole() {
      this.addRoleVisible = true;
    },
    //关闭添加角色对话框，重置数据
    closeAddRole() {
      this.$refs.roleForm.resetFields();
    },
    //确认添加角色
    submitAddRole() {
      this.$refs.roleForm.validate(async (valid) => {
        const { data: ref } = await this.$http.post("roles", this.roleForm);
        console.log(ref);
        if (ref.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.getRoleData();
        this.addRoleVisible = false;
      });
    },
    //分配权限
    async assignRole(row) {
      const { data: ref } = await this.$http.get(`rights/tree`);
      this.treeData = ref.data;
      this.role = row;
      this.getId(row, this.roleArray);
      console.log(this.roleArray);
      console.log(row, "345");
      this.assignVisible = true;
    },

    // 利用递归获得三级权限的id
    getId(node, array) {
      if (!node.children) {
        array.push(node.id);
      } else {
        node.children.forEach((el) => {
          this.getId(el, array);
        });
      }
    },
    //提交分配权限
    async submitAssignVisible() {
      console.log(this.role.id);
      let id = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      id = id.join(",");
      const { data: ref } = await this.$http.post(
        `roles/${this.role.id}/rights`,
        { rids: id }
      );
      if (ref.meta.status !== 200) {
        return this.$message.error("更新不成功");
      }
      this.$message.success("分配权限成功");
      this.assignVisible = false;
      console.log(this.role);
      this.getRoleData();
      console.log(ref);
    },
    //编辑权限
    editRole(row) {
      this.editRoleForm.roleName = row.roleName;
      this.editRoleForm.roleDesc = row.roleDesc;
      this.editRoleVisible = true;
      this.id = row.id;
    },
    //确定编辑权限
    async submitEditRole() {
      const { data: ref } = await this.$http.put(
        `roles/${this.id}`,
        this.editRoleForm
      );
      if (ref.meta.status !== 200) {
        return this.$message.error("编辑失败");
      }
      this.$message.success("编辑成功"), this.getRoleData();
      this.editRoleVisible = false;
      console.log(ref);
    },
    //删除权限
    deleteRole(row) {
      console.log('asd')
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
          const{data:ref} =await this.$http.delete(`roles/${row.id}`);
          console.log(ref)
          if(ref.meta.status !== 200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功'),
          this.getRoleData();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getRoleData();
  },
};
</script>
<style lang="scss" scoped>
.expand {
  padding: 0 60px;
}
.col {
  display: flex;
  align-items: center;
}
.border {
  border-top: 1px solid #e7e3e3;
}
.item_col {
  padding: 20px 0;
}
.el-tag {
  margin: 5px;
}
.table {
  margin-top: 30px;
  max-height: 400px;
  overflow: auto;
}
</style>
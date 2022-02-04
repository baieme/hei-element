<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card>
      <el-table :data="rightData" height="530" border style="width: 100%">
        <el-table-column type='index'></el-table-column>
        <el-table-column prop="authName" label="商品" width="300">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="300">
        </el-table-column>
        <el-table-column label="权限等级"> 
            <template slot-scope="scoped">
                <el-tag v-if = 'scoped.row.level == 0 ? 1 : "" '>一级</el-tag>
                <el-tag v-else-if = "scoped.row.level == 1 ? 1 : '' "  type='success'>二级</el-tag>
                <el-tag v-else type='danger'>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightData: [],
    };
  },
  methods:{
     async getRightData(){
          const{data:ref} = await this.$http.get(`rights/list`)
          if(ref.meta.status !== 200){
              return this.$message.error('数据获取失败')
          }
          this.rightData = ref.data;
          console.log(ref,'123')
      }
  },
  created(){
      this.getRightData();
  }
};
</script>
<style lang="scss" scoped>

</style>
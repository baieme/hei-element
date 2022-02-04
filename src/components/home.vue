<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="~@/assets/img/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="collapse" @click="collapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition = 'false'
          :unique-opened = 'true'
          :default-active = 'active'
          router
        >
          <el-submenu :index="'/'+item.path" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span class="authName">{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="children in item.children"
              :key="children.id"
              :index="'/'+children.path"
              @click = "getActive('/' + children.path)"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ children.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus: [],
      iconList: [
        "icon-users",
        "icon-3702mima",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao",
      ],
      isCollapse:false,
      active:''
    };
  },
  methods: {
    out() {
      this.$router.push("/login");
      // 清除token值
      window.sessionStorage.clear();
    },
    async getMenu() {
      const { data: ref } = await this.$http.get("/menus");
      if (ref.meta.status !== 200) return;
      this.menus = ref.data;
      this.menus.forEach((el, index) => {
        el.icon = this.iconList[index];
      });
      console.log(this.menus);
      console.log(ref);
    },
    // 菜单栏是否折叠
    collapse(){
      this.isCollapse = !this.isCollapse;
    },
    //当前点击的菜单高亮
    getActive(index){
      sessionStorage.setItem('active',index);
      this.active = index;
    }
  },
  created() {
    this.getMenu();
    this.active = sessionStorage.getItem('active')
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  height: 100%;
  width: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    height: 40px;
  }
  .logo {
    width: 230px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    span {
      font-size: 25px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .collapse {
    height:30px;
    background: #808080;
    line-height:30px;
    text-align: center;
    letter-spacing: 5px;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-menu {
  border: none;
}

.iconfont {
  margin-right: 10px;
}
</style>
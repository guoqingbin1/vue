/**
 * 系统管理 菜单管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-row>
      <!-- title -->
      <div class="modt-box">菜单管理</div>
      <el-col :span="4"> </el-col>
      <el-col :span="6">
        <div class="mod-btnbox">
          <!-- <el-button size="small" type="primary">全部展开</el-button>
          <el-button size="small" type="primary">全部压缩</el-button> -->
          <el-button size="small"
                     type="primary"
                     icon="el-icon-plus"
                     @click="dialogFormVisible = true">添加</el-button>
        </div>
        <el-tree class="treeclass"
                 ref="tree"
                 :data="treeData"
                 default-expand-all=""
                 :props="defaultProps"
                 @node-click="nodeclick"
                 @check-change="handleClick"
                 check-strictly
                 node-key="menuId"
                 show-checkbox></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="mod-btnbox">

        </div>
        <el-form ref="form"
                 :model="form"
                 label-width="80px"
                 :rules="rules">
          <el-form-item label="父级菜单"
                        prop="menuId">
            <el-select size="small"
                       v-model="form.parenterMenuName"
                       placeholder="请选择"
                       class="selectw">
              <el-option v-for="parm in fmenu"
                         :key="parm.menuId"
                         :label="parm.menuName"
                         :value="parm.menuId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称"
                        prop="menuName">
            <el-input size="small"
                      v-model="form.menuName"></el-input>
          </el-form-item>
          <el-form-item label="图标"
                        prop="icon">
            <el-input size="small"
                      v-model="form.icon"></el-input>
          </el-form-item>
          <el-form-item label="URL"
                        prop="url">
            <el-input size="small"
                      v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="顺序"
                        prop="sortNumber">
            <el-input size="small"
                      v-model="form.sortNumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="saveModule('form')">保存</el-button>
            <el-button size="small"
                       type="primary"
                       v-show="true"
                       @click="deleteModule">删除</el-button>
          </el-form-item>
        </el-form>

        <el-dialog title="添加菜单"
                   :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="父级菜单">
              <el-select size="small"
                         v-model="addform.parenterMenu"
                         placeholder="请选择父级菜单">
                <el-option label="区域一"
                           value="shanghai"></el-option>
                <el-option label="区域二"
                           value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单名称">
              <el-input size="small"
                        v-model="addform.menuName"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-input size="small"
                        v-model="addform.icon"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="URL">
              <el-input size="small"
                        v-model="addform.url"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input size="small"
                        v-model="addform.sortNumber"
                        autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer"
               class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  ModuleList,
  ModuleGet,
  ModuleNodes,
  ModuleSave,
  ModuleDelete
} from "../../api/userMG";
export default {
  data () {
    return {
      showdelete: false,
      treeData: [],
      defaultProps: {
        children: "menus",
        label: "menuName"
      },
      form: {
        addUser: "",
        editUser: "",
        addTime: "",
        editTime: "",
        moduleId: "",
        parentId: "",
        moduleLevel: "",
        systemNo: "",
        isLeaf: "",
        fullIndex: "",
        moduleIcon: "",
        moduleOrder: "",
        moduleName: "",
        moduleNotes: "",
        moduleUrl: "",
        parenterMenuName: "",
        parenterMenuId: ""
      },
      // rules表单验证
      rules: {
        menuId: [
          { required: true, message: "请选择父级菜单", trigger: "blur" }
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请输入菜单图标", trigger: "blur" }],
        url: [{ required: true, message: "请输入URL", trigger: "blur" }],
        sortNumber: [
          { required: true, message: "请输入菜单顺序", trigger: "blur" }
        ]
      },
      fmenu: [],
      params: {
        loginToken: ""
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      addform: {
        menuName: "",
        icon: "",
        url: "",
        sortNumber: "",
        parenterMenu: ""


      }
    };
  },
  /**
   * 创建完毕
   */

  created () {
    this.getdata();
    this.getmenu();
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取数据
    getdata () {
      this.params.loginToken = localStorage.getItem("logintoken");
      ModuleList(this.params)
        .then(res => {
          //console.log(res)

          this.treeData = res.data;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("菜单管理列表失败，请稍后再试！");
        });
    },
    // 添加
    addModule () {
      this.showdelete = true;
      this.form.addUser = "";
      this.form.editUser = "";
      this.form.addTime = "";
      this.form.editTime = "";
      this.form.moduleId = "";
      this.form.parentId = "";
      this.form.moduleLevel = "";
      this.form.systemNo = "";
      this.form.isLeaf = "";
      this.form.fullIndex = "";
      this.form.moduleIcon = "";
      this.form.moduleOrder = "";
      this.form.moduleName = "";
      this.form.moduleNotes = "";
      this.form.moduleUrl = "";
    },
    // 获取父级菜单
    getmenu () {
      let parm = {
        page: "1",
        limit: "10"
      };
      ModuleNodes(parm)
        .then(res => {
          this.fmenu = res.data;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("父级菜单列表获取失败，请稍后再试！");
        });
    },
    // 复选变单选
    handleClick (data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([]);
        this.$refs.tree.setCheckedNodes([data]);
        this.showdelete = true;
      } else {
        // this.showdelete = false
      }
    },
    // 点击节点
    nodeclick (arr, node, self) {
      console.log(arr);
      if (self.node.data.parentMenu == 0) {
        return;
      }
      ModuleGet(self.node.data.menuId)
        .then(res => {
          //console.log(res)
          this.form = res.data;
          this.form.parenterMenuName = res.data.parenterMenu.menuName;
          this.form.parenterMenuId = res.data.parenterMenu.menuId;
          this.$refs.tree.setCheckedNodes([]);
          this.$refs.tree.setCheckedNodes([arr]);
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("用户管理获取失败，请稍后再试！");
        });
    },
    // 保存菜单
    saveModule (editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          let params = {
            menuId: this.form.menuId,
            icon: this.form.icon,
            menuName: this.form.menuName,
            hasThird: this.form.hasThird,
            url: this.form.url,
            sortNumber: this.form.sortNumber,
            parentMenu: this.form.parentMenu,
            deleted: 0
          };
          ModuleSave(params)
            .then(res => {
              if (res.code == 200) {
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
              this.getdata();
              this.getmenu();
            })
            .catch(err => {
              this.$message.error("菜单管理列表保存失败，请稍后再试！");
            });
        } else {
          return false;
        }
      });
    },
    // 删除菜单
    deleteModule () {
      let params = {
        menuId: this.form.menuId,
        icon: this.form.icon,
        menuName: this.form.menuName,
        hasThird: this.form.hasThird,
        url: this.form.url,
        sortNumber: this.form.sortNumber,
        parentMenu: this.form.parentMenu,
        deleted: 1
      };
      ModuleDelete(params)
        .then(res => {
          this.getdata();
          this.getmenu();
          this.$message.error("菜单管理列表删除成功！");
        })
        .catch(err => {
          this.$message.error("菜单管理列表删除失败，请稍后再试！");
        });
    }
  }
};
</script>

<style>
.user-search {
  margin-top: 20px !important;
}
.user-search td {
  margin-top: 20px !important;
}
.userRole {
  width: 100%;
}
.el-table__expanded-cell {
  padding: 0px !important;
  margin: 0px !important;
}
.modt-box {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #f0f2f5;
  text-align: center;
  color: #334157;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 24px;
}
.mod-btnbox {
  margin-bottom: 20px;
}
.treeclass {
  border: 1px solid #f3f3f3;
  padding-top: 20px;
  padding-bottom: 20px;
}
.selectw {
  width: 100%;
}
</style>
 
 
<template>
  <layout-page>
    <el-form
      slot="header"
      :inline="true"
      :model="queryData"
      @submit.native.prevent="query"
    >
      <el-form-item>
        <el-button
          type="primary"
          :disabled="loadingQuery"
          @click="handleRefresh"
        >
          刷新
        </el-button>
        <el-button
          type="success"
          @click="showDialog()"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="singleTable"
      v-loading="loadingQuery"
      :data="tableData"
      row-key="id"
      highlight-current-row
      :tree-props="{children: 'childDepartments', hasChildren: 'hasChildren'}"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="name"
        align="left"
        label="名称"
        width="350"
      />
      <el-table-column
        prop="grade"
        label="级别"
      >
        <template v-slot="{ row }">
          {{ row.grade | grade }}
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="代码"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template v-slot="{ row }">
          <el-button
            type="text"
            @click="showDialog(row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <menu-dialog
      :menus="tableData"
      :data="dialogData"
      :visible.sync="dialogVisible"
      @success="query"
    />
  </layout-page>
</template>
<script>
import MenuDialog from "./components/menu-dialog";
import * as department from "@/api/modules/department";
import config from "@/config"
// import { searchWhereAdapter } from "@/api/utils";
export default {
  components: {
    MenuDialog
  },
  filters: {
    ...department.FILTERS
  },
  data () {
    return {
      tableData: [],
      queryData: {},
      deleteIds: [],
      gradeOptions: department.OPTIONS.grade,
      dialogVisible: false,
      dialogData: {},
      loadingQuery: false
    };
  },
  created () {
    this.handleRefresh();
  },
  methods: {
    showDialog (data = {}) {
      this.dialogData = data;
      this.dialogVisible = true;
    },
    handleDelete (id) {
      this.$confirm("删除后将无法恢复，确定要删除吗？", {
        type: "warning"
      }).then(async err => {
        await department.API.delete({ ids: [id] });
        this.$message.success("删除成功");
        this.query();
      });
    },
    handleBatchDelete () {
      if (!this.deleteIds.length) {
        return this.$message.info("请选择要批量删除的项");
      }
      this.handleDeleteAll(this.deleteIds);
    },
    handleRefresh () {
      this.queryData = {};
      this.query();
    },
    handleDeleteAll (ids) {
      this.$confirm("确定要删除吗？", { type: "warning" }).then(async err => {
        await department.API.deleteAll({ ids });
        this.$message.success("删除成功");
        this.query();
      });
    },
    handleSelectionChange (val) {
      this.deleteIds = val.map(item => item.id);
    },
    setCurrent (row) {
      const array = this.tableData.filter(item => item.childDepartments !== []).map(s => s.childDepartments)
      const arrayitem = array
      console.log(arrayitem);
      console.log(row);
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    },
    async query () {
      const { coordSystem } = config
      const req = { ...this.queryData, coordSystem };
      this.loadingQuery = true;
      const { body = {} } = await department.API.getTreeByCompanyId({ ...req }).finally(
        _ => (this.loadingQuery = false)
      );
      this.tableData = body;
      // this.tableData = this.coordSystemFilter(body)
    },
    // 根据coordSystem进行过滤部门机构数据  Todo：后续改为递归
    // coordSystemFilter (data) {
    //   return data.filter(item => {
    //     return item.coordSystem === config.coordSystem
    //   }).map(mapItem => {
    //     const child = mapItem.childDepartments.filter(mapFilter => {
    //       return mapFilter.coordSystem === config.coordSystem
    //     }).map(childItem => {
    //       const children = childItem.childDepartments.filter(childFilter => {
    //         return childFilter.coordSystem === config.coordSystem
    //       })
    //       return {
    //         ...childItem,
    //         childDepartments: children
    //       }
    //     })
    //     return {
    //       ...mapItem,
    //       childDepartments: child
    //     }
    //   })
    // }
  }
};
</script>

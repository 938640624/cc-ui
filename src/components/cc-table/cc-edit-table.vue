<template>
  <div class="cc-edit-table">
    <table
      class="table"
      border="1"
      cellspacing="0"
      cellpadding="0"
    >
      <thead>
        <tr>
            <th>-</th>
            <th>X axis</th>
            <th>Y axis</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in echartData"
          :key="index"
        >
          <th>{{ index + 1 }}</th>
          <td>
            <input 
              v-model="item[0]"
              @blur="handleInputBlur"
            />
          </td>
            <td>
            <input 
              v-model="item[1]"
              @blur="handleInputBlur"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-edit-table'
const EVENT_INPUT_BLUR = 'input-blur'
export default {
  name: COMPONENT_NAME,
  components: {

  },
  mounted() {
  },
  props: {
    echartData: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
      return {
        newData: [],
        inputHTML:[],

      }
  },
  methods: {
    handleInputBlur() {
      const inputArr = event.target.offsetParent.offsetParent.getElementsByTagName('td')
      this.inputHTML = []
      this.newData = []
      for (let i = 0; i < inputArr.length; i++) {
        this.inputHTML.push(Number(inputArr[i].children[0].value))
      }
      for (let i = 0; i < this.inputHTML.length; i += 2) {
        this.newData.push(this.inputHTML.slice(i, i+2))
      }
      this.$emit(EVENT_INPUT_BLUR, this.newData)
    }
  }
}
</script>
<style lang="scss" scoped>
table {
  border-color: #cccccc;
  border-collapse: collapse;
  text-align: center;
}
thead {
  background-color: #e9ecee;
}
thead tr th {
  width: 80px;
  height: 50px;
  font-weight: normal;
}
tbody tr th {
  font-weight: normal;
}
tbody tr td input {
  width: 80px;
  text-align: center;
  color: #2c3e50;
  font-size: 16px;
}
table input {
  border: none;
}
</style>
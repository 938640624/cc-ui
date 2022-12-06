<template>
  <div class="cc-edit-table">
    <table
      class="table"
      border="1"
      cellspacing="0"
      cellpadding="0"
      @dblclick="setEditTtable"
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
          <!-- <td>{{item[0]}}</td> -->
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
          <!-- <td>{{item[1]}}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-edit-table'
// const EVENT_TABLE_DOUBLECLICK = 'table-dbClick'
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
        isInputShow: true,
        newData: [],
        inputHTML:[],
        currentTd: '',
        inputDiv: ''
      }
  },
  methods: {
    handleInputBlur() {
      console.log('失去焦点')
      console.log(event.target, event)
      var inputArr = event.target.offsetParent.offsetParent.getElementsByTagName('td')
      console.log(inputArr, 'inputArr')
      this.inputHTML = []
      // this.newData = []
      for (let i = 0; i < inputArr.length; i++) {
        // console.log(inputArr[i].children[0].value, 'i')
        this.inputHTML.push(Number(inputArr[i].children[0].value))
      }
      for (let i = 0; i < this.inputHTML.length; i += 2) {
        this.newData.push(this.inputHTML.slice(i, i+2))
      }
      console.log(this.newData, 'newData')
    },
    setEditTtable() {
      if(event.target.tagName.toLowerCase() === 'td') {
        console.log(event.target)
        this.inputValue = event.target.value
        console.log(this.inputValue, 'inputValue')
        // if(this.inputDiv) {  // 双击其他td标签让原本td显示值
        //   this.currentTd.innerHTML = this.inputDiv.value
        // }
        // this.currentTd = event.target
        // this.inputDiv = document.createElement('input')
        // this.inputDiv.setAttribute('class', 'editInput')
        // this.inputDiv.value = this.currentTd.innerHTML
        // this.inputDiv.style.width = 70 + 'px'
        // this.currentTd.innerHTML = ''
        // this.currentTd.appendChild(this.inputDiv)
        // this.inputDiv.addEventListener('blur', () => {
        //   this.currentTd.innerHTML = event.target.value
        //   this.inputDiv.display = 'none'
        //   // var inputArr = document.querySelectorAll('tbody tr td')
        //   var inputArr = this.currentTd.offsetParent.getElementsByTagName('td')
        //   // this.inputHTML.splice(0, this.inputHTML.length - 1)
        //   this.inputHTML = []
        //   this.newData = []
        //   for (let i = 0; i < inputArr.length; i++) {
        //     this.inputHTML.push(Number(inputArr[i].innerHTML))
        //   }
        //   for (let i = 0; i < this.inputHTML.length; i += 2) {
        //     this.newData.push(this.inputHTML.slice(i, i+2))
        //   }
          // this.$emit(EVENT_TABLE_DOUBLECLICK, this.newData)
        // })
      }
    },
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
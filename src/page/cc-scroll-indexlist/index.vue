<template>
    <div class="cc-scroll-indexlist-index">
    <cc-header
      :headtitle="'scroll-indexlist'"
    />
    <div class="indexlist-content">
        <cc-scroll-indexlist
          :data="data"
          :title="title"
        >
        </cc-scroll-indexlist>
    </div>
    </div>
</template>
<script>
import data from '../../data/index-list.json'
import ccHeader from '../../components/cc-header/cc-header.vue'
import CcScrollIndexlist from '../../components/cc-scroll/cc-scroll-indexlist/cc-scroll-indexlist.vue'
const COMPONENT_NAME = 'cc-scroll-indexlist-index'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        CcScrollIndexlist,
        
    },
    data() {
        return {
            title: {
              name: 'scroll-city'
            },
            data: data
        }
    },
    mounted() {
      
    },
    methods: {
     
    }
}
</script>
<style>
    .cc-scroll-indexlist-index {
        position: relative;
        overflow: hidden;
    }
    .margiTop {
      margin: 10px 10px 0px 10px;
    }
</style>
<!--
 * @Description: 
 * @Author: wangmeng
 * @Date: 2023-11-22 09:50:53
 * @LastEditTime: 2023-11-22 09:54:24
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import Map from '../map/index'

onMounted(()=>{
  new Map('map-container')
})

</script>

<template>
  <div class="map-container"></div>
</template>

<style scoped>
</style>

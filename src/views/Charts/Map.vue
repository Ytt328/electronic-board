<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref } from 'vue'
const state = ref({
  path: [] as any[],
  current_position: [] as any[]
})

function initMap(): void {
  AMapLoader.load({
    key: 'f34fbf15f3aebd46961c5c8767c20c34', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  })
    .then((AMap) => {
      const map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 10, //初始化地图级别
        center: [113.41, 29.58] //初始化地图中心点位置
      })
      //添加插件
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye'], function () {
        //异步同时加载多个插件
        map.addControl(new AMap.HawkEye()) //显示缩略图
        map.addControl(new AMap.Scale()) //显示当前地图中心的比例尺
      })
      // 单击
      map.on('click', (e) => {
        // console.log(e);
        state.value.current_position = [e.lnglat.KL, e.lnglat.kT]
        state.value.path.push([e.lnglat.KL, e.lnglat.kT])
        addMarker()
        // 地图按照适合展示图层内数据的缩放等级展示
        // map.setFitView();
      })

      // 实例化点标记
      function addMarker() {
        const marker = new AMap.Marker({
          icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          position: state.value.current_position,
          offset: new AMap.Pixel(-26, -54)
        })
        marker.setMap(map)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}
initMap()
</script>

<template>
  <div id="container"> </div>
</template>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: calc(100vh - 50px);
}
</style>

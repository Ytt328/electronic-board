/* eslint-disable prettier/prettier */
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import { Echart } from '@/components/Echart'
import { ElRow, ElCol, ElCascader } from 'element-plus'
import {
  ProductData,
  setCityOption,
  setCityProductOptions,
  setProductDistributeOptions,
  setProductOptions,
  setProductDropDownOption,
  setProductRankOptions,
  distinctInfo,
  setDistinctProductInfo,
  setDistinctTotalProductInfo,
  distinctSum,
  OptionInfo,
  readFileDataToJSON
} from '@/views/Charts/echarts-data'
import AMapLoader from '@amap/amap-jsapi-loader'
import {
  BorderBox8,
  BorderBox11,
  BorderBox13,
  Decoration1,
  Decoration2,
  Decoration11
} from '@kjgl77/datav-vue3'

// let file = 'src/assets/csv/粮食作物面积（千公顷）.csv'
let file = 'src/assets/csv/林产品产量（吨）.csv'
// let file = 'src/assets/csv/畜禽产量（吨）.csv'
let i = file.lastIndexOf('/')
let i1 = file.indexOf('（')
let i2 = file.indexOf('）')
let name = file.slice(i + 1, i1)
let uint = file.slice(i1 + 1, i2)
let pro: OptionInfo = readFileDataToJSON(file)
let ProductOption = ref(setProductOptions(ProductData, name))
let title1 = ref('')
let title2 = ref('')
let title3 = ref('')
let title4 = ref('')
let CityProductOption = ref(
  setCityProductOptions(
    ProductData,
    ProductData.main[0].mainCity,
    false,
    ProductData.main[0].mainCity,
    name
  )
)
let ProductDistributeOption = ref(setProductDistributeOptions(ProductData, ProductData.label[0]))
let ProductRankOption = ref(setProductRankOptions(ProductData, ProductData.label[0], 2, 10))
let cityDropDownOptions = ref(setCityOption(ProductData))
let productDropDownOptions = ref(setProductDropDownOption(ProductData))
let city = ref(ProductData.main[0].mainCity)
let product = ref(ProductData.label[0])
let productr = ref(ProductData.label[0])
let topNum = ref(10)
let adCode = 420000
let dep = ref(2)

const levelOption: Array<any> = [
  {
    value: 1,
    label: '市级'
  },
  {
    value: 2,
    label: '县级'
  }
]
const topNumOption: Array<any> = [
  {
    value: 10,
    label: 'Top10'
  },
  {
    value: 20,
    label: 'Top20'
  },
  {
    value: 30,
    label: 'Top30'
  }
]
const props = {
  checkStrictly: true
}

function init(): void {
  // console.log(ProductOption)
  setTimeout(() => {
    ProductOption.value = setProductOptions(pro, name)
    CityProductOption.value = setCityProductOptions(
      pro,
      pro.main[0].mainCity,
      false,
      pro.main[0].mainCity,
      name
    )
    ProductDistributeOption.value = setProductDistributeOptions(pro, pro.label[0])
    ProductRankOption.value = setProductRankOptions(pro, pro.label[0], 2, 10)
    title1.value = ProductOption.value.title.text
    title2.value = CityProductOption.value.title.text
    title3.value = ProductDistributeOption.value.title.text
    title4.value = ProductRankOption.value.title.text
    cityDropDownOptions.value = setCityOption(pro)
    productDropDownOptions.value = setProductDropDownOption(pro)

    city.value = pro.main[0].mainCity
    product.value = pro.label[0]
    productr.value = pro.label[0]
    initMap()
  }, 100)
}
function cityChange(): void {
  console.log(pro)
  if (city.value.length == 1) {
    CityProductOption.value = setCityProductOptions(pro, city.value[0], false, city.value[0], name)
  } else {
    CityProductOption.value = setCityProductOptions(pro, city.value[1], true, city.value[0], name)
  }
  title2.value = CityProductOption.value.title.text
}
function productChange(): void {
  ProductDistributeOption.value = setProductDistributeOptions(pro, product.value.toString())
  title3.value = ProductDistributeOption.value.title.text
}
function rankChange(): void {
  let p: string = productr.value.toString()
  let strs: string[] = p.split(',')
  const len: number = strs.length
  ProductRankOption.value = setProductRankOptions(
    pro,
    strs[len - 1],
    dep.value,
    parseInt(topNum.value.toString())
  )
  title4.value = ProductRankOption.value.title.text
}
function initMap(): void {
  AMapLoader.load({
    key: 'f34fbf15f3aebd46961c5c8767c20c34',
    version: '2.0'
  })
    .then((AMap) => {
      const map = new AMap.Map('container', {
        viewMode: '3D',
        zoom: 7,
        center: [112.5, 31]
      })
      AMap.plugin(['AMap.ToolBar'], function () {
        map.addControl(new AMap.ToolBar())
      })

      //在指定位置打开信息窗体
      function openInfo(position, props) {
        let d: number = dep.value
        if (props.adcode == props.adcode_cit) {
          d = 1
        } else if (props.adcode == props.adcode_pro) {
          d = 0
        }
        let p: string = productr.value.toString()
        let strs: string[] = p.split(',')
        const len: number = strs.length
        let dInfo: distinctInfo = setDistinctProductInfo(pro, props.NAME_CHN, d, strs[len - 1])
        const info: Array<any> = []
        info.push(
          '<div><label style="font-weight: bold; color: black">' + props.NAME_CHN + '</label>'
        )
        if (dInfo.data.length == 0) {
          info.push('<p style="color: white">暂无数据</p>')
        } else {
          for (let i = 0; i < dInfo.label.length; i++) {
            info.push('<p style="color: black">' + dInfo.label[i] + ':' + dInfo.data[i] + '</p>')
          }
        }

        let infoWindow = new AMap.InfoWindow({
          content: info.join('') //使用默认信息窗体框样式，显示信息内容
        })
        infoWindow.open(map, position)
      }
      // 鼠标移动
      map.on('mousemove', function (ev) {
        var px = ev.pixel
        var props = disProvince.getDistrictByContainerPos(px)
        if (props.adcode_pro == adCode) {
          openInfo(ev.lnglat, props)
        }
      })
      // 鼠标点击
      map.on('click', function (ev) {
        var px = ev.pixel
        var props = disProvince.getDistrictByContainerPos(px)
        if (props.adcode_pro == adCode) {
          openInfo(ev.lnglat, props)
        }
      })
      let p: string = productr.value.toString()
      let strs: string[] = p.split(',')
      const len: number = strs.length
      const dsum: Array<distinctSum> = setDistinctTotalProductInfo(pro, dep.value, strs[len - 1])
      dsum.sort(function (a, b) {
        return b.sum - a.sum
      })
      let tmpSum = 0
      for (const i of dsum) {
        tmpSum = tmpSum + i.sum
      }
      // console.log(tmpSum)
      const min = 20
      const max = 150
      let t = 0
      for (let i = 0; i < dsum.length; i++) {
        t = t + dsum[i].sum
        dsum[i].degree = ((t - dsum[0].sum) / (tmpSum - dsum[0].sum)) * (max - min) + min
      }
      // 颜色辅助方法
      const getColorByName = function (name) {
        const colors = {}
        if (dep.value == 0) {
          colors[name] = 'rgb(' + (min + max) / 2 + ',' + (min + max) / 2 + ',200)'
        } else {
          if (!colors[name]) {
            for (const s of dsum) {
              if (s.name == name) {
                const gb = s.degree
                colors[name] = 'rgb(' + gb + ',' + gb + ',200)'
                break
              }
            }
            if (!colors[name]) {
              colors[name] = 'rgb(' + max + ',' + max + ',200)'
            }
          }
        }
        return colors[name]
      }
      let disProvince = new AMap.DistrictLayer.Province({
        zIndex: 12,
        adcode: [adCode],
        depth: dep.value,
        styles: {
          fill: function (properties) {
            if (properties.adcode_pro == adCode) {
              return getColorByName(properties.NAME_CHN)
            }
          },
          'province-stroke': 'cornflowerblue',
          'city-stroke': 'white', // 中国地级市边界
          'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
        }
      })
      disProvince.setMap(map)
    })
    .catch((e) => {
      console.log(e)
    })
}
function change(): void {
  rankChange()
  initMap()
}

init()
</script>
<template>
  <ContentWrap :title="name + '(单位:' + uint + ')'" :message="name + '信息'">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="24">
        <!--        <ElCard shadow="hover" class="mb-20px">-->
        <BorderBox11 :title="title1" style="padding: 30px; border-radius: 5px">
          <Decoration1 style="width: 200px; height: 50px; float: left" />
          <Decoration1 style="width: 200px; height: 50px; float: right" />
          <!--          <Decoration3 style="width: 200px; height: 50px; margin: auto" />-->
          <Echart :options="ProductOption" :height="500" />
        </BorderBox11>
        <!--        </ElCard>-->
      </ElCol>
      <ElCol :span="12">
        <!--        <ElCard shadow="hover" class="mb-20px">-->
        <BorderBox13 style="padding: 30px">
          <Decoration11 style="width: 300px; height: 50px; margin: auto">
            <div>{{ title2 }}</div>
          </Decoration11>
          <span style="padding-right: 10px">切换</span>
          <ElCascader
            :options="cityDropDownOptions"
            :props="props"
            v-model="city"
            @change="cityChange"
          />
          <Echart :options="CityProductOption" :height="300" />
          <Decoration2 style="height: 5px" />
        </BorderBox13>
        <!--        </ElCard>-->
      </ElCol>
      <ElCol :span="12">
        <!--        <ElCard shadow="hover" class="mb-20px">-->
        <BorderBox13 style="padding: 30px">
          <Decoration11 style="width: 300px; height: 50px; margin: auto">
            <div>{{ title3 }}</div>
          </Decoration11>
          <span style="padding-right: 10px">切换 </span>
          <ElCascader
            :options="productDropDownOptions"
            :props="props"
            v-model="product"
            @change="productChange"
          />
          <Echart :options="ProductDistributeOption" :height="300" />
          <Decoration2 style="height: 5px" />
        </BorderBox13>
        <!--        </ElCard>-->
      </ElCol>
      <ElCol :span="12">
        <!--        <ElCard shadow="hover" class="mb-20px">-->
        <BorderBox8 style="padding: 30px">
          <Decoration11 style="width: 300px; height: 50px; margin: auto">
            <div>{{ title4 }}</div>
          </Decoration11>
          <div>
            <span style="padding-right: 10px">切换 </span>
            <ElCascader
              :options="productDropDownOptions"
              :props="props"
              v-model="productr"
              @change="change"
            />
            <ElCascader :options="levelOption" :props="props" v-model="dep" @change="change" />
            <ElCascader
              :options="topNumOption"
              :props="props"
              v-model="topNum"
              @change="rankChange"
            />
          </div>
          <Echart :options="ProductRankOption" :height="500" />
        </BorderBox8>
        <!--        </ElCard>-->
      </ElCol>
      <ElCol :span="12">
        <!--        <ElCard shadow="hover" class="mb-20px">-->
        <BorderBox8 style="padding: 30px">
          <Decoration11 style="width: 300px; height: 50px; margin: auto">
            <div>地图视角</div>
          </Decoration11>
          <div>
            <span style="padding-right: 10px">切换</span>
            <ElCascader :options="levelOption" :props="props" v-model="dep" @change="change" />
          </div>
          <div id="container"></div>
        </BorderBox8>
        <!--        </ElCard>-->
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>

<style scoped>
#container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
  border-radius: 5px;
}
</style>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElRow, ElCol, ElCard, ElCascader } from 'element-plus'
import { Echart } from '@/components/Echart'
import { ref } from 'vue'
import {
  setCityOption,
  setCityWaterProductOption,
  setWaterProductDistributeOptions,
  setWaterProductOptions,
  setWaterProductRankOptions,
  setWProductDropDownOption,
  waterProductData
} from '@/views/Charts/echarts-data'

// const props = {
//   checkStrictly: true
// }
// console.log(waterProductData)
console.log(waterProductData)
const WaterProductOption = setWaterProductOptions(waterProductData)
let CityWaterProductOption = ref(
  setCityWaterProductOption(waterProductData, '湖北省', false, '湖北省')
)
let WaterProductDistributeOption = ref(
  setWaterProductDistributeOptions(waterProductData, '一、鱼类')
)
let WaterProductRankOption = ref(
  setWaterProductRankOptions(waterProductData, '一、鱼类', '市级', 10)
)
const props = {
  checkStrictly: true
}
const cityOptions = setCityOption(waterProductData)
let city = ref('湖北省')

const productOptions = setWProductDropDownOption(waterProductData)
let product = ref('一、鱼类')
let productr = ref('一、鱼类')

const levelOption: Array<any> = [
  {
    value: '市级',
    label: '市级'
  },
  {
    value: '县级',
    label: '县级'
  }
]
let level = ref('市级')

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
let topNum = ref(10)
function cityChange(): void {
  if (city.value.length == 1) {
    CityWaterProductOption.value = setCityWaterProductOption(
      waterProductData,
      city.value[0],
      false,
      city.value[0]
    )
  } else {
    CityWaterProductOption.value = setCityWaterProductOption(
      waterProductData,
      city.value[1],
      true,
      city.value[0]
    )
  }
}

function productChange(): void {
  if (product.value.length == 1) {
    WaterProductDistributeOption.value = setWaterProductDistributeOptions(
      waterProductData,
      product.value[0]
    )
  } else {
    WaterProductDistributeOption.value = setWaterProductDistributeOptions(
      waterProductData,
      product.value[1]
    )
  }
}

function rankChange(): void {
  let p: string = productr.value.toString()
  let strs: string[] = p.split(',')
  const len: number = strs.length
  WaterProductRankOption.value = setWaterProductRankOptions(
    waterProductData,
    strs[len - 1],
    level.value.toString(),
    parseInt(topNum.value.toString())
  )
}
</script>

<template>
  <ContentWrap title="水产品" message="水产品养殖产量信息">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="24">
        <ElCard shadow="hover" class="mb-20px">
          <Echart :options="WaterProductOption" :height="300" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <span style="padding-right: 10px">切换</span>
          <ElCascader :options="cityOptions" :props="props" v-model="city" @change="cityChange" />
          <Echart :options="CityWaterProductOption" :height="300" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <span style="padding-right: 10px">切换 </span>
          <ElCascader
            :options="productOptions"
            :props="props"
            v-model="product"
            @change="productChange"
          />
          <Echart :options="WaterProductDistributeOption" :height="300" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <span style="padding-right: 10px">切换 </span>
          <ElCascader
            :options="productOptions"
            :props="props"
            v-model="productr"
            @change="rankChange"
          />
          <ElCascader :options="levelOption" :props="props" v-model="level" @change="rankChange" />
          <ElCascader
            :options="topNumOption"
            :props="props"
            v-model="topNum"
            @change="rankChange"
          />
          <Echart :options="WaterProductRankOption" :height="500" />
        </ElCard>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>

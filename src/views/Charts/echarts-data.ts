import { EChartsOption } from 'echarts'
import { readCSV, toJSON } from 'danfojs'

export interface subInfo {
  name: string
  data: Array<number>
}

export interface mainInfo {
  mainCity: string
  data: Array<number>
  subCity: Array<subInfo>
}

export interface OptionInfo {
  main: mainInfo[]
  label: string[]
}

interface series {
  value: string
  label: string
  children: Array<any>
}

interface uintData {
  data: number
  label: string
}

export interface distinctInfo {
  label: Array<string>
  data: Array<number>
}

export interface distinctSum {
  name: string
  sum: number
  degree: number
}

export function readFileDataToJSON(filePath: string): OptionInfo {
  const labels: string[] = []
  const infos: mainInfo[] = []
  readCSV(filePath)
    .then((df) => {
      // console.log(typeof df)
      const j: any = toJSON(df)
      let num = 0
      for (const i of j) {
        let name = ''
        const data: number[] = []
        for (const key in i) {
          if (key == Object.keys(i)[0]) {
            if (i[key] != null) {
              name = i[key]
            }
          } else {
            if (labels.indexOf(key) == -1) {
              labels.push(key)
            }
            if (i[key] == null) {
              data.push(0)
            } else {
              data.push(i[key])
            }
          }
        }
        if (name != '') {
          if (name.includes(' ')) {
            const tmpCity: subInfo = {
              name: name.replace(/^\s*/, ''),
              data: data
            }
            infos[num - 1].subCity.push(tmpCity)
          } else {
            const tmpCity: mainInfo = {
              mainCity: name,
              data: data,
              subCity: []
            }
            infos.push(tmpCity)
            num = num + 1
          }
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
  return {
    main: infos,
    label: labels
  }
}

export const ProductData: OptionInfo = {
  main: [
    {
      mainCity: '',
      data: [],
      subCity: []
    }
  ],
  label: []
}
export let p: OptionInfo

export const waterProductData: OptionInfo = readFileDataToJSON(
  'src/assets/csv/水产品养殖产量（吨）.csv'
)

function setSeries(labels: Array<string>, datas: Array<Array<number>>, type: string): Array<any> {
  const series: Array<any> = []
  for (let i = 0; i < labels.length; i++) {
    const s: any = {
      type: type,
      name: labels[i],
      data: datas[i]
    }
    series.push(s)
  }
  return series
}

// 柱状分布图
export function setProductOptions(infos: OptionInfo, name: string): EChartsOption {
  const datas: Array<Array<number>> = []
  for (let i = 0; i < infos.label.length; i++) {
    const a: Array<number> = []
    datas.push(a)
  }
  const citys: Array<string> = []
  for (const l of infos.main) {
    if (l.mainCity != infos.main[0].mainCity) {
      citys.push(l.mainCity)
      for (const j in l.data) {
        datas[j].push(l.data[j])
      }
    }
  }
  const option: EChartsOption = {
    title: {
      text: '全省' + name + '分布图',
      left: 'center',
      show: false
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 70,
      right: 20,
      bottom: 20
    },
    xAxis: {
      data: citys,
      axisLabel: {
        color: 'white'
      }
    },
    yAxis: {
      axisTick: {
        inside: true
      },
      axisLabel: {
        color: 'white'
      }
    },
    series: setSeries(infos.label, datas, 'bar')
  }
  return option
}

// 城市分布
export function setCityProductOptions(
  infos: OptionInfo,
  city: string,
  isSub: boolean,
  parentCity: string,
  name: string
): EChartsOption {
  const datas: Array<any> = []
  const labels: Array<any> = []
  for (const l of infos.main) {
    if (l.mainCity == parentCity) {
      if (!isSub) {
        // 主城市
        for (let i = 0; i < l.data.length; i++) {
          if (l.data[i] != 0) {
            labels.push(infos.label[i])
            const tmp: any = {
              value: l.data[i],
              name: infos.label[i]
            }
            datas.push(tmp)
          }
        }
      } else {
        // 子城市
        for (const s of l.subCity) {
          if (s.name == city) {
            for (let i = 0; i < s.data.length; i++) {
              if (s.data[i] != 0) {
                labels.push(infos.label[i])
                const tmp: any = {
                  value: s.data[i],
                  name: infos.label[i]
                }
                datas.push(tmp)
              }
            }
          }
        }
      }
    }
  }
  const option: EChartsOption = {
    title: {
      text: city + name + '分布',
      left: 'center',
      show: false,
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: labels,
      textStyle: {
        color: 'white'
      }
    },
    series: [
      {
        name: name + '占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: datas
      }
    ]
  }
  return option
}

// 各产品的城市分布
export function setProductDistributeOptions(infos: OptionInfo, productName: string): EChartsOption {
  const datas: Array<any> = []
  const index = infos.label.indexOf(productName)
  const labels: Array<string> = []
  for (const l of infos.main) {
    if (l.mainCity != infos.main[0].mainCity && l.data[index]) {
      labels.push(l.mainCity)
      const t: any = {
        value: l.data[index],
        name: l.mainCity
      }
      datas.push(t)
    }
  }
  const option: EChartsOption = {
    title: {
      text: productName + '产量分布(市级)',
      left: 'center',
      show: false,
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: labels,
      textStyle: {
        color: 'white'
      }
    },
    series: [
      {
        name: productName + '产量占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: datas
      }
    ]
  }
  return option
}

// 各产品在各城市的排行
export function setProductRankOptions(
  infos: OptionInfo,
  productName: string,
  level: number,
  topNum: number
): EChartsOption {
  const datas: number[] = []
  const labels: string[] = []
  const index: number = infos.label.indexOf(productName)
  if (level == 1) {
    for (const l of infos.main) {
      if (l.data[index] != 0 && l.mainCity != infos.main[0].mainCity) {
        labels.push(l.mainCity)
        datas.push(l.data[index])
      }
    }
  } else {
    for (const l of infos.main) {
      for (const J of l.subCity) {
        if (J.data[index] != 0) {
          labels.push(J.name)
          datas.push(J.data[index])
        }
      }
    }
  }
  let mergeDatas: Array<uintData> = []
  for (let i = 0; i < datas.length; i++) {
    const t: uintData = {
      data: datas[i],
      label: labels[i]
    }
    mergeDatas.push(t)
  }
  mergeDatas.sort(function (a, b) {
    return b.data - a.data
  })
  if (mergeDatas.length > topNum) {
    mergeDatas = mergeDatas.slice(0, topNum)
  }
  // console.log(mergeDatas)
  const s: Array<Array<any>> = []
  const a: Array<any> = ['product', '产量']
  s.push(a)
  for (const m of mergeDatas) {
    const t: Array<any> = [m.label, m.data]
    s.push(t)
  }
  let t = ''
  if (level == 1) {
    t = '市级'
  } else if (level == 2) {
    t = '县级'
  }
  const titleText = productName + 'top' + topNum + '产量分布(' + t + ')'
  const option: EChartsOption = {
    title: {
      text: titleText,
      left: 'center',
      show: false,
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {},
    legend: {
      show: false
    },
    xAxis: {
      max: 'dataMax',
      axisLabel: {
        color: 'white'
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      axisLabel: {
        color: 'white'
      }
    },
    dataset: {
      source: s
    },
    series: [
      {
        type: 'bar',
        name: productName + '产量',
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        }
      }
    ],
    animationDuration: 300,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  }
  return option
}

// 获取行政区内的产品数据
export function setDistinctProductInfo(
  infos: OptionInfo,
  dName: string,
  level: number,
  productName: string
): distinctInfo {
  const res: distinctInfo = {
    label: [],
    data: []
  }
  const index = infos.label.indexOf(productName)
  res.label.push(productName)
  if (level == 0) {
    res.data.push(infos.main[0].data[index])
    // res.data = infos.main[0].data
  } else if (level == 1) {
    for (const l of infos.main) {
      if (l.mainCity == dName) {
        res.data.push(l.data[index])
        // res.data = l.data
      }
    }
  } else {
    for (const l of infos.main) {
      for (const J of l.subCity) {
        if (J.name == dName) {
          res.data.push(J.data[index])
          // res.data = J.data
        }
      }
    }
  }
  return res
}

// 获取行政区内的产品总量
export function setDistinctTotalProductInfo(
  infos: OptionInfo,
  level: number,
  productName: string
): Array<distinctSum> {
  const res: Array<distinctSum> = []
  const index = infos.label.indexOf(productName)
  if (level == 0) {
    const t: distinctSum = {
      name: infos.main[0].mainCity,
      sum: infos.main[0].data[index],
      degree: 0
    }
    res.push(t)
  } else if (level == 1) {
    for (let i = 1; i < infos.main.length; i++) {
      const t: distinctSum = {
        name: infos.main[i].mainCity,
        sum: infos.main[i].data[index],
        degree: 0
      }
      res.push(t)
    }
  } else {
    for (const l of infos.main) {
      for (const J of l.subCity) {
        const t: distinctSum = {
          name: J.name,
          sum: J.data[index],
          degree: 0
        }
        res.push(t)
      }
    }
  }
  return res
}

// 设置城市级联下拉框选项
export function setCityOption(infos: OptionInfo): Array<any> {
  const option: Array<any> = []
  for (const l of infos.main) {
    const t: any = {
      value: l.mainCity,
      label: l.mainCity,
      children: []
    }
    for (const J of l.subCity) {
      const m: any = {
        value: J.name,
        label: J.name
      }
      t.children.push(m)
    }
    option.push(t)
  }
  return option
}

// 设置产品下拉框选项
export function setProductDropDownOption(infos: OptionInfo): Array<any> {
  const option: Array<any> = []
  for (const l of infos.label) {
    const t: any = {
      value: l,
      label: l,
      children: []
    }
    option.push(t)
  }
  return option
}

// 设置水产品下拉框选项
export function setWProductDropDownOption(infos: OptionInfo): Array<any> {
  const option: Array<series> = []
  for (let i = 0; i < infos.label.length; i++) {
    if (infos.label[i].indexOf('、') != -1) {
      const t: series = {
        value: infos.label[i],
        label: infos.label[i],
        children: []
      }
      while (i + 1 < infos.label.length && infos.label[i + 1].indexOf('、') == -1) {
        const m: any = {
          value: infos.label[i + 1],
          label: infos.label[i + 1]
        }
        t.children.push(m)
        i = i + 1
      }
      option.push(t)
    }
  }
  return option
}

// 水产品柱状图
export function setWaterProductOptions(infos: OptionInfo): EChartsOption {
  const datas: Array<Array<number>> = []
  const rows: Array<number> = []
  const labels: Array<string> = []
  for (let i = 0; i < infos.label.length; i++) {
    if (infos.label[i].indexOf('、') != -1) {
      rows.push(i)
      labels.push(infos.label[i])
      const a: Array<number> = []
      datas.push(a)
    }
  }
  const citys: Array<string> = []
  for (const l of infos.main) {
    if (l.mainCity != '湖北省') {
      citys.push(l.mainCity)
      for (let i = 0; i < rows.length; i++) {
        datas[i].push(l.data[rows[i]])
      }
    }
  }
  const option: EChartsOption = {
    title: {
      text: '全省水产品养殖产量分布图',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 60,
      right: 20,
      bottom: 20
    },
    xAxis: {
      data: citys
    },
    yAxis: {},
    series: setSeries(labels, datas, 'bar')
  }
  return option
}

// 各城市的水产品分布
export function setCityWaterProductOption(
  infos: OptionInfo,
  city: string,
  isSub: boolean,
  parentCity: string
): EChartsOption {
  const rows: Array<number> = []
  const labels: Array<string> = []
  for (let i = 0; i < infos.label.length; i++) {
    if (infos.label[i].indexOf('、') != -1) {
      rows.push(i)
      labels.push(infos.label[i])
    }
  }
  const datas: Array<any> = []
  for (const l of infos.main) {
    if (l.mainCity == parentCity) {
      if (!isSub) {
        // 主城市
        for (let i = 0; i < labels.length; i++) {
          if (l.data[rows[i]] != 0) {
            const tmp: any = {
              value: l.data[rows[i]],
              name: labels[i]
            }
            datas.push(tmp)
          }
        }
      } else {
        // 子城市
        for (const s of l.subCity) {
          if (s.name == city) {
            for (let i = 0; i < labels.length; i++) {
              if (s.data[rows[i]] != 0) {
                const tmp: any = {
                  value: s.data[rows[i]],
                  name: labels[i]
                }
                datas.push(tmp)
              }
            }
          }
        }
      }
    }
  }
  const option: EChartsOption = {
    title: {
      text: city + '水产品产量分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: labels
    },
    series: [
      {
        name: '水产品产量占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: datas
      }
    ]
  }
  return option
}

// 各水产品的城市分布
export function setWaterProductDistributeOptions(
  infos: OptionInfo,
  productName: string
): EChartsOption {
  const labels: string[] = []
  const datas: any[] = []
  const index: number = infos.label.indexOf(productName)
  for (const l of infos.main) {
    if (l.mainCity != '湖北省' && l.data[index]) {
      labels.push(l.mainCity)
      const t: any = {
        value: l.data[index],
        name: l.mainCity
      }
      datas.push(t)
    }
  }
  const option: EChartsOption = {
    title: {
      text: productName + '产量分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: labels
    },
    series: [
      {
        name: productName + '产量占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: datas
      }
    ]
  }
  return option
}

// 各水产品的各城市的top排名
export function setWaterProductRankOptions(
  infos: OptionInfo,
  productName: string,
  level: string,
  topNum: number
): EChartsOption {
  const datas: number[] = []
  const labels: string[] = []
  const index: number = infos.label.indexOf(productName)
  if (level == '市级') {
    for (const l of infos.main) {
      if (l.data[index] != 0 && l.mainCity != '湖北省') {
        labels.push(l.mainCity)
        datas.push(l.data[index])
      }
    }
  } else {
    for (const l of infos.main) {
      for (const J of l.subCity) {
        if (J.data[index] != 0) {
          labels.push(J.name)
          datas.push(J.data[index])
        }
      }
    }
  }
  let mergeDatas: Array<uintData> = []
  for (let i = 0; i < datas.length; i++) {
    const t: uintData = {
      data: datas[i],
      label: labels[i]
    }
    mergeDatas.push(t)
  }
  mergeDatas.sort(function (a, b) {
    return b.data - a.data
  })
  if (mergeDatas.length > topNum) {
    mergeDatas = mergeDatas.slice(0, topNum)
  }
  // console.log(mergeDatas)
  const s: Array<Array<any>> = []
  // console.log(productName)
  const a: Array<any> = ['product', '产量']
  s.push(a)
  for (const m of mergeDatas) {
    const t: Array<any> = [m.label, m.data]
    s.push(t)
  }
  const option: EChartsOption = {
    title: {
      text: productName + 'top' + topNum + '产量分布(' + level + ')',
      left: 'center'
    },
    tooltip: {},
    legend: {
      show: false
    },
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      inverse: true
    },
    dataset: {
      source: s
    },
    series: [
      {
        type: 'bar',
        name: productName + '产量',
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        }
      }
    ],
    animationDuration: 300,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  }
  return option
}

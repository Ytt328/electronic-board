import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const adminList = [
  {
    path: '/charts',
    component: '#',
    redirect: '/charts/productchart',
    name: 'Charts',
    meta: {
      title: '图表',
      icon: 'carbon:chart-area',
      alwaysShow: true
    },
    children: [
      {
        path: 'productchart',
        name: 'ProductChart',
        component: 'views/Charts/ProductChart',
        meta: {
          title: '产品产量'
        }
      }
      // {
      //   path: 'waterproduct',
      //   name: 'WaterProduct',
      //   component: 'views/Charts/WaterProduct',
      //   meta: {
      //     title: '水产品产量'
      //   }
      // },
      // {
      //   path: 'map',
      //   name: 'Map',
      //   component: 'views/Charts/Map',
      //   meta: {
      //     title: '地图'
      //   }
      // }
    ]
  }
]

const testList: string[] = ['/level/menuProduct', '/level/menuUser']

export default [
  // 列表接口
  {
    url: '/role/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { roleName } = query
      return {
        code: result_code,
        data: {
          list: roleName === 'admin' ? adminList : testList
        }
      }
    }
  }
] as MockMethod[]

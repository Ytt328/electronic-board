import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'
import { toAnyString } from '@/utils'
import Mock from 'mockjs'

const { result_code } = config

const timeout = 1000

const count1 = 100
const count2 = 25

const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" alt="image not found"></p>'

let ProductList: {
  id: string
  name: string
  time: string
  sales: number
  content: string
}[] = []

for (let i = 0; i < count1; i++) {
  ProductList.push(
    Mock.mock({
      id: toAnyString(),
      // timestamp: +Mock.Random.date('T'),
      name: '@title(5, 10)',
      time: '@datetime',
      sales: '@integer(300, 5000)',
      content: baseContent
      // image_uri
    })
  )
}

let UserList: {
  id: string
  userName: string
  createTime: string
  telephone: string
}[] = []

for (let i = 0; i < count2; i++) {
  UserList.push(
    Mock.mock({
      id: toAnyString(),
      userName: '@title(1,2)',
      createTime: '@datetime',
      telephone: '@integer(10)',
      image: 'src/assets/imgs/headPicture.png'
    })
  )
}

export default [
  // 列表接口（产品）
  {
    url: '/product/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { title, pageIndex, pageSize } = query
      const mockList = ProductList.filter((item) => {
        return !(title && item.name.indexOf(title) < 0)
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },
  // 保存接口（产品）
  {
    url: '/product/save',
    method: 'post',
    timeout,
    response: ({ body }) => {
      if (!body.id) {
        ProductList = [
          Object.assign(body, {
            id: toAnyString()
          })
        ].concat(ProductList)
        return {
          code: result_code,
          data: 'success'
        }
      } else {
        ProductList.map((item) => {
          if (item.id === body.id) {
            for (const key in item) {
              item[key] = body[key]
            }
          }
        })
        return {
          code: result_code,
          data: 'success'
        }
      }
    }
  },
  // 详情接口（产品）
  {
    url: '/product/detail',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      for (const example of ProductList) {
        if (example.id === id) {
          return {
            code: result_code,
            data: example
          }
        }
      }
    }
  },
  // 删除接口（产品）
  {
    url: '/product/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: '500',
          message: '请选择需要删除的数据'
        }
      } else {
        let i = ProductList.length
        while (i--) {
          if (ids.indexOf(ProductList[i].id) !== -1) {
            ProductList.splice(i, 1)
          }
        }
        return {
          code: result_code,
          data: 'success'
        }
      }
    }
  },

  // 列表接口（用户）
  {
    url: '/user/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { title, pageIndex, pageSize } = query
      const mockList = UserList.filter((item) => {
        return !(title && item.userName.indexOf(title) < 0)
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },
  // 保存接口（用户）
  {
    url: '/user/save',
    method: 'post',
    timeout,
    response: ({ body }) => {
      if (!body.id) {
        UserList = [
          Object.assign(body, {
            id: toAnyString()
          })
        ].concat(UserList)
        return {
          code: result_code,
          data: 'success'
        }
      } else {
        UserList.map((item) => {
          if (item.id === body.id) {
            for (const key in item) {
              item[key] = body[key]
            }
          }
        })
        return {
          code: result_code,
          data: 'success'
        }
      }
    }
  },
  // 详情接口（用户）
  {
    url: '/user/detail',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      for (const example of UserList) {
        if (example.id === id) {
          return {
            code: result_code,
            data: example
          }
        }
      }
    }
  },
  // 删除接口（用户）
  {
    url: '/user/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: '500',
          message: '请选择需要删除的数据'
        }
      } else {
        let i = UserList.length
        while (i--) {
          if (ids.indexOf(UserList[i].id) !== -1) {
            UserList.splice(i, 1)
          }
        }
        return {
          code: result_code,
          data: 'success'
        }
      }
    }
  }
] as MockMethod[]

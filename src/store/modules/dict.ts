import { defineStore } from 'pinia'
import { store } from '../index'

export interface DictState {
  isSetDict: boolean
  dictObj: Recordable
}

export const useDictStore = defineStore({
  id: 'dict',
  state: (): DictState => ({
    isSetDict: false,
    dictObj: {}
  }),
  persist: {
    enabled: true
  },
  getters: {
    getDictObj(): Recordable {
      return this.dictObj
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    }
  },
  actions: {
    setDictObj(dictObj: Recordable) {
      this.dictObj = dictObj
    },
    setIsSetDict(isSetDict: boolean) {
      this.isSetDict = isSetDict
    }
  }
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}

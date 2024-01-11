import { defineStore } from 'pinia'

interface CharacterInfo {
  rank: number
  id: number
  fid: number
  title: string
  career: string[]
}

export const useCharacterComparsionStore = defineStore('characterComparsionStore', {
  state: () => ({
    characterList: [] as CharacterInfo[],
  }),
  getters: {
    characters: state => state.characterList,
  },
  actions: {
    add(item: CharacterInfo) {
      for (let i = 0; i < this.characterList.length; i++) {
        if (this.characterList[i].id === item.id)
          return [false, '无需重复添加']
      }
      this.characterList.push(item)
      return [true, '添加成功']
    },
    remove(id: number) {
      this.characterList = this.characterList.filter(item => item.id !== id)
    },
    clear() {
      this.characterList = []
    },
  },
})

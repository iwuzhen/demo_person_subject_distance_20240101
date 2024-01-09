import { userAlova } from '..'

// 获取 person index
export function getPersonIndex() {
  return userAlova.Get('/person_index.json', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    transformData(rawData: any) {
      return rawData
    },

  })
}
// 获取用户信息
export const getPersonData = (id: any) => userAlova.Get(`/person_data_${id}.json`)
// 获取用户text
export const getPersonText = (id: any) => userAlova.Get(`/person_text_${id}.json`)

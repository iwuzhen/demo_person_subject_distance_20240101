import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import GlobalFetch from 'alova/GlobalFetch'

// user alova instance
export const userAlova = createAlova({
  baseURL: '/data',
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  responded: {
    onSuccess: response => response.json(),
    onError: (error) => {
      return error
    },
  },
})

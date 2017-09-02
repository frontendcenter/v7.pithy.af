import { API } from './utils'
import { observable, toJS } from 'mobx'

const store = observable({
  cache: new Map(),
  error: false
})

const fetchAndGetTogetherAtLast = ({hit_endpoint}) => {
  return (...args) => {
    const key = hit_endpoint(...args)
    console.log(key)
    if (!store.cache.has(key)) {
      console.log('💁')
      store.cache.set(key, null)

      fetch(key)
        .then(response => response.json())
        .then(data => store.cache.set(key, data), () => store.error = true)
    } else {
      console.log('✋')
    }
    return store.cache.get(key)
  }
}

export const getFeaturedQuotes = fetchAndGetTogetherAtLast({
  hit_endpoint: () => `${API}/quotes/featured`,
})

export const getQuoteById = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/quotes/${id}`,
})

export const getQuotesByAuthor = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/authors/${id}`,
})

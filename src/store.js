import { API } from './utils'
import { observable } from 'mobx'

const store = observable({
  featured_quotes: null,
  quotes: new Map(),
  quotes_by_author: new Map(),
  error: false
})

const fetchAndGetTogetherAtLast = ({hit_endpoint, then_save, always_returning}) => {
  const cache = new Map()

  return (...args) => {
    const key = hit_endpoint(...args)
    console.log(key)
    if (!cache.has(key)) {
      console.log('💁')
      cache.set(key, always_returning)

      fetch(key)
        .then(response => response.json())
        .then(data => then_save(...args, data), () => store.error = true)
    } else {
      console.log('✋')
    }
    return cache.get(key)(...args)
  }
}

export const getFeaturedQuotes = fetchAndGetTogetherAtLast({
  hit_endpoint: () => `${API}/quotes/featured`,
  then_save: (quotes) => store.featured_quotes = quotes,
  always_returning: () => store.featured_quotes,
})

export const getQuoteById = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/quotes/${id}`,
  then_save: (id, quote) => store.quotes.set(id, quote),
  always_returning: id => store.quotes.get(id),
})

export const getQuotesByAuthor = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/authors/${id}`,
  then_save: (id, quotes) => store.quotes_by_author.set(id, quotes),
  always_returning: id => store.quotes_by_author.get(id),
})

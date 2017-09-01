import { API } from './utils'
import { observable } from 'mobx'

const store = observable({
  featured_quotes: null,
  quotes: new Map(),
  quotes_by_author: new Map(),
  error: false
})

const fetchAndGetTogetherAtLast = (definition_function) => {
  const getters = new Map()

  return (...args) => {
    const key = JSON.stringify(args)
    console.log(definition_function('').hit_endpoint, JSON.stringify(args))
    if (!getters.has(key)) {
      console.log('💁')
      const { hit_endpoint, then_save, always_returning } = definition_function(...args)
      getters.set(key, always_returning)

      fetch(hit_endpoint)
        .then(response => response.json())
        .then(then_save, () => store.error = true)
    } else {
      console.log('✋')
    }
    return getters.get(key)()
  }
}

export const getFeaturedQuotes = fetchAndGetTogetherAtLast(() => ({
  hit_endpoint: `${API}/quotes/featured`,
  then_save: quotes => store.featured_quotes = quotes,
  always_returning: () => store.featured_quotes,
}))

export const getQuoteById = fetchAndGetTogetherAtLast(id => ({
  hit_endpoint: `${API}/quotes/${id}`,
  then_save: quote => store.quotes.set(id, quote),
  always_returning: () => store.quotes.get(id),
}))

export const getQuotesByAuthor = fetchAndGetTogetherAtLast(id => ({
  hit_endpoint: `${API}/authors/${id}`,
  then_save: quotes => store.quotes_by_author.set(id, quotes),
  always_returning: () => store.quotes_by_author.get(id),
}))

import { API } from './utils'
import { observable } from 'mobx'

const store = observable({
  featured_quotes: null,
  quotes: new Map(),
  error: false
})

const fetchAndGetTogetherAtLast = (definition_function) => {
  const getters = new Map()

  return (...args) => {
    const key = JSON.stringify(args)
    if (!getters.has(key)) {
      const { hit_endpoint, then_save, always_returning } = definition_function(...args)
      getters.set(key, always_returning)

      fetch(hit_endpoint)
        .then(response => response.json())
        .then(then_save, () => store.error = true)
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

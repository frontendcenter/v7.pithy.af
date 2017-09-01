import { API } from './utils'
import { observable } from 'mobx'

const store = observable({
  featured_quotes: null,
  error: false
})

const fetchAndGetTogetherAtLast = (endpoint, fetcher, getter) => {
  const fetched = new Set()

  return (...args) => {
    const key = JSON.stringify(args)
    if (!fetched.has(key)) {
      fetched.add(key)
      fetch(endpoint(...args))
        .then(response => response.json())
        .then(fetcher, () => store.error = true)
    }
    return getter()
  }
}

export const getFeaturedQuotes = fetchAndGetTogetherAtLast(
  () => `${API}/quotes/featured`,
  (quotes) => store.featured_quotes = quotes,
  () => store.featured_quotes,
)

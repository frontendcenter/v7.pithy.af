import { API } from './utils'
import { observable } from 'mobx'

const store = observable({
  featured_quotes: null,
  error: false
})

let loading = false
export const getFeaturedQuotes = () => {
  if (!loading) {
    loading = true

    fetch(`${API}/quotes/featured`)
      .then(response => response.json())
      .then(quotes => {
        store.featured_quotes = quotes
      }, () => {
        store.error = true
      })
  }
  return store.featured_quotes
}

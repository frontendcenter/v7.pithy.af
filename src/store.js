import { API } from './utils'
import { observable, toJS, runInAction, extendObservable } from 'mobx'

const store = observable({
  featured_quote_ids: null,
  quotes_by_id: new Map(),
  cache: new Map(),
  error: false
})

const fetchAndGetTogetherAtLast = ({hit_endpoint, then_save, always_returning}) => {
  return (...args) => {
    const key = hit_endpoint(...args)
    console.log(key)
    if (!store.cache.has(key)) {
      console.log('💁')
      store.cache.set(key, null)

      fetch(key)
        .then(response => response.json())
        .then(data => {
          runInAction(() => {
            store.cache.set(key, data)
            if (then_save) then_save(...args, data)
          })
          console.log(toJS(store))
        }, () => store.error = true)
    } else {
      console.log('✋')
    }
    return always_returning ? always_returning(...args) : store.cache.get(key)
  }
}

class Quote {
  constructor(json) {
    extendObservable(this, json)
  }

  upvote = () => {
    this.score = this.score + 1
  }
}

export const getFeaturedQuotes = fetchAndGetTogetherAtLast({
  hit_endpoint: () => `${API}/quotes/featured`,
  then_save: quotes => {
    store.featured_quote_ids = quotes.map(quote => {
      store.quotes_by_id.set(quote.id, new Quote(quote))
      return quote.id
    })
  },
  always_returning: () => store.featured_quote_ids && store.featured_quote_ids.map(id => store.quotes_by_id.get(id))
})

export const getQuoteById = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/quotes/${id}`,
  then_save: (id, quote) => store.quotes_by_id.set(id, new Quote(quote)),
  always_returning: id => store.quotes_by_id.get(id)
})

export const getQuotesByAuthor = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/authors/${id}`,
})

export const getQuotesByWork = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/works/${id}`,
})

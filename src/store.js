import { API } from './utils'
import { observable, toJS, runInAction, extendObservable, action } from 'mobx'

const store = observable({
  featured_quote_ids: null,
  quotes_by_id: new Map(),
  quotes_ids_by_author: new Map(),
  quotes_ids_by_work: new Map(),
  cache: new Map(),
  error: false
})

const fetchAndGetTogetherAtLast = ({ hit_endpoint, then_save, always_returning }) => {
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

export const getFeaturedQuotes = fetchAndGetTogetherAtLast({
  hit_endpoint: () => `${API}/quotes/featured`,
  then_save: quotes => {
    store.featured_quote_ids = quotes.map(quote => {
      store.quotes_by_id.set(quote.id, observable(quote))
      return quote.id
    })
  },
  always_returning: () => store.featured_quote_ids && store.featured_quote_ids.map(id => store.quotes_by_id.get(id)),
})

export const getQuoteById = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/quotes/${id}`,
  then_save: (id, quote) => store.quotes_by_id.set(id, observable(quote)),
  always_returning: id => store.quotes_by_id.get(id),
})

export const getQuotesByAuthor = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/authors/${id}`,
  then_save: (id,quotes) => {
    store.quotes_ids_by_author.set(id, quotes.map(quote => {
      store.quotes_by_id.set(quote.id, observable(quote))
      return quote.id
    }))
  },
  always_returning: id => store.quotes_ids_by_author.has(id) && store.quotes_ids_by_author.get(id).map(id => store.quotes_by_id.get(id)),
})

export const getQuotesByWork = fetchAndGetTogetherAtLast({
  hit_endpoint: id => `${API}/works/${id}`,
  then_save: (id,quotes) => {
    store.quotes_ids_by_work.set(id, quotes.map(quote => {
      store.quotes_by_id.set(quote.id, observable(quote))
      return quote.id
    }))
  },
  always_returning: id => store.quotes_ids_by_work.has(id) && store.quotes_ids_by_work.get(id).map(id => store.quotes_by_id.get(id)),
})

export const upvoteQuote = action(id => {
  const quote = store.quotes_by_id.get(id)
  console.log(quote)
  quote.score += 1
  console.log(toJS(store))
})

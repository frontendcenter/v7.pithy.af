import { API } from './utils'
import { observable, extendObservable } from 'mobx'

const fetch_json = (url, opts = {}) => fetch(url, opts).then(response => response.json())

const all_quotes = observable.map()

class Quote {
  constructor(data) {
    extendObservable(this, data, {
      upvotes_in_flight: 0,
      get display_score() {
        return this.score + this.upvotes_in_flight
      }
    })
  }

  upvote = () => {
    this.upvotes_in_flight += 1
    //setTimeout(() =>
    fetch_json(`${API}/quotes/${this.id}/upvote`, { method: 'POST' })
      .then(this.update)
      //.then(quote => all_quotes.set(quote.id, new Quote(quote)))
      .then(() => this.upvotes_in_flight -= 1)
    //, 2000)
  }

  update = json => {
    Object.assign(this, json)
  }

  static get(id) {
    if (!all_quotes.has(id)) {
      all_quotes.set(id, null)
      fetch_json(`${API}/quotes/${id}`)
        .then(data => all_quotes.set(id, new Quote(data)))
    }
    return all_quotes.get(id)
  }

  static add(quote) {
    if (!all_quotes.has(quote.id)) {
      all_quotes.set(quote.id, new Quote(quote))
    } else {
      all_quotes.get(quote.id).update(quote)
    }
  }
}

class QuoteList {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.loading = false
    extendObservable(this, {
      ids: null
    })
  }

  load() {
    this.loading = true
    fetch_json(`${API}/${this.endpoint}`)
      .then(data => {
        this.ids = data.map(quote => {
          Quote.add(quote)
          return quote.id
        })
      })
  }

  to_json = () => {
    if (!this.loading) this.load()
    return this.ids && this.ids.map(Quote.get)
  }

  static lists_by_endpoint = new Map()

  static for_endpoint(url) {
    if (this.lists_by_endpoint.has(url)) return this.lists_by_endpoint.get(url).to_json()
    const list = new QuoteList(url)
    this.lists_by_endpoint.set(url, list)
    return list.to_json()
  }
}

const X = {
  get: id => Quote.get(id),
  featured: () => QuoteList.for_endpoint('quotes/featured'),
  for_author: id => QuoteList.for_endpoint(`/authors/${id}`),
  for_work: id => QuoteList.for_endpoint(`works/${id}`)
}
export { X as Quotes }

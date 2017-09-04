import { API } from './utils'
import { extendObservable } from 'mobx'

const fetch_json = url => fetch(url).then(response => response.json())

class Quote {
  constructor(data) {
    extendObservable(this, data)
  }

  upvote = () => {
    this.score += 1
  }
}

class Quotes {
  constructor() {
    extendObservable(this, {
      quotes: new Map()
    })
  }

  set_quote(id, quote) {
    this.quotes.set(id, new Quote(quote))
  }

  get_quote = id => {
    if (!this.quotes.has(id)) {
      this.quotes.set(id, null)
      fetch_json(`${API}/quotes/${id}`)
        .then(data => this.quotes.set(id, data))
    }
    return this.quotes.get(id)
  }
}

export const QuotesById = new Quotes()

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
          QuotesById.set_quote(quote.id, quote)
          return quote.id
        })
      })
  }

  to_json = () => {
    if (!this.loading) this.load()
    return this.ids && this.ids.map(QuotesById.get_quote)
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
  get: id => QuotesById.get_quote(id),
  featured: () => QuoteList.for_endpoint('quotes/featured'),
  for_author: id => QuoteList.for_endpoint(`/authors/${id}`),
  for_work: id => QuoteList.for_endpoint(`works/${id}`)
}
export { X as Quotes }

import { API } from './utils'
import { observable, toJS, runInAction, extendObservable, action } from 'mobx'

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

class Lists {
  constructor() {
    extendObservable(this, {
      lists: new Map()
    })
  }

  from_json(endpoint, data) {
    this.lists.set(endpoint, data.map(quote => {
      QuotesById.set_quote(quote.id, quote)
      return quote.id
    }))
  }

  for_endpoint(endpoint) {
    if (!this.lists.has(endpoint)) {
      this.lists.set(endpoint, null)
      fetch_json(`${API}/${endpoint}`)
        .then(data => this.from_json(endpoint, data))
    }
    const list = this.lists.get(endpoint)
    return list && list.map(QuotesById.get_quote)
  }
}
export const QuoteLists = new Lists()

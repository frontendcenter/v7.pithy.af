import { extendObservable } from 'mobx'

import { API, fetch_json } from '../utils'
import Quote from './Quote'

class QuoteList {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.loading = false
    extendObservable(this, {
      quotes: null
    })
  }

  load() {
    this.loading = true
    fetch_json(`${API}/${this.endpoint}`)
      .then(data => this.quotes = data.map(Quote.add))
  }

  to_json = () => {
    if (!this.loading) this.load()
    return this.quotes
  }
}

const lists_by_endpoint = new Map()

QuoteList.for_endpoint = endpoint => {
  if (lists_by_endpoint.has(endpoint)) return lists_by_endpoint.get(endpoint).to_json()
  const list = new QuoteList(endpoint)
  lists_by_endpoint.set(endpoint, list)
  return list.to_json()
}

export default QuoteList

import { extendObservable } from 'mobx'

import { API, fetch_json } from '../utils'
import Quote from './Quote'

export default class QuoteList {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.loading = false
    extendObservable(this, {
      ids: null
    })
  }

  load() {
    this.loading = true
    fetch_json(`${API}/${this.endpoint}`).then(data =>
      this.ids = data.map(quote => {
        Quote.add(quote)
        return quote.id
      })
    )
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
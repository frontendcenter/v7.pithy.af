import { observable, extendObservable } from 'mobx'

import { API, fetch_json } from '../utils'

const all_quotes = observable.map()

export default class Quote {
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


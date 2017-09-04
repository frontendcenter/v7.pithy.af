import { observable, extendObservable } from 'mobx'

import { API, fetch_json } from '../utils'

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
    fetch_json(`${API}/quotes/${this.id}/upvote`, { method: 'POST' })
      .then(this.update)
      .then(() => this.upvotes_in_flight -= 1)
  }

  update = json => {
    Object.assign(this, json)
  }
}

const all_quotes = observable.map()

Quote.add = json => {
  let quote = all_quotes.get(json.id)
  if (quote) {
    quote.update(json)
  } else {
    quote = new Quote(json)
    all_quotes.set(json.id, quote)
  }
  return quote
}

Quote.get = id => {
  if (!all_quotes.has(id)) {
    all_quotes.set(id, null)
    fetch_json(`${API}/quotes/${id}`)
      .then(Quote.add)
  }
  return all_quotes.get(id)
}

export default Quote

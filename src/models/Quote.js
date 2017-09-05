import { extendObservable } from 'mobx'

import { API, CachedMap, fetch_json } from '../utils'

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

const all_quotes = CachedMap({
  fetch_callback:
    id => fetch_json(`${API}/quotes/${id}`)
      .then(Quote.add),
})

Quote.add = json => all_quotes.create_or_update(json.id, {
  create: () => new Quote(json),
  update: quote => quote.update(json),
})

Quote.get = id => all_quotes.get_or_fetch(id)

export default Quote

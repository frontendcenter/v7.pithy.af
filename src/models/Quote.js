import { extendObservable } from 'mobx'
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

export default Quote

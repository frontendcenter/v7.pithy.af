import { ObservableMap } from 'mobx'
import Quote from '../models/Quote'
import { API, fetch_json } from '../utils/index'

const all_quotes = new ObservableMap()

const Quotes = {
  add(json) {
    const existing = all_quotes.get(json.id)
    if (existing) {
      existing.update(json)
      return existing
    } else {
      const created = new Quote(json)
      all_quotes.set(json.id, created)
      return created
    }
  },
  get(id) {
    if (!all_quotes.has(id)) {
      all_quotes.set(id, null)
      fetch_json(`${API}/quotes/${id}`)
        .then(Quotes.add)
        .then(quote => all_quotes.set(id, quote))
    }
    return all_quotes.get(id)
  },
}

export default Quotes

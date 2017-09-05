import CachedMap from '../utils/CachedMap'
import Quote from '../models/Quote'
import { API, fetch_json } from '../utils/index'

const all_quotes = new CachedMap()

const Quotes = {
  add: json =>
    all_quotes.create_or_update(json.id, {
      create: () => new Quote(json),
      update: quote => quote.update(json),
    }),

  get: id =>
    all_quotes.get_or_fetch(id, {
      fetcher: () =>
        fetch_json(`${API}/quotes/${id}`)
          .then(Quotes.add)
    }),
}

export default Quotes

import { API, CachedMap, fetch_json } from '../utils'
import Quote from './Quote'

const quote_lists = CachedMap({
  fetch_callback:
    endpoint => fetch_json(`${API}/${endpoint}`)
      .then(data => data.map(Quote.add)),
})

const QuoteList = {
  featured: () => quote_lists.get_or_fetch('quotes/featured'),
  for_author: id => quote_lists.get_or_fetch(`/authors/${id}`),
  for_work: id => quote_lists.get_or_fetch(`works/${id}`)
}

export default QuoteList

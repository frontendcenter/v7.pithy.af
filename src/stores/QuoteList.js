import { API, fetch_json } from '../utils'
import CachedMap from '../utils/CachedMap'
import Quotes from './Quotes'

const quote_lists = new CachedMap({
  default_fetcher:
    endpoint => fetch_json(`${API}/${endpoint}`)
      .then(data => data.map(Quotes.add)),
})

const QuoteList = {
  featured: () => quote_lists.get_or_fetch('quotes/featured'),
  for_author: id => quote_lists.get_or_fetch(`/authors/${id}`),
  for_work: id => quote_lists.get_or_fetch(`works/${id}`)
}

export default QuoteList

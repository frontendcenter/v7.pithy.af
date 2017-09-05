import { ObservableMap } from 'mobx'
import { API, fetch_json } from '../utils'
import Quotes from './Quotes'

const quote_lists = new ObservableMap()

const get_for_endpoint = (endpoint) => {
  if (!quote_lists.has(endpoint)) {
    quote_lists.set(endpoint, null)
    fetch_json(`${API}/${endpoint}`)
      .then(data => data.map(Quotes.add))
      .then(quotes => quote_lists.set(endpoint, quotes))
  }
  return quote_lists.get(endpoint)
}

const QuoteList = {
  featured: () => get_for_endpoint('quotes/featured'),
  for_author: id => get_for_endpoint(`/authors/${id}`),
  for_work: id => get_for_endpoint(`works/${id}`)
}

export default QuoteList

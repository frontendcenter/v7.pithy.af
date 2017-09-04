import Quote from './models/Quote'
import QuoteList from './models/QuoteList'

export const Quotes = {
  get: id => Quote.get(id),
  featured: () => QuoteList.for_endpoint('quotes/featured'),
  for_author: id => QuoteList.for_endpoint(`/authors/${id}`),
  for_work: id => QuoteList.for_endpoint(`works/${id}`)
}

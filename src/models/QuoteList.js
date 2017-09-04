import { extendObservable, observable } from 'mobx'

import { API, fetch_json } from '../utils'
import Quote from './Quote'

const lists_by_endpoint = observable.map()

const QuoteList = {
  for_endpoint: endpoint => {
    if (!lists_by_endpoint.has(endpoint)) {
      lists_by_endpoint.set(endpoint, null)
      fetch_json(`${API}/${endpoint}`)
        .then(data => lists_by_endpoint.set(endpoint, data.map(Quote.add)))
    }
    return lists_by_endpoint.get(endpoint)
  }
}

export default QuoteList

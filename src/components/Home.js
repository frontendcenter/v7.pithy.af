import React from 'react'
import Quote from './Quote'
import End from './End'
import { observer } from 'mobx-react'
import QuoteLists from '../models/QuoteList'

const Home = () => {
  const quotes = QuoteLists.featured()
  return (
    <div className="Quotes">
      {
        quotes && quotes
          .map((quote, i) => <Quote key={i} quote={quote}/>)
          .concat(
            <End key="end">
              <span>That's all the quotes we have.</span>
            </End>
          )
      }
    </div>
  )
}

export default observer(Home)

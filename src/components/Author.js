import React from 'react'
import { observer } from 'mobx-react'

import Quote from './Quote'
import End from './End'
import QuoteLists from '../stores/QuoteList'

export const Author = observer(({ id, exclude }) => {
  const quotes = QuoteLists.for_author(id)

  return (
    <div className="Quotes">
      {exclude && <div/>}
      {
        quotes && quotes.map((quote, i) =>
          exclude === quote.id
            ? null
            : <Quote key={i} quote={quote}/>
        ).concat(
          <End key="end">
            <span>No more quotes for <em>{quotes[0].name}</em>.</span>
          </End>
        )
      }
    </div>
  )
})

export default ({ match: { params } }) => <Author id={params.id}/>

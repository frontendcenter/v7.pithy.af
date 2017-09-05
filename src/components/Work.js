import React from 'react'
import { observer } from 'mobx-react'

import Quote from './Quote'
import { simplify } from '../utils'
import End from './End'
import Link from './Link'
import QuoteLists from '../stores/QuoteList'

export const Work = observer(({ id }) => {
  const quotes = QuoteLists.for_work(id)

  return (
    <div className="Quotes">
      {
        quotes && quotes.map(
          (quote, i) => <Quote key={i} quote={quote}/>
        ).concat(
          <End key="end">
            <span><em>{quotes[0].title}</em> has no further quotes.</span>
            <Link to={`/authors/${simplify(quotes[0].name)}-${quotes[0].author_id}`} obvious>
              See more by { quotes[0].name }
            </Link>
            or
          </End>
        )
      }
    </div>
  )
})

export default ({ match: { params } }) => <Work id={params.id}/>

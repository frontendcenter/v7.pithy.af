import React from 'react'
import cx from 'classnames'

const ButtonLink = ({ className, type = 'button', ...props }) => (
  <button
    className={cx('ButtonLink', className)}
    type={type}
    {...props}/>
)

export default ButtonLink

import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const changeVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { changeVisibility }
  })

  if(visible === false) {
    return (
      <div>
        <button onClick={changeVisibility}>{props.buttonLabel}</button>
      </div>
    )
  }

  else {
    return (
      <div>
        {props.children}
        <button onClick={changeVisibility}>cancel</button>
      </div>
    )
  }
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
Togglable.displayName = 'Togglable'

export default Togglable
import React from 'react'
import Dropdown from 'react-simple-dropdown'

class Menu extends React.Component {
  handleMouseDown () {
    // fetch options aync maybe?
    // log that the dropdown has been opened? whatever you want!
  }

  render () {
    const content = `
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat.
    `

    return (
      <div>
        <Dropdown content={content} onMouseDown={this.handleMouseDown}>
          'Open me!'
        </Dropdown>
      </div>
    )
  }
}

export default Menu;
const React = require('preact')
const {
  insertBefore,
  onEnterViewport,
  restoreAll
} = require('@qubit/utils/dom')()

module.exports = function renderPlacement ({
  content,
  onImpression,
  onClickthrough,
  onRemove,
  elements: [target]
}) {
  onRemove(restoreAll)

  const element = document.createElement('div')
  insertBefore(target, element)

  // Emitting onImpression before branching into control/variant prevents bad splits
  onEnterViewport(element, onImpression)

  if (content) {
    const { message, image, link } = content

    React.render(
      <div className='Hero' style={{ backgroundImage: `url(${image})` }}>
        <h2 className='Hero-title'>{message}</h2>
        <a href={link} className='Hero-button' onClick={onClickthrough}>
          Click here
        </a>
      </div>,
      element
    )
  }
}

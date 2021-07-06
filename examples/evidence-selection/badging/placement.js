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
    const { message } = content

    React.render(
      <span className='BadgePill' onClick={onClickthrough}>
        {message}
      </span>,
      element
    )
  }
}

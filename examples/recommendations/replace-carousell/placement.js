const React = require('preact')
const {
  insertBefore,
  onEnterViewport,
  style,
  restoreAll
} = require('@qubit/utils/dom')()

const Glide = require('@glidejs/glide')

module.exports = function renderPlacement ({
  elements: [target],
  content,
  onImpression,
  onClickthrough,
  onRemove
}) {
  onRemove(restoreAll)

  const el = document.createElement('div')
  insertBefore(target, el)

  // Emitting onImpression before branching into control/variant prevents bad splits
  onEnterViewport(el, onImpression)

  if (content) {
    onEnterViewport(target, () =>
      onImpression('product', content.recs.map(item => item.details.id))
    )
    renderCarousel(content, el)
    style(target, { display: 'none' })
  } else {
    emitProductEvents()
  }

  function renderCarousel (content, el) {
    const { headline, recs } = content
    React.render(
      <div id='glide' className='RecsContainer' onClick={onClickthrough}>
        <h3 className='RecsContainer-headline'>{headline}</h3>
        <div className='RecsContainer-carousel' data-glide-el='track'>
          <ul className='RecsContainer-slides glide__slides'>
            {recs.map(({ details }, idx) => (
              <Product key={idx} item={details} />
            ))}
          </ul>
        </div>
      </div>,
      el
    )
    new Glide('#glide', { perView: 5, autoplay: 3000 }).mount()
  }

  function Product ({ item }) {
    const {
      id,
      name,
      url,
      currency,
      image_url: imageUrl,
      unit_price: unitPrice
    } = item

    const price =
      Intl && Intl.NumberFormat
        ? new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currency
          }).format(unitPrice)
        : unitPrice

    return (
      <li className='RecsContainer-product glide__slide'>
        <img className='RecsContainer-productImg' src={imageUrl} alt={name} />
        <a
          className='RecsContainer-productName'
          href={url}
          onClick={() => onClickthrough('product', id)}
        >
          {name}
        </a>
        <span className='RecsContainer-productPrice'>{price}</span>
      </li>
    )
  }

  function emitProductEvents () {
    // Emit product impression events and setup product clickthough handlers for the control
  }
}

const setup = require('@qubit/jest/setup')
const content = require('./payload.json')
const renderPlacement = require('./placement')

describe('placement.js', () => {
  let placement

  afterEach(() => {
    placement.teardown()
    document.body.innerHTML = ''
  })

  describe('with content', () => {
    beforeEach(() => {
      placement = setup({ content, elements: [createRecs()] })
      return renderPlacement(placement.api)
    })

    it('renders products', () => {
      expect(
        document.querySelectorAll('.RecsContainer-product').length
      ).toEqual(placement.api.content.recs.length)
    })

    it('renders product urls', () => {
      const container = document.querySelector('.RecsContainer')

      for (const item of placement.api.content.recs) {
        expect(container.innerHTML).toEqual(
          expect.stringContaining(item.details.url)
        )
      }
    })

    it('renders product images', () => {
      const container = document.querySelector('.RecsContainer')

      for (const item of placement.api.content.recs) {
        expect(container.innerHTML).toEqual(
          expect.stringContaining(item.details.image_url)
        )
      }
    })

    it('calls onImpression', () => {
      expect(placement.api.onImpression.mock.calls[0]).toEqual([])
    })

    it('calls onImpression(product, productId)', () => {
      expect(placement.api.onImpression.mock.calls[1]).toEqual([
        'product',
        ['1', '2', '3']
      ])
    })

    it('calls onClickthrough', () => {
      const container = document.querySelector('.RecsContainer')
      expect(placement.api.onClickthrough.mock.calls.length).toBe(0)
      container.click()
      expect(placement.api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough(product, productId)', () => {
      const links = document.querySelectorAll('.RecsContainer a')
      expect(placement.api.onClickthrough.mock.calls.length).toBe(0)
      links.forEach(link => link.click())
      expect(
        placement.api.onClickthrough.mock.calls
          .filter(([type, id]) => type === 'product')
          .map(([type, id]) => id)
      ).toEqual(['1', '2', '3'])
    })

    it('cleans up after itself', () => {
      const el = document.querySelector('.RecsContainer')
      expect(document.body.contains(el)).toEqual(true)
      placement.teardown()
      expect(document.body.contains(el)).toEqual(false)
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      placement = setup({ content: null, elements: [createRecs()] })
      return renderPlacement(placement.api)
    })

    it('calls onImpression', () => {
      expect(placement.api.onImpression.mock.calls.length).toBe(1)
    })
  })
})

function createRecs () {
  const el = document.createElement('div')
  el.className = 'recs'
  document.body.append(el)
  return el
}

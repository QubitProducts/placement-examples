const setup = require('@qubit/jest/setup')
const content = require('./payload.json')
const renderPlacement = require('./placement')

describe('placement.js', () => {
  let fixture

  afterEach(() => {
    fixture.teardown()
    document.body.innerHTML = ''
  })

  describe('with content', () => {
    beforeEach(() => {
      fixture = setup({ content, elements: [createRecs()] })
      return renderPlacement(fixture.api)
    })

    it('hides the existing carousel', () => {
      expect(
        window.getComputedStyle(document.querySelector('.recs')).display
      ).toEqual('none')
    })

    it('renders products', () => {
      expect(
        document.querySelectorAll('.RecsContainer-product').length
      ).toEqual(fixture.api.content.recs.length)
    })

    it('renders product urls', () => {
      const container = document.querySelector('.RecsContainer')

      for (const item of fixture.api.content.recs) {
        expect(container.innerHTML).toEqual(
          expect.stringContaining(item.details.url)
        )
      }
    })

    it('renders product images', () => {
      const container = document.querySelector('.RecsContainer')

      for (const item of fixture.api.content.recs) {
        expect(container.innerHTML).toEqual(
          expect.stringContaining(item.details.image_url)
        )
      }
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls[0]).toEqual([])
    })

    it('calls onImpression(product, productId)', () => {
      expect(fixture.api.onImpression.mock.calls[1]).toEqual([
        'product',
        ['1', '2', '3']
      ])
    })

    it('calls onClickthrough', () => {
      const container = document.querySelector('.RecsContainer')
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      container.click()
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough(product, productId)', () => {
      const links = document.querySelectorAll('.RecsContainer a')
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      links.forEach(link => link.click())
      expect(
        fixture.api.onClickthrough.mock.calls
          .filter(([type, id]) => type === 'product')
          .map(([type, id]) => id)
      ).toEqual(['1', '2', '3'])
    })

    it('cleans up after itself', () => {
      const el = document.querySelector('.RecsContainer')
      expect(document.body.contains(el)).toEqual(true)
      fixture.teardown()
      expect(document.body.contains(el)).toEqual(false)
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      fixture = setup({ content: null, elements: [createRecs()] })
      return renderPlacement(fixture.api)
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })
  })
})

function createRecs () {
  const el = document.createElement('div')
  el.className = 'recs'
  document.body.append(el)
  return el
}

const setup = require('@qubit/jest/setup')
const content = require('./payload.json')
const renderPlacement = require('./placement')

describe('placement.js', () => {
  let api, teardown

  beforeEach(() => {
    ;({ api, teardown } = setup({ elements: [createRecs()] }))
  })

  afterEach(() => {
    teardown()
    document.body.innerHTML = ''
  })

  describe('with content', () => {
    beforeEach(() => {
      api.content = content
    })

    it('hides the existing caroucell', () => {
      renderPlacement(api)
      expect(
        window.getComputedStyle(document.querySelector('.recs')).display
      ).toEqual('none')
    })

    it('renders products', () => {
      renderPlacement(api)
      expect(
        document.querySelectorAll('.RecsContainer-product').length
      ).toEqual(api.content.recs.length)
    })

    it('renders product urls', () => {
      renderPlacement(api)

      const container = document.querySelector('.RecsContainer')

      for (const item of api.content.recs) {
        expect(container.innerHTML).toEqual(
          expect.stringContaining(item.details.url)
        )
      }
    })

    it('renders product images', () => {
      renderPlacement(api)

      const container = document.querySelector('.RecsContainer')

      for (const item of api.content.recs) {
        expect(container.innerHTML).toEqual(
          expect.stringContaining(item.details.image_url)
        )
      }
    })

    it('calls onImpression', () => {
      renderPlacement(api)

      expect(api.onImpression.mock.calls[0]).toEqual([])
    })

    it('calls onImpression(product, productId)', () => {
      renderPlacement(api)

      expect(api.onImpression.mock.calls[1]).toEqual([
        'product',
        ['1', '2', '3']
      ])
    })

    it('calls onClickthrough', () => {
      renderPlacement(api)
      const container = document.querySelector('.RecsContainer')
      expect(api.onClickthrough.mock.calls.length).toBe(0)
      container.click()
      expect(api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough(product, productId)', () => {
      renderPlacement(api)
      const links = document.querySelectorAll('.RecsContainer a')
      expect(api.onClickthrough.mock.calls.length).toBe(0)
      links.forEach(link => link.click())
      expect(
        api.onClickthrough.mock.calls
          .filter(([type, id]) => type === 'product')
          .map(([type, id]) => id)
      ).toEqual(['1', '2', '3'])
    })

    it('cleans up after itself', () => {
      renderPlacement(api)
      const el = document.querySelector('.RecsContainer')
      expect(document.body.contains(el)).toEqual(true)
      teardown()
      expect(document.body.contains(el)).toEqual(false)
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      api.content = null
    })

    it('calls onImpression', () => {
      renderPlacement(api)

      expect(api.onImpression.mock.calls.length).toBe(1)
    })
  })
})

function createRecs () {
  const el = document.createElement('div')
  el.className = 'recs'
  document.body.append(el)
  return el
}

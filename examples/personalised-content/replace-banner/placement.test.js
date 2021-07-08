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
      fixture = setup({ content, elements: [createHero()] })
      return renderPlacement(fixture.api)
    })

    it('hides the existing banner', () => {
      expect(
        window.getComputedStyle(document.querySelector('.OriginalHero')).display
      ).toEqual('none')
    })

    it('updates the banner image', () => {
      expect(document.querySelector('.Hero').style.backgroundImage).toEqual(
        expect.stringContaining(content.image)
      )
    })

    it('renders the message', () => {
      expect(document.querySelector('.Hero').innerHTML).toEqual(
        expect.stringContaining(content.message)
      )
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      document.querySelector('.Hero a').click()
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('cleans up after itself', () => {
      const el = document.querySelector('.Hero')
      expect(document.body.contains(el)).toBe(true)
      expect(window.getComputedStyle(fixture.api.elements[0]).display).toEqual(
        'none'
      )
      fixture.teardown()
      expect(document.body.contains(el)).toBe(false)
      expect(
        window.getComputedStyle(fixture.api.elements[0]).display
      ).not.toEqual('none')
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      fixture = setup({ content: null, elements: [createHero()] })
      return renderPlacement(fixture.api)
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      document.querySelector('.OriginalHero a').click()
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })
  })
})

function createHero () {
  const el = document.createElement('div')
  el.className = 'OriginalHero'
  el.innerHTML = `<a/>`
  document.body.append(el)
  return el
}

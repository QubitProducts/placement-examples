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
      fixture = setup({ content, elements: [createTarget()] })
      return renderPlacement(fixture.api)
    })

    it('renders the message', () => {
      expect(document.querySelector('.BadgePill').innerHTML).toEqual(
        expect.stringContaining(content.message)
      )
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      document.querySelector('.BadgePill').click()
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('cleans up after itself', () => {
      const el = document.querySelector('.BadgePill').parentElement
      expect(el.parentElement).toBeDefined()
      fixture.teardown()
      expect(el.parentElement).toBeNull()
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      fixture = setup({ content: null, elements: [createTarget()] })
      return renderPlacement(fixture.api)
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })
  })
})

function createTarget () {
  const el = document.createElement('div')
  el.className = 'Target'
  el.innerHTML = `<div/>`
  document.body.append(el)
  return el
}

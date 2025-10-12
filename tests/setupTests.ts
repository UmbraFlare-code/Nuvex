import "@testing-library/jest-dom"
import "whatwg-fetch"

// Polyfill universal para TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from "util"
;(global as any).TextEncoder = TextEncoder
;(global as any).TextDecoder = TextDecoder as any

import { setupServer } from "msw/node"
import { handlers } from "./mocks/handlers"

const server = setupServer(...(handlers || []))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

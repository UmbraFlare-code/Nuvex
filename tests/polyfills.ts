// tests/polyfills.ts
import { TextEncoder, TextDecoder } from "util"

// Asigna globalmente antes de que msw lo use
;(global as any).TextEncoder = TextEncoder
;(global as any).TextDecoder = TextDecoder as any

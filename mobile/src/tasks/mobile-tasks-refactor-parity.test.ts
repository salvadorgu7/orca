import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  readFlattenedMobileTasksHookSignatures,
  readMobileTasksSemanticSource,
  readMobileTasksStyleSource
} from './mobile-tasks-source-family.test-support'
import { readFlattenedMobileTasksRenderTokens } from './mobile-tasks-render-parity.test-support'
import {
  readFlattenedMobileTasksCoreStatements,
  readMobileTasksDeclarationSignatures
} from './mobile-tasks-execution-parity.test-support'

const hash = (parts: string[] | string): string =>
  createHash('sha256')
    .update(Array.isArray(parts) ? parts.join('\n') : parts)
    .digest('hex')

// Task and Linear sort tests cover computation changes; render/style guards remain.
const EXPECTED_SCREEN_HOOKS = '8521651e3638f70dcde35eb7447cb57e8f704b6937d18fe580fb14efeb953e15'
const EXPECTED_DIFF_HOOKS = '93c7189b32bed8456cc51814fffa8ce80cf62011ef968a9d53ddec2b9686f58f'
const EXPECTED_STATEMENTS = 'b191f0e4d5e4ef6ec040bfb20f45a96ebfe60e6c88b56eb3d85e6991dc4ad0c1'
const EXPECTED_DECLARATIONS = '91cd434cfdb703335414967956a030191ff6e36ae4edd6cb2a656ff5fe5dcb7e'
const EXPECTED_SEMANTICS = '51192a3fa402cdfb9b80c65ee3254d4aed306207ad5b413ada3fb659a575731e'
const EXPECTED_STYLES = '1db6af69c791d9963928541ad5310942fcbda6d984b422c90b6eb92b6816579a'
const EXPECTED_RENDER_TREE = '2111145136b1e4fbca150d4792d735a90e992488e9934cfc1a8b8f3be981f39f'

describe('Mobile Tasks refactor parity', () => {
  it('preserves recursively flattened hook and dependency order', () => {
    const screenHooks = readFlattenedMobileTasksHookSignatures('MobileTasksScreen')
    expect(screenHooks).toHaveLength(350)
    expect(hash(screenHooks)).toBe(EXPECTED_SCREEN_HOOKS)

    const diffHooks = readFlattenedMobileTasksHookSignatures('GitHubPrFileDiff')
    expect(diffHooks).toHaveLength(3)
    expect(hash(diffHooks)).toBe(EXPECTED_DIFF_HOOKS)
  })

  it('preserves every screen statement in execution order', () => {
    const statements = readFlattenedMobileTasksCoreStatements()
    expect(statements).toHaveLength(417)
    expect(hash(statements)).toBe(EXPECTED_STATEMENTS)
  })

  it('preserves every moved top-level declaration', () => {
    const declarations = readMobileTasksDeclarationSignatures()
    expect(declarations).toHaveLength(194)
    expect(hash(declarations)).toBe(EXPECTED_DECLARATIONS)
  })

  it('preserves RPC calls, runtime strings, and JSX host signatures', () => {
    const semantics = readMobileTasksSemanticSource()
    expect(semantics.split('\n')).toHaveLength(3_506)
    expect(hash(semantics)).toBe(EXPECTED_SEMANTICS)
  })

  it('preserves render expressions and event handlers in tree order', () => {
    const tokens = readFlattenedMobileTasksRenderTokens()
    expect(tokens).toHaveLength(35_195)
    expect(hash(tokens)).toBe(EXPECTED_RENDER_TREE)
  })

  it('preserves every StyleSheet property and value', () => {
    expect(hash(readMobileTasksStyleSource())).toBe(EXPECTED_STYLES)
  })
})

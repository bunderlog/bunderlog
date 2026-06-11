import { beforeEach, describe, expect, it, vi } from 'vitest'

const { appMock, createAppMock, createPiniaMock, mountMock, piniaPluginMock, routerMock, useMock } =
  vi.hoisted(() => {
    const use = vi.fn()
    const mount = vi.fn()

    const app = {
      use,
      mount,
    }

    use.mockReturnValue(app)

    const createApp = vi.fn(() => app)
    const piniaPlugin = { name: 'pinia-plugin' }
    const createPinia = vi.fn(() => piniaPlugin)
    const router = { name: 'router-plugin' }

    return {
      appMock: app,
      createAppMock: createApp,
      createPiniaMock: createPinia,
      mountMock: mount,
      piniaPluginMock: piniaPlugin,
      routerMock: router,
      useMock: use,
    }
  })

vi.mock('vue', () => ({
  createApp: createAppMock,
}))

vi.mock('pinia', () => ({
  createPinia: createPiniaMock,
}))

vi.mock('../src/App.vue', () => ({
  default: { name: 'App' },
}))

vi.mock('../src/composables/useTheme', () => ({
  useTheme: vi.fn(() => ({ initTheme: vi.fn(), toggleTheme: vi.fn(), isDark: { value: true } })),
}))

vi.mock('../src/router', () => ({
  default: routerMock,
}))

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    useMock.mockReturnValue(appMock)
  })

  it('creates the app and installs plugins before mounting', async () => {
    await import('../src/main')

    expect(createAppMock).toHaveBeenCalledTimes(1)
    expect(createPiniaMock).toHaveBeenCalledTimes(1)
    expect(useMock).toHaveBeenNthCalledWith(1, piniaPluginMock)
    expect(useMock).toHaveBeenNthCalledWith(2, routerMock)
    expect(mountMock).toHaveBeenCalledWith('#app')
  })
})

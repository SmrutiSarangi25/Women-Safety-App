import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroSection from '../HeroSection'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../Context/BrandingContext', () => ({
  useBranding: () => ({ brandData: { name: 'Raksha' } })
}))

vi.mock('../../../API/CustomApi', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { success: true } })
  }
}))

vi.mock('../../../API/Config', () => ({
  Config: {
    SOS_SEND_URL: '/api/sos/send'
  }
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const originalSpeechRecognition = globalThis.SpeechRecognition
const originalWebkitSpeechRecognition = globalThis.webkitSpeechRecognition
const originalMediaRecorder = globalThis.MediaRecorder
const originalCreateObjectURL = globalThis.URL.createObjectURL
const originalRevokeObjectURL = globalThis.URL.revokeObjectURL

const renderHero = () => {
  return render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>
  )
}

describe('HeroSection voice panel', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    globalThis.URL.createObjectURL = vi.fn(() => 'blob:voice-test')
    globalThis.URL.revokeObjectURL = vi.fn()

    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: undefined,
      configurable: true
    })

    globalThis.SpeechRecognition = undefined
    globalThis.webkitSpeechRecognition = undefined
    globalThis.MediaRecorder = undefined
  })

  afterAll(() => {
    globalThis.SpeechRecognition = originalSpeechRecognition
    globalThis.webkitSpeechRecognition = originalWebkitSpeechRecognition
    globalThis.MediaRecorder = originalMediaRecorder
    globalThis.URL.createObjectURL = originalCreateObjectURL
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('shows typed fallback error when voice APIs are unsupported', async () => {
    renderHero()

    fireEvent.click(screen.getByRole('button', { name: /start voice recording/i }))

    await waitFor(() => {
      expect(screen.getByText(/Voice capture is not supported in this browser/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/typed note fallback/i)).toBeInTheDocument()
  })

  it('captures transcript and audio through start/stop flow', async () => {
    class FakeSpeechRecognition {
      start() {
        setTimeout(() => {
          if (this.onresult) {
            this.onresult({
              results: [
                [
                  {
                    transcript: 'help me quickly'
                  }
                ]
              ]
            })
          }
        }, 0)
      }

      stop() {
        if (this.onend) {
          this.onend()
        }
      }
    }

    class FakeMediaRecorder {
      constructor() {
        this.state = 'inactive'
      }

      start() {
        this.state = 'recording'
      }

      stop() {
        this.state = 'inactive'
        if (this.ondataavailable) {
          this.ondataavailable({ data: new Blob(['audio-bytes'], { type: 'audio/webm' }) })
        }
        if (this.onstop) {
          this.onstop()
        }
      }
    }

    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }]
        })
      },
      configurable: true
    })

    globalThis.SpeechRecognition = FakeSpeechRecognition
    globalThis.MediaRecorder = FakeMediaRecorder

    const { container } = renderHero()

    fireEvent.click(screen.getByRole('button', { name: /start voice recording/i }))

    await waitFor(() => {
      expect(screen.getAllByText(/Listening... speak your note clearly/i).length).toBeGreaterThan(0)
    })

    fireEvent.click(screen.getByRole('button', { name: /stop voice recording/i }))

    await waitFor(() => {
      expect(screen.getAllByText(/Voice note captured successfully/i).length).toBeGreaterThan(0)
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/transcript/i)).toHaveValue('help me quickly')
    })

    expect(container.querySelector('audio')).toBeInTheDocument()
  })
})

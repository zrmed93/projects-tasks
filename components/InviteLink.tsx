'use client'

import { useState, useEffect } from 'react'

export default function InviteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)
  const [fullUrl, setFullUrl] = useState('')

  useEffect(() => {
    // Get the full URL on the client side
    const origin = window.location.origin
    setFullUrl(`${origin}/app/invite?token=${token}`)
  }, [token])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!fullUrl) return null

  return (
    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e5e5e5' }}>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: 500 }}>
        Invite Link:
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <code
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            minWidth: '200px',
          }}
        >
          {fullUrl}
        </code>
        <button
          onClick={handleCopy}
          style={{
            padding: '8px 16px',
            backgroundColor: copied ? '#28a745' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
        Share this link. The invited person can sign in with the email and accept the invite.
      </div>
    </div>
  )
}


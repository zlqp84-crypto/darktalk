'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#e94560', fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>다크톡 로그인</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '10px', background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ color: '#e94560', marginBottom: '16px' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#e94560', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? '처리 중...' : '로그인'}
          </button>
        </form>
        <p style={{ color: '#888', textAlign: 'center', marginTop: '16px' }}>
          계정이 없으신가요? <Link href="/signup" style={{ color: '#e94560' }}>회원가입</Link>
        </p>
      </div>
    </div>
  )
}

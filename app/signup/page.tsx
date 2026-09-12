'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isCompanyEmail } from '@/lib/companyEmail'

export default function SignupPage() {
  const router = useRouter()
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isCompanyEmail(email)) {
      setError('개인 이메일(Gmail, Naver, Daum 등)로는 가입할 수 없어요. 회사 이메일을 입력해주세요.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { company, nickname } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nickname,
        company,
      })
    }

    alert(`${email}로 인증 메일을 보냈어요. 메일의 링크를 클릭해 인증을 완료해주세요.`)
    router.push('/login')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#e94560', fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>다크톡 회원가입</h1>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>회사명</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="예: 다크톡"
              style={{ width: '100%', padding: '10px', background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>회사 이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              style={{ width: '100%', padding: '10px', background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
            <p style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>개인 이메일(Gmail, Naver, Daum 등)은 사용할 수 없어요. 재직 중인 회사 이메일로 인증해주세요.</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>
        <p style={{ color: '#888', textAlign: 'center', marginTop: '16px' }}>
          이미 계정이 있으신가요? <Link href="/login" style={{ color: '#e94560' }}>로그인</Link>
        </p>
      </div>
    </div>
  )
}

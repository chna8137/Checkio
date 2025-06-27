import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { ip } from '../../common/ip';

const Login = () => {
  const [form, setForm] = useState({ user_id: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${ip}/api/sawon/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        window.dispatchEvent(new Event('userChanged'));
        alert('로그인 성공');
        navigate('/');
      } else {
        alert(result.message || '로그인 실패');
      }
    } catch (error: any) {
      alert('서버 응답 실패: ' + error.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.h2}>로그인</h2>
      <input
        type="text"
        name="user_id"
        className={styles.input}
        placeholder="아이디"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        className={styles.input}
        placeholder="비밀번호"
        onChange={handleChange}
        required
      />
      <button type="submit" className={styles.button}>로그인</button>
    </form>
  );
};

export default Login;
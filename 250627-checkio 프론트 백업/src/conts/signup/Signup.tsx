import React, { useState } from 'react';
import styles from './signup.module.css';
import { ip } from '../../common/ip';
import { useNavigate } from 'react-router-dom';

interface FormState {
  username: string;
  password: string;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  email: string;
  emailCode: string;
  agree: boolean;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    name: '',
    phone: '',
    birth: '',
    gender: '',
    email: '',
    emailCode: '',
    agree: false,
  });
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateUsername = (username: string) =>
    /^[a-z0-9]{4,20}$/.test(username); // 소문자+숫자, 4~20자

  const validatePassword = (pw: string) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pw);

  const handleUsernameCheck = async () => {
    if (!form.username.trim()) {
      return alert('아이디를 입력해주세요.');
    }

    if (!validateUsername(form.username)) {
      return alert('아이디는 영어 소문자와 숫자만 포함해야 하며, 4~20자여야 합니다.');
    }

    try {
      const res = await fetch(`${ip}/api/sawon/check/${form.username}`);
      if (!res.ok) throw new Error('서버 응답 오류');

      const data = await res.json();
      if (data.available) {
        alert('사용 가능한 아이디입니다.');
      } else {
        alert('이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      console.error('중복확인 오류:', err);
      alert('아이디 중복확인 중 오류 발생');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.agree) {
      return alert('개인정보 수집 및 이용 동의를 해주세요.');
    }

    if (!validateUsername(form.username)) {
      return alert('아이디는 영어 소문자와 숫자만 포함해야 하며, 4~20자여야 합니다.');
    }

    if (!validatePassword(form.password)) {
      return alert(
        '비밀번호는 대문자 1개, 특수문자 1개 이상 포함하고 8자 이상이어야 합니다.'
      );
    }

    const payload = {
      user_id: form.username,
      password: form.password,
      user_name: form.name,
      phone_no: form.phone,
      email: form.email,
      gender: form.gender === 'M' ? '남성' : '여성',
      birthdate: form.birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
      reg_id: form.username,
    };

    try {
      const res = await fetch(`${ip}/api/sawon/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert('회원가입이 완료되었습니다.');
        navigate(-1);
      } else {
        alert('회원가입 실패: ' + result.message);
      }
    } catch (err) {
      alert('서버 오류: ' + (err as Error).message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.h2}>회원가입</h2>

      <div className={styles.field}>
        <label htmlFor="username">아이디</label>
        <div className={styles.row}>
          <input
            id="username"
            className={styles.input}
            name="username"
            value={form.username}
            onChange={handleChange}
            pattern="[a-z0-9]{4,20}"
            title="영문 소문자와 숫자만 사용 (4~20자)"
            required
          />
          </div>
          <div>
          <button
            type="button"
            className={styles.button}
            onClick={handleUsernameCheck}
            disabled={!form.username.trim()}
          >
            중복확인
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          className={styles.input}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="대문자, 특수문자 포함 8자 이상"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          className={styles.input}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">휴대폰번호</label>
        <input
          id="phone"
          className={styles.input}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
          pattern="\d{2,3}-\d{3,4}-\d{4}"
          title="010-1234-5678 형식으로 입력"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="birth">생년월일</label>
        <input
          id="birth"
          className={styles.input}
          name="birth"
          value={form.birth}
          onChange={handleChange}
          placeholder="YYYYMMDD"
          pattern="\d{8}"
          title="YYYYMMDD 형식으로 입력"
          required
        />
      </div>

      <fieldset className={styles.field}>
        <legend>성별</legend>
        <label>
          <input
            type="radio"
            name="gender"
            value="M"
            checked={form.gender === 'M'}
            onChange={handleChange}
            required
          /> 남
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="F"
            checked={form.gender === 'F'}
            onChange={handleChange}
          /> 여
        </label>
      </fieldset>

      <div className={styles.field}>
        <label>
          <input
            className={styles.input}
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            required
          /> 개인정보 수집 및 이용 동의 (필수)
        </label>
      </div>

      <button className={styles.button} type="submit">
        회원가입
      </button>
    </form>
  );
};

export default Signup;
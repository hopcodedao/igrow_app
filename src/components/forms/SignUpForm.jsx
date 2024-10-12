import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CheckBox, Form, TextInput } from '../';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert, useGAEventTracker } from '../../hooks';

function SignUpForm() {
  const gaEventTracker = useGAEventTracker('Auth');

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState('');
  const [loading, setLoading] = useState('');

  const [show, setShow] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    gaEventTracker({ action: 'Submit', label: 'Sign Up' });

    if (password !== confirmPassword) {
      useAlert('error', 'password-no-match');
      return;
    }

    try {
      setLoading(true);
      document.body.style.cursor = 'wait';
      await signUp(email, password, userName);
      document.body.style.cursor = 'default';
      useAlert('success', 'account-created');
      navigate('/');
    } catch (err) {
      setLoading(false);
      document.body.style.cursor = 'default';
      useAlert('error', err.code);
    }
  }

  return (
    <Form className="gap-4" onSubmit={handleSubmit}>
      <TextInput
        required
        icon="person"
        placeholder="Họ và tên"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextInput
        required
        icon="mail"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="flex h-[52px] w-full items-center rounded-md border border-black/30 bg-white p-2 outline-none dark:border-white/30 dark:bg-black/50">
        <input
          required
          className="ml-1 w-full rounded-lg border-none bg-transparent font-medium tracking-wide text-black outline-none dark:text-white lg:text-xl"
          placeholder="Password"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="material-symbols-outlined mx-1 flex cursor-pointer items-center justify-center text-black dark:text-white md:text-3xl"
          type="button"
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? 'visibility_off' : 'visibility'}
        </button>
      </div>

      <TextInput
        required
        icon="lock"
        placeholder="Nhập lại Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <CheckBox
        required
        className="mx-auto my-2 flex items-center justify-center text-sm font-medium tracking-wide text-black dark:text-white sm:text-base"
        text="Tôi đồng ý với các Chính sách &amp; Điều khoản"
        value={consent}
        onChange={(e) => setConsent(e.target.value)}
      />

      <button className="fill-button mt-2" disabled={loading} type="submit">
        Đăng ký
      </button>

      <div className="-mt-1 text-center text-sm font-medium tracking-wide text-black dark:text-slate-300 md:text-base">
        Bạn đã có tài khoản?{' '}
        <span className="inline-block">
          <Link to="/login">
            <span className="link-text">Đăng nhập</span>
          </Link>{' '}
          ngay.
        </span>
      </div>
    </Form>
  );
}

export default SignUpForm;

import { SignInWithGoogleButton, SignUpForm } from '../components';

function SignUp() {
  return (
    <div className="mx-auto flex min-h-screen w-[85%] animate-reveal flex-col items-center pb-10">
      <h1 className="page-heading">Tạo tài khoản</h1>

      <div className="card w-full max-w-xl">
        <SignUpForm />
      </div>
      <div className="mx-auto w-full max-w-xl">
        <SignInWithGoogleButton title="Google" />
      </div>
    </div>
  );
}

export default SignUp;

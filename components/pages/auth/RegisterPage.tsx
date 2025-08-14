'use client'
import { TRegisterResponse, TRegisterStatus } from '@/types/auth'
import { NextPage } from 'next'
import { useState } from 'react'
import RegisterForm from './RegisterForm'
import OtpForm from './OtpForm'

const RegisterPage: NextPage = () => {
  const [step, setStep] = useState<TRegisterStatus>('register');
  const [registerUser, setRegisterUser] =
    useState<TRegisterResponse | null>(null);
  return <>
    {step == 'register' && (
      <RegisterForm
        setStep={setStep}
        registerUser={registerUser}
        setRegisterUser={setRegisterUser}
      />
    )}
    {step == 'otp' && registerUser && (
      <OtpForm setStep={setStep} registerUser={registerUser} />
    )}
  </>
}

export default RegisterPage
'use client'
import { TRegisterResponse, TRegisterStatus } from '@/types/auth'
import { NextPage } from 'next'
import { useState } from 'react'
import RegisterForm from './RegisterForm'
import OtpForm from './OtpForm'

const RegisterPage: NextPage = () => {
  const [step, setStep] = useState<TRegisterStatus>('register');
  const [registerEmail, setRegisterEmail] =
    useState<string | null>(null);
  return <>
    {step == 'register' && (
      <RegisterForm
        setStep={setStep}
        registerEmail={registerEmail}
        setRegisterEmail={setRegisterEmail}
      />
    )}
    {step == 'otp' && registerEmail && (
      <OtpForm setStep={setStep} registerEmail={registerEmail} />
    )}
  </>
}

export default RegisterPage
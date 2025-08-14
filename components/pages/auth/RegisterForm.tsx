'use client'
import InputForm from '@/components/form/InputForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toastValidation } from '@/lib/action/clientHelper'
import { cn } from '@/lib/utils'
import { TRegisterResponse, TRegisterStatus } from '@/types/auth'
import { NextPage } from 'next'
import { Dispatch, SetStateAction } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner'
type TRegisterForm = {
  name: string,
  username: string,
  phonenumber: string,
  password: string
}
interface Props {
  setStep: Dispatch<SetStateAction<TRegisterStatus>>;
  setRegisterUser: Dispatch<SetStateAction<TRegisterResponse | null>>;
  registerUser: TRegisterResponse | null;
}
const RegisterForm: NextPage<Props> = ({ registerUser, setRegisterUser, setStep }) => {
  const methods = useForm<TRegisterForm>({
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: TRegisterForm) => {

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          phonenumber: data.phonenumber,
          password: data.password
        })
      })
      const status = response.status
      const responseBody = await response.json()
      console.log(responseBody)
      if (response.ok) {
        toast.success(
          '[DEV] Success! your OTP Code is: ' + responseBody.data?.otp,
        );
        setRegisterUser(responseBody.data?.user);
        setStep('otp');
        return;
      }
      toast.error(responseBody.message);
      toastValidation(responseBody.data)
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return <>
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to get started
        </p>
      </div>

      <div className="grid gap-4">
        <InputForm register={register} config={{
          name: 'name',
          title: 'Name',
          registerConfig: {
            required: 'cannot be empty',
          },
          type: 'text',
          placeholder: 'john doe',
          error: errors.name,
        }} />
        <InputForm register={register} config={{
          name: 'username',
          title: 'Username',
          registerConfig: {
            required: 'cannot be empty',
            pattern: {
              value: /^\S+$/,
              message: "username cannot contain spaces"
            }
          },
          type: 'text',
          placeholder: 'johndoe',
          error: errors.username,
        }} />
        <InputForm register={register} config={{
          name: 'phonenumber',
          title: 'Phone Number',
          registerConfig: {
            required: 'cannot be empty',
          },
          placeholder: '0812345678',
          type: 'text',
          error: errors.phonenumber,
        }} />
        <div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type='password'
              placeholder="********"
              className={cn(
                errors.password
                  ? 'border-red-500/50 hover:border-red-500 focus:border-red-500'
                  : 'focus:border-primary-50 border-[#B0B4C5]/50 hover:border-blue-50'
              )}
              {...register("password", {

                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-700 text-xs">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  </>
}

export default RegisterForm
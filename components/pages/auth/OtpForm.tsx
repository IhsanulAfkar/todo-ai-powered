
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { httpClient } from '@/lib/httpClient';
import { TRegisterResponse, TRegisterStatus } from '@/types/auth';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    setStep: Dispatch<SetStateAction<TRegisterStatus>>;
    registerUser: TRegisterResponse;
}
const OtpForm: NextPage<Props> = ({ setStep, registerUser }) => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    // const handleResend = async () => {
    //     const { data, status } = await httpClient.post('/resend-otp', {
    //         email: registerUser.email,
    //     });
    //     if (status === 200) {
    //         toast.success('[DEV] Success! your OTP Code is: ' + data.data.otp);
    //         return;
    //     }
    //     toast.error(data.message);
    // };
    const sendOtp = async () => {
        if (otp.length !== 6) {
            toast.error('OTP cannot be empty');
            return;
        }
        try {
            const response = await fetch('/api/auth/otp', {
                method: 'POST',
                body: JSON.stringify({
                    otp,
                    phonenumber: registerUser.phonenumber,
                })
            })
            const status = response.status
            if (status == 200) {
                toast.success('OTP verified successfully');
                router.push('/auth/login');
                return;
            }
            const responseData = await response.json()
            toast.error(responseData.message);
            return;
        } catch (error: any) {
            toast.error('Server Error');
        }
    };
    return (
        <div className='flex flex-col items-center gap-2 text-center'>
            <p className="text-2xl font-bold">
                Verification Code
            </p>
            <p className="text-muted-foreground text-sm text-balance">
                Please enter the code we sent to your email address
            </p>
            <div className="my-6 flex flex-col space-y-2">
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    className="w-full"
                >
                    <InputOTPGroup className="flex w-full justify-evenly gap-1">
                        <InputOTPSlot index={0} className="h-14 w-14" />
                        <InputOTPSlot index={1} className="h-14 w-14" />
                        <InputOTPSlot index={2} className="h-14 w-14" />
                        <InputOTPSlot index={3} className="h-14 w-14" />
                        <InputOTPSlot index={4} className="h-14 w-14" />
                        <InputOTPSlot index={5} className="h-14 w-14" />
                    </InputOTPGroup>
                </InputOTP>
                <p className='text-muted-foreground text-sm text-balance'>
                    <span>Didn't receive code?</span>
                    <span
                        className="text-primary-main cursor-pointer font-semibold"
                        onClick={() => toast.error('On Progress')}
                    >
                        Resend
                    </span>

                </p>
            </div>
            <Button
                onClick={sendOtp}
                className="w-full"
            >
                Confirm
            </Button>
        </div>
    );
};

export default OtpForm;

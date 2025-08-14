export type TRegisterForm = {
    id: number;
    name: string;
    phonenumber: string;
    email: string;
}
export type TRegisterResponse = {
    id: number,
    name: string,
    username: string,
    phonenumber: string,
};

export type TRegisterStatus = 'register' | 'otp'

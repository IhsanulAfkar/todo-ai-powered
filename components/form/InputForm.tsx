import { NextPage } from 'next';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface Props {
  register: UseFormRegister<any>;
  config: {
    title?: string;
    name: string;
    type: React.HTMLInputTypeAttribute;
    placeholder?: string;
    error?: FieldError;
    registerConfig: RegisterOptions;
  };
  className?: string;
}

const InputForm: NextPage<Props> = ({ config, register, className }) => {
  return (
    <div className="">
      <div className="grid gap-1">
        {config.title && <Label htmlFor={config.name}>{config.title}</Label>}
        <Input
          type={config.type}
          placeholder={config.placeholder}
          className={cn(
            config.error
              ? 'border-red-500/50 hover:border-red-500 focus:border-red-500'
              : 'focus:border-primary-50 border-[#B0B4C5]/50 hover:border-blue-50',
            className,
          )}
          {...register(config.name, config.registerConfig)}
        />
      </div>
      {config.error && (
        <p className="text-xs text-red-700">{config.error.message}</p>
      )}
    </div>
  );
};

export default InputForm;

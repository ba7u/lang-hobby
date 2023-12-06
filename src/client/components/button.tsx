import classNames from 'classnames';

export type ButtonSize = 'regular' | 'small' | 'strong';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface Props {
    label: string;
    variant: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    className?: string;
    disabled?: boolean;
}

export const Button = ({ type, size = 'regular', label, disabled, variant, onClick, className }: Props) => (
    <button
        type={type}
        className={classNames(className, 'flex justify-center items-center space-x-xs disabled:cursor-not-allowed', {
            'btn-primary': variant === 'primary',
            'btn-secondary': variant === 'secondary' && size === 'regular',
            'btn-secondary-small': variant === 'secondary' && size === 'small',
            'btn-tertiary': variant === 'tertiary' && size === 'regular',
            'btn-tertiary-small': variant === 'tertiary' && size === 'small',
            'btn-tertiary-strong': variant === 'tertiary' && size === 'strong',
        })}
        onClick={onClick}
        disabled={disabled}
    >
        <span>{label}</span>
    </button>
);

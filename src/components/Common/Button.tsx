import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', onClick }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none';
    const variantStyles = classNames({
        'bg-primary text-white hover:bg-primary-dark': variant === 'primary',
        'bg-secondary text-white hover:bg-secondary-dark': variant === 'secondary',
        'bg-success text-white hover:bg-success-dark': variant === 'success',
        'bg-warning text-white hover:bg-warning-dark': variant === 'warning',
        'bg-danger text-white hover:bg-danger-dark': variant === 'danger',
    });
    const sizeStyles = classNames({
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
    });

    return (
        <button className={`${baseStyles} ${variantStyles} ${sizeStyles}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;

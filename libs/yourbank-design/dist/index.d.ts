import * as React from 'react';
import { ReactNode } from 'react';
export declare const ThemeToggle: React.FC;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}
export declare const Button: React.FC<ButtonProps>;
interface ContainerProps {
    useCardStyle?: boolean;
    children: React.ReactNode;
}
export declare const Container: React.FC<ContainerProps>;
interface TableProps {
    data: any[];
    columns: {
        key: string;
        title: string;
    }[];
}
export declare const Table: React.FC<TableProps>;
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    headerIcon?: JSX.Element;
    headerTitle?: string;
    footer?: JSX.Element | string;
    underHeaderIcon?: JSX.Element;
}
export declare const Card: React.FC<CardProps>;
interface IconProps {
    icon: 'building' | 'dollar' | 'exclamation' | 'question' | 'logo';
    color?: 'red' | 'white';
    className?: string;
    style?: React.CSSProperties;
}
export declare const Icon: React.FC<IconProps>;
interface LogoProps {
    className?: string;
    style?: React.CSSProperties;
}
export declare const LogoComponent: React.FC<LogoProps>;
interface GlobalState {
    theme: 'light' | 'dark';
}
interface GlobalContextType extends GlobalState {
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}
export declare const GlobalContext: React.Context<GlobalContextType>;
interface GlobalProviderProps {
    children: ReactNode;
}
export declare const GlobalProvider: React.FC<GlobalProviderProps>;
export {};

import * as React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}
export declare const Button: React.FC<ButtonProps>;
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    hasBackground?: boolean;
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
}
export declare const Card: React.FC<CardProps>;
export {};

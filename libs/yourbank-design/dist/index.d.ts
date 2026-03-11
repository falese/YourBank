import * as React from 'react';

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}
declare const Header: React.FC<HeaderProps>;
export default Header;

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}
export declare const Button: React.FC<ButtonProps>;

// ─── Container ────────────────────────────────────────────────────────────────

interface ContainerProps {
  useCardStyle?: boolean;
  children: React.ReactNode;
}
export declare const Container: React.FC<ContainerProps>;

// ─── Table ────────────────────────────────────────────────────────────────────

interface TableProps {
  data: any[];
  columns: { key: string; title: string }[];
}
export declare const Table: React.FC<TableProps>;

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  headerIcon?: JSX.Element;
  headerTitle?: string;
  footer?: JSX.Element | string;
  underHeaderIcon?: JSX.Element;
}
export declare const Card: React.FC<CardProps>;

// ─── Icon ─────────────────────────────────────────────────────────────────────

interface IconProps {
  icon: 'building' | 'dollar' | 'exclamation' | 'question' | 'logo';
  color?: 'red' | 'white';
  className?: string;
  style?: React.CSSProperties;
}
export declare const Icon: React.FC<IconProps>;

// ─── LogoComponent ────────────────────────────────────────────────────────────

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}
export declare const LogoComponent: React.FC<LogoProps>;

// ─── Form components ──────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  'data-field-id'?: string;
}
export declare const Input: React.FC<InputProps>;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  'data-field-id'?: string;
  children: React.ReactNode;
}
export declare const Select: React.FC<SelectProps>;

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}
export declare const Label: React.FC<LabelProps>;

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}
export declare const FormGroup: React.FC<FormGroupProps>;

// ─── Tracking ─────────────────────────────────────────────────────────────────

export type BlockedFieldCategory = 'sensitive_pii' | 'credential' | 'financial' | 'custom';

export interface BlockedField {
  selector: string;
  reason: string;
  category: BlockedFieldCategory;
}

export interface FieldDefinition {
  selector: string;
  meta: Record<string, string | number | boolean>;
  events?: Array<'input' | 'change' | 'focus' | 'blur' | 'click' | 'submit'>;
}

export interface TrackingSchema {
  version: string;
  description?: string;
  blockedFields: BlockedField[];
  eventPrefix: string;
  fieldMap?: FieldDefinition[];
}

export interface TrackingEventDetail {
  eventType: string;
  fieldId?: string;
  fieldType?: string;
  pageName?: string;
  timestamp: string;
  elementTag?: string;
  elementText?: string;
  componentType?: string;
  meta?: Record<string, string | number | boolean>;
}

export declare class TrackingObserver {
  constructor(schema: TrackingSchema);
  setPage(pageName: string): void;
  start(): void;
  stop(): void;
}

import * as React from 'react'
import styles from './styles.module.css'

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const className = `${styles.button} ${
    variant === 'primary' ? styles.primary : styles.secondary
  }`
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  hasBackground?: boolean
}

export const Container: React.FC<ContainerProps> = ({
  hasBackground,
  children,
  ...props
}) => {
  const className = `${styles.container} ${
    hasBackground ? styles.background : ''
  }`
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

// Table

interface TableProps {
  data: any[] // Replace 'any' with your data type
  columns: { key: string; title: string }[]
}

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={`${index}_${column.key}`}>{item[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <div className={styles.card} {...props}>
      {children}
    </div>
  )
}

import React from 'react'
import { Container, Card, Button, Icon } from 'yourbank-design'
import { ApplicationFormData } from './ApplicationPage'

interface ConfirmationPageProps {
  formData: ApplicationFormData
  onBack: () => void
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ formData, onBack }) => {
  const referenceNumber = `YB-${Date.now().toString(36).toUpperCase()}`

  return (
    <Container>
      <Card
        headerTitle='Application Submitted'
        headerIcon={
          <Icon icon='dollar' color='red' style={{ width: 40, height: 40 }} />
        }
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 36
            }}
          >
            ✓
          </div>
          <h3 style={{ color: '#2e7d32', margin: '0 0 8px' }}>
            Thank you, {formData.firstName}!
          </h3>
          <p style={{ color: '#666', margin: '0 0 24px' }}>
            Your loan application has been received and is under review.
          </p>
          <div
            style={{
              background: '#f7f7f7',
              border: '1px solid #e0e0e0',
              borderRadius: 6,
              padding: '16px 24px',
              display: 'inline-block',
              marginBottom: 32
            }}
          >
            <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>
              Reference Number
            </span>
            <br />
            <strong style={{ fontSize: 20, letterSpacing: 2 }}>{referenceNumber}</strong>
          </div>
        </div>

        {/* Summary — blocked fields are intentionally omitted */}
        <div
          style={{
            background: '#fafafa',
            border: '1px solid #e8e8e8',
            borderRadius: 6,
            padding: '20px 24px',
            textAlign: 'left',
            marginBottom: 24
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#c0392b',
              textTransform: 'uppercase',
              fontSize: 12,
              letterSpacing: '0.5px',
              marginBottom: 16
            }}
          >
            Application Summary
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Name', `${formData.firstName} ${formData.lastName}`],
                ['Email', formData.email],
                ['Phone', formData.phone || '—'],
                ['Loan Amount', formData.loanAmount ? `$${Number(formData.loanAmount).toLocaleString()}` : '—'],
                ['Loan Purpose', formData.loanPurpose || '—'],
                ['Monthly Income', formData.monthlyIncome ? `$${Number(formData.monthlyIncome).toLocaleString()}` : '—']
              ].map(([label, value]) => (
                <tr key={label}>
                  <td
                    style={{
                      padding: '6px 0',
                      color: '#888',
                      fontSize: 13,
                      width: '40%',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: '6px 0',
                      color: '#333',
                      fontWeight: 500,
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            style={{
              fontSize: 12,
              color: '#999',
              marginTop: 12,
              marginBottom: 0
            }}
          >
            <span role="img" aria-label="lock">🔒</span> Protected fields (SSN, Date of Birth, Account Number) are not
            displayed for security.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button variant='primary' onClick={onBack}>
            Back to Home
          </Button>
        </div>
      </Card>
    </Container>
  )
}

export default ConfirmationPage

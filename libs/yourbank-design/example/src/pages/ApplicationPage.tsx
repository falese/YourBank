import React, { useState } from 'react'
import { Container, Card, Button, Input, Select, Label, FormGroup } from 'yourbank-design'

export interface ApplicationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string          // blocked in schema
  ssn: string          // blocked in schema
  loanAmount: string
  loanPurpose: string
  monthlyIncome: string
  accountNumber: string // blocked in schema
}

interface ApplicationPageProps {
  onSubmit: (data: ApplicationFormData) => void
  onBack: () => void
}

const INITIAL: ApplicationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  ssn: '',
  loanAmount: '',
  loanPurpose: '',
  monthlyIncome: '',
  accountNumber: ''
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({ onSubmit, onBack }) => {
  const [form, setForm] = useState<ApplicationFormData>(INITIAL)

  const update =
    (field: keyof ApplicationFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Container>
      <Card headerTitle='Loan Application'>
        <p style={{ color: '#666', marginBottom: 24, textAlign: 'left' }}>
          Fields marked with a lock icon (
          <span role='img' aria-label='lock'>
            🔒
          </span>
          ) are <strong>protected fields</strong>: the Adobe Web SDK tracking
          observer will suppress all events on these inputs. No changes to this
          form were needed — the{' '}
          <code style={{ background: '#f0f0f0', padding: '1px 4px', borderRadius: 3 }}>
            data-field-id
          </code>{' '}
          attribute on each input is all the schema needs to identify them.
        </p>

        <form
          id='loan-application'
          data-form-id='loan-application'
          onSubmit={handleSubmit}
          style={{ textAlign: 'left' }}
        >
          {/* ── Personal Information ── */}
          <div className='form-section'>
            <p
              style={{
                fontWeight: 700,
                color: '#c0392b',
                textTransform: 'uppercase',
                fontSize: 13,
                letterSpacing: '0.5px',
                borderBottom: '2px solid #e8e8e8',
                paddingBottom: 8,
                marginBottom: 20
              }}
            >
              Personal Information
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <FormGroup>
                <Label htmlFor='first-name' required>
                  First Name
                </Label>
                {/* data-field-id="first-name" → TRACKED */}
                <Input
                  id='first-name'
                  data-field-id='first-name'
                  type='text'
                  autoComplete='given-name'
                  value={form.firstName}
                  onChange={update('firstName')}
                  placeholder='Jane'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='last-name' required>
                  Last Name
                </Label>
                {/* data-field-id="last-name" → TRACKED */}
                <Input
                  id='last-name'
                  data-field-id='last-name'
                  type='text'
                  autoComplete='family-name'
                  value={form.lastName}
                  onChange={update('lastName')}
                  placeholder='Smith'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='email' required>
                  Email
                </Label>
                {/* data-field-id="email" → TRACKED */}
                <Input
                  id='email'
                  data-field-id='email'
                  type='email'
                  autoComplete='email'
                  value={form.email}
                  onChange={update('email')}
                  placeholder='jane@example.com'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='phone'>Phone</Label>
                {/* data-field-id="phone" → TRACKED */}
                <Input
                  id='phone'
                  data-field-id='phone'
                  type='tel'
                  autoComplete='tel'
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder='(555) 000-0000'
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='dob' required>
                  Date of Birth{' '}
                  <span role='img' aria-label='protected field'>
                    🔒
                  </span>
                </Label>
                {/* data-field-id="dob" → BLOCKED: sensitive_pii
                    The TrackingObserver stamps this element with
                    data-tracking-blocked="true" — no code change required here. */}
                <Input
                  id='dob'
                  data-field-id='dob'
                  type='date'
                  autoComplete='bday'
                  value={form.dob}
                  onChange={update('dob')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='ssn' required>
                  Social Security Number{' '}
                  <span role='img' aria-label='protected field'>
                    🔒
                  </span>
                </Label>
                {/* data-field-id="ssn" → BLOCKED: sensitive_pii */}
                <Input
                  id='ssn'
                  data-field-id='ssn'
                  type='password'
                  autoComplete='off'
                  value={form.ssn}
                  onChange={update('ssn')}
                  placeholder='XXX-XX-XXXX'
                  required
                />
              </FormGroup>
            </div>
          </div>

          {/* ── Loan Details ── */}
          <div className='form-section' style={{ marginTop: 32 }}>
            <p
              style={{
                fontWeight: 700,
                color: '#c0392b',
                textTransform: 'uppercase',
                fontSize: 13,
                letterSpacing: '0.5px',
                borderBottom: '2px solid #e8e8e8',
                paddingBottom: 8,
                marginBottom: 20
              }}
            >
              Loan Details
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <FormGroup>
                <Label htmlFor='loan-amount' required>
                  Requested Amount ($)
                </Label>
                {/* data-field-id="loan-amount" → TRACKED */}
                <Input
                  id='loan-amount'
                  data-field-id='loan-amount'
                  type='number'
                  min='1000'
                  max='100000'
                  step='500'
                  value={form.loanAmount}
                  onChange={update('loanAmount')}
                  placeholder='25000'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='loan-purpose' required>
                  Loan Purpose
                </Label>
                {/* data-field-id="loan-purpose" → TRACKED */}
                <Select
                  id='loan-purpose'
                  data-field-id='loan-purpose'
                  value={form.loanPurpose}
                  onChange={update('loanPurpose')}
                  required
                >
                  <option value=''>Select a purpose…</option>
                  <option value='home-improvement'>Home Improvement</option>
                  <option value='debt-consolidation'>Debt Consolidation</option>
                  <option value='auto'>Auto Purchase</option>
                  <option value='education'>Education</option>
                  <option value='business'>Small Business</option>
                  <option value='other'>Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor='monthly-income' required>
                  Monthly Gross Income ($)
                </Label>
                {/* data-field-id="monthly-income" → TRACKED */}
                <Input
                  id='monthly-income'
                  data-field-id='monthly-income'
                  type='number'
                  min='0'
                  value={form.monthlyIncome}
                  onChange={update('monthlyIncome')}
                  placeholder='5000'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='account-number' required>
                  YourBank Account Number{' '}
                  <span role='img' aria-label='protected field'>
                    🔒
                  </span>
                </Label>
                {/* data-field-id="account-number" → BLOCKED: financial */}
                <Input
                  id='account-number'
                  data-field-id='account-number'
                  type='password'
                  autoComplete='off'
                  value={form.accountNumber}
                  onChange={update('accountNumber')}
                  placeholder='Account number'
                  required
                />
              </FormGroup>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 32,
              gap: 16
            }}
          >
            <Button type='button' variant='secondary' onClick={onBack}>
              Back
            </Button>
            <Button type='submit' variant='primary'>
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  )
}

export default ApplicationPage

import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

export function EmailTemplate({ firstName, otp }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0', fontSize: '24px' }}>EduStack</h1>
        <p style={{ color: '#666', margin: '10px 0 0 0' }}>Your Learning Platform</p>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: '0 0 20px 0', fontSize: '20px' }}>
          Welcome, {firstName}!
        </h2>
        
        <p style={{ color: '#555', margin: '0 0 20px 0', lineHeight: '1.6' }}>
          Thank you for signing up with EduStack. To complete your registration, please use the verification code below:
        </p>
        
        <div style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '6px', 
          textAlign: 'center',
          margin: '20px 0',
          fontSize: '24px',
          fontWeight: 'bold',
          letterSpacing: '3px'
        }}>
          {otp}
        </div>
        
        <p style={{ color: '#666', margin: '20px 0 0 0', fontSize: '14px' }}>
          This code will expire in 10 minutes for security reasons.
        </p>
      </div>
      
      <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
        <p style={{ margin: '0' }}>
          If you didn't request this code, please ignore this email.
        </p>
        <p style={{ margin: '10px 0 0 0' }}>
          Best regards,<br />
          The EduStack Team
        </p>
      </div>
    </div>
  );
}
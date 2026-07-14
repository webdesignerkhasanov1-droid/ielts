import React from 'react';
import { Download } from 'lucide-react';
import { AmericanSchoolLogo } from './AmericanSchoolLogo';

interface TRFCertificateProps {
  lang: 'UZ' | 'EN';
  candidateInfo: {
    fullName: string;
    phone: string;
    telegram: string;
  };
  scores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  };
}

export const TRFCertificate: React.FC<TRFCertificateProps> = ({ lang, candidateInfo, scores }) => {
  
  // Format current date
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  
  // Generate random candidate number
  const candidateNumber = "EL" + Math.floor(100000 + Math.random() * 900000);
  
  // Generate unique Report ID
  const generateReportID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CMM';
    for (let i = 0; i < 21; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  const reportID = generateReportID();

  // Determine CEFR level based on overall score
  const getCEFRLevel = (band: number) => {
    if (band >= 8.5) return 'C2';
    if (band >= 7.0) return 'C1';
    if (band >= 5.5) return 'B2';
    if (band >= 4.0) return 'B1';
    return 'A2';
  };
  const cefrLevel = getCEFRLevel(scores.overall);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      
      {/* Action Buttons (Hidden on Print) */}
      <div className="no-print" style={{ display: 'flex', gap: '14px', margin: '10px 0' }}>
        <button 
          onClick={handlePrint}
          className="btn-primary"
          style={{ background: 'hsl(var(--accent-red))', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={16} />
          {lang === 'UZ' ? "Sertifikatni PDF yuklash / Chop etish" : "Download PDF / Print Certificate"}
        </button>
      </div>

      {/* Main TRF Certificate Form */}
      <div className="trf-container printable-area">
        {/* Repeating Watermark background */}
        <div className="trf-watermark" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          zIndex: 1,
          backgroundImage: 'radial-gradient(#e11d48 0.5px, transparent 0.5px), radial-gradient(#e11d48 0.5px, #ffffff 0.5px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Header block */}
          <div className="trf-header">
            {/* IELTS Mockup Logo */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Arial Black, sans-serif', color: '#e11d48', letterSpacing: '-0.05em' }}>
                IELTS
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', paddingBottom: '6px' }}>
                Test Report Form
              </span>
            </div>

            <div className="trf-title">
              MOCK TEST REPORT FORM
              <div style={{ fontSize: '0.6rem', color: '#dc2626', fontWeight: 800, marginTop: '2px', letterSpacing: '0.1em' }}>
                THIS DOCUMENT IS NOT OFFICIAL.
              </div>
            </div>

            {/* Custom Moydionov Mock logo on the right (matching red logo in user screenshot) */}
            <div style={{
              background: '#e11d48',
              width: '45px',
              height: '45px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(225,29,72,0.3)'
            }}>
              <AmericanSchoolLogo size={28} showText={false} />
            </div>
          </div>

          {/* Candidate Details Panel */}
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
            Candidate Details
          </h4>

          {/* Two-Column details table */}
          <table className="trf-table" style={{ margin: '0 0 20px 0', border: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 'bold', width: '25%' }}>Centre Number</td>
                <td style={{ width: '25%' }}>EL012</td>
                <td style={{ textAlign: 'left', fontWeight: 'bold', width: '25%' }}>Date</td>
                <td style={{ width: '25%' }}>{formattedDate}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Candidate Number</td>
                <td colSpan={3} style={{ textAlign: 'left', letterSpacing: '0.05em' }}>{candidateNumber}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Full Name</td>
                <td colSpan={3} style={{ textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  {candidateInfo.fullName}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Test Results Table */}
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
            Test Results
          </h4>

          <table className="trf-table" style={{ margin: '0 0 20px 0', border: '1px solid #000' }}>
            <thead>
              <tr>
                <th>Listening</th>
                <th>Reading</th>
                <th>Writing</th>
                <th>Speaking</th>
                <th>Overall Band Score</th>
                <th>CEFR Level</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                <td>{scores.listening.toFixed(1)}</td>
                <td>{scores.reading.toFixed(1)}</td>
                <td>{scores.writing.toFixed(1)}</td>
                <td>{scores.speaking.toFixed(1)}</td>
                <td style={{ backgroundColor: '#f8fafc', color: '#e11d48', fontSize: '1.25rem', border: '2px solid #000' }}>
                  {scores.overall.toFixed(1)}
                </td>
                <td style={{ backgroundColor: '#f1f5f9' }}>{cefrLevel}</td>
              </tr>
            </tbody>
          </table>

          {/* Additional validation Details */}
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
            Additional Details
          </h4>

          <table className="trf-table" style={{ margin: '0 0 30px 0', border: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 'bold', width: '25%' }}>Date</td>
                <td style={{ width: '25%' }}>{formattedDate}</td>
                <td style={{ textAlign: 'left', fontWeight: 'bold', width: '25%' }}>Report ID</td>
                <td style={{ width: '25%', fontFamily: 'monospace', fontSize: '0.7rem' }}>{reportID}</td>
              </tr>
            </tbody>
          </table>

          {/* Verification stamp area and footer signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
              Designed by American Mock Testing Engine. Verified by American Mock Testing Team.
            </div>
            
            {/* Stamp simulation */}
            <div style={{
              border: '2px dashed #e11d48',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e11d48',
              fontSize: '0.5rem',
              fontWeight: 800,
              transform: 'rotate(-10deg)',
              opacity: 0.85
            }}>
              <span>MOCKY IELTS</span>
              <span>VERIFIED</span>
              <span>EL012</span>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#94a3b8', marginTop: '30px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            © 2026 mocky. American Mock Testing Center. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
export default TRFCertificate;

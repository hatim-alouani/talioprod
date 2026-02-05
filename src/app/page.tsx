'use client';

import Link from "next/link";
import { TalioTheme } from "@/config/talio-theme";

export default function App() {
  return (
    <div className="size-full min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: TalioTheme.colors.background }}>
      <div style={{ maxWidth: '600px', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 600, 
          marginBottom: '16px',
          color: TalioTheme.colors.primary 
        }}>
          Formulaires Check-in J+14
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: TalioTheme.colors.textMuted,
          marginBottom: '48px' 
        }}>
          Sélectionnez le formulaire que vous souhaitez remplir
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link href="/j14entreprise">
            <div style={{
              padding: '24px 32px',
              backgroundColor: TalioTheme.colors.cardBackground,
              border: `2px solid ${TalioTheme.colors.border}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TalioTheme.colors.primary;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = TalioTheme.colors.border;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏢</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', color: TalioTheme.colors.textPrimary }}>
                Formulaire Entreprise
              </h2>
              <p style={{ color: TalioTheme.colors.textMuted }}>
                Pour les Account Managers suivant une entreprise
              </p>
            </div>
          </Link>

          <Link href="/j14talent">
            <div style={{
              padding: '24px 32px',
              backgroundColor: TalioTheme.colors.cardBackground,
              border: `2px solid ${TalioTheme.colors.border}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TalioTheme.colors.primary;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = TalioTheme.colors.border;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👤</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', color: TalioTheme.colors.textPrimary }}>
                Formulaire Talent
              </h2>
              <p style={{ color: TalioTheme.colors.textMuted }}>
                Pour les Account Managers suivant un talent
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

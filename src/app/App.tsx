import { useState } from "react";
import { CheckInForm } from "@/app/components/checkin-form";
import { CheckInFormTalent } from "@/app/components/checkin-form-talent";
import { TalioTheme } from "@/config/talio-theme";

export default function App() {
  const [activeForm, setActiveForm] = useState<"entreprise" | "talent">("entreprise");

  return (
    <div className="size-full">
      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: TalioTheme.colors.cardBackground,
        borderBottom: `2px solid ${TalioTheme.colors.border}`,
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveForm("entreprise")}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeForm === "entreprise" 
                ? `3px solid ${TalioTheme.colors.primary}` 
                : '3px solid transparent',
              color: activeForm === "entreprise" 
                ? TalioTheme.colors.primary 
                : TalioTheme.colors.textMuted,
              fontWeight: activeForm === "entreprise" ? 600 : 400,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            🏢 Formulaire Entreprise
          </button>
          <button
            onClick={() => setActiveForm("talent")}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeForm === "talent" 
                ? `3px solid ${TalioTheme.colors.primary}` 
                : '3px solid transparent',
              color: activeForm === "talent" 
                ? TalioTheme.colors.primary 
                : TalioTheme.colors.textMuted,
              fontWeight: activeForm === "talent" ? 600 : 400,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            👤 Formulaire Talent
          </button>
        </div>
      </div>

      {/* Form Content */}
      {activeForm === "entreprise" ? <CheckInForm /> : <CheckInFormTalent />}
    </div>
  );
}
import { TalioTheme } from "@/config/talio-theme";

/**
 * Styles réutilisables pour le formulaire Check-in
 * Basés sur la charte graphique Talio
 */

export const CheckInFormStyles = {
  // Titre principal (h1)
  mainTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: TalioTheme.colors.gray900,
    letterSpacing: '-0.02em',
    margin: 0
  },

  // Titres de sections
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: TalioTheme.colors.gray900,
    borderBottom: `2px solid ${TalioTheme.colors.primary}`,
    paddingBottom: '12px'
  },

  // Labels de questions
  questionLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: TalioTheme.colors.gray900,
    margin: 0
  },

  // Cartes/sections blanches
  card: {
    backgroundColor: TalioTheme.colors.cardBackground,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${TalioTheme.colors.border}`,
    borderRadius: '8px',
    padding: '16px'
  },

  // Card avec alerte
  cardWarning: {
    backgroundColor: TalioTheme.colors.cardBackground,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
    border: `2px solid ${TalioTheme.colors.warning}`,
    borderLeft: `4px solid ${TalioTheme.colors.warning}`,
    borderRadius: '8px',
    padding: '16px'
  },

  cardCritical: {
    backgroundColor: TalioTheme.colors.cardBackground,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
    border: `2px solid ${TalioTheme.colors.error}`,
    borderLeft: `4px solid ${TalioTheme.colors.error}`,
    borderRadius: '8px',
    padding: '16px'
  },

  // Bouton radio
  radioButton: `border-[${TalioTheme.colors.primary}] text-[${TalioTheme.colors.primary}]`,

  // Bouton primaire
  primaryButton: {
    backgroundColor: TalioTheme.colors.primary,
    color: '#FFFFFF',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Bouton secondaire
  secondaryButton: {
    backgroundColor: 'transparent',
    color: TalioTheme.colors.textMuted,
    border: `1px solid ${TalioTheme.colors.border}`,
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Zone de texte
  textarea: {
    border: `1px solid ${TalioTheme.colors.gray300}`,
    borderRadius: '8px',
    padding: '8px',
    fontSize: '14px',
    color: TalioTheme.colors.textSecondary,
    backgroundColor: TalioTheme.colors.cardBackground
  },

  // Alert boxes
  alertWarning: {
    backgroundColor: TalioTheme.colors.warningLight,
    border: `1px solid ${TalioTheme.colors.warningBorder}`,
    borderRadius: '8px',
    padding: '16px'
  },

  alertCritical: {
    backgroundColor: TalioTheme.colors.errorLight,
    border: `2px solid ${TalioTheme.colors.error}`,
    borderRadius: '8px',
    padding: '16px'
  },

  alertSuccess: {
    backgroundColor: TalioTheme.colors.successLight,
    border: `1px solid ${TalioTheme.colors.success}`,
    borderRadius: '8px',
    padding: '16px'
  },

  alertInfo: {
    backgroundColor: TalioTheme.colors.primaryLight,
    border: `1px solid ${TalioTheme.colors.primaryBorder}`,
    borderRadius: '8px',
    padding: '16px'
  }
};

export default CheckInFormStyles;
/**
 * Charte graphique Talio
 * Couleurs et styles cohérents pour toute l'application
 */

export const TalioTheme = {
  colors: {
    // Couleur primaire - Indigo moderne
    primary: '#6366F1',
    primaryLight: '#EEF2FF',
    primaryDark: '#4F46E5',
    primaryBorder: '#C7D2FE',
    
    // Couleurs de succès
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#059669',
    
    // Couleurs d'alerte
    warning: '#F59E0B',
    warningLight: '#FFF3CD',
    warningBorder: '#FFE69C',
    
    // Couleurs d'erreur
    error: '#EF4444',
    errorLight: '#FFCCCC',
    errorDark: '#DC2626',
    
    // Couleurs neutres
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Couleurs spécifiques
    background: '#FAFAFA',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    border: '#E5E7EB',
  },
  
  // Scores et états
  status: {
    critical: '#EF4444',      // Rouge pour scores ≤2
    warning: '#F59E0B',       // Orange pour score = 3
    good: '#10B981',          // Vert pour scores ≥4
  },
  
  // Emojis pour les scores
  scoreEmojis: {
    critical: '🔴',
    warning: '🟠',
    good: '🟢',
  }
};

export default TalioTheme;

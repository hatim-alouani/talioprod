'use client';

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Copy, Check, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  entrepriseName: string;
  formLink: string;
}

export function EmailTemplateModal({ isOpen, onClose, talentName, entrepriseName, formLink }: EmailTemplateModalProps) {
  const [copied, setCopied] = useState(false);

  const emailTemplate = `Objet : Check-in J+14 – Expérience internationale avec ${talentName} 🎯

Bonjour,

J'espère que tout se passe bien de votre côté !

Nous sommes maintenant à J+14 de l'expérience internationale avec ${talentName}, et c'est le moment idéal pour faire un point rapide sur le démarrage. Ce check-in nous permet de :

✅ Sécuriser la collaboration dès les premières semaines
✅ Identifier rapidement tout point à ajuster
✅ Garantir la réussite de votre expérience internationale ensemble

📋 **Le formulaire prend 2 minutes à compléter** et nous permet d'intervenir immédiatement si besoin.

👉 **Accéder au formulaire :** ${formLink}

Quelques questions simples sur :
• Le démarrage et l'intégration
• Les accès et outils
• La clarté du brief et des priorités
• La collaboration avec ${talentName}
• L'engagement et la première livraison

💡 **Pourquoi c'est important ?**
Ce retour nous permet d'ajuster rapidement si nécessaire et de vous garantir le meilleur ROI sur cette collaboration. Mehdi suit personnellement chaque expérience internationale et peut débloquer toute situation en 24-48h.

**Vos réponses restent confidentielles** et nous permettent d'améliorer continuellement l'expérience pour vous et ${talentName}.

Merci pour votre confiance et à très vite pour échanger sur vos retours ! 🚀

Bien cordialement,

L'équipe Talio
csm@taliotalent.com
www.taliotalent.com

---

P.S. : En cas de question ou si vous préférez échanger de vive voix, n'hésitez pas à réserver un créneau avec Mehdi : https://calendly.com/alouanihatim01/30min`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-auto"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            margin: '20px'
          }}
        >
          {/* Header */}
          <div 
            className="sticky top-0 z-10 flex items-center justify-between p-6"
            style={{
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E5E7EB',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF2FF'
                }}
              >
                <Mail size={20} style={{ color: '#6366F1' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>
                  Modèle d'email Check-in J+14
                </h2>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                  Email à envoyer à l'entreprise pour demander le feedback
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div 
              className="rounded-lg p-6"
              style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#374151'
              }}
            >
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px'
              }}>
                {emailTemplate}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleCopy}
                style={{
                  backgroundColor: copied ? '#10B981' : '#6366F1',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!copied) e.currentTarget.style.backgroundColor = '#4F46E5';
                }}
                onMouseLeave={(e) => {
                  if (!copied) e.currentTarget.style.backgroundColor = '#6366F1';
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copier le modèle
                  </>
                )}
              </Button>
              
              <Button
                onClick={onClose}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  border: '1px solid #E5E7EB',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Fermer
              </Button>
            </div>

            {/* Info */}
            <div 
              className="mt-6 rounded-lg p-4"
              style={{
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D2FE'
              }}
            >
              <p style={{ fontSize: '13px', color: '#4338CA', margin: 0, lineHeight: '1.5' }}>
                💡 <strong>Conseil :</strong> Personnalisez le nom du talent et de l'entreprise, puis copiez ce modèle dans votre outil d'emailing préféré (Gmail, Outlook, etc.). Le lien du formulaire sera automatiquement généré lors de l'envoi.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
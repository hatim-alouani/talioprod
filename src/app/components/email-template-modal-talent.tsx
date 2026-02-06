'use client';

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Copy, Check, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EmailTemplateModalTalentProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  formLink: string;
  amName: string;
}

export function EmailTemplateModalTalent({ isOpen, onClose, talentName, formLink, amName }: EmailTemplateModalTalentProps) {
  const [copied, setCopied] = useState(false);

  const emailTemplate = `Objet : Quick check-in J+14 avec ton expérience internationale 🚀

Salut ${talentName},

Ça fait maintenant 2 semaines que tu as démarré ton expérience internationale — c'est le bon moment pour un check-in rapide !

On veut s'assurer que :
✅ Tu as tout ce qu'il te faut (accès, outils, clarté)
✅ La collaboration se passe bien
✅ Aucun blocage à l'horizon

📋 **2 minutes chrono pour répondre :**
${formLink}

⚠️ **IMPORTANT — Ne tarde pas à répondre !**
Ce check-in fait partie de notre processus qualité obligatoire. **Tant que nous n'avons pas reçu ton retour, le traitement de ta rémunération pourrait être suspendu.** Réponds dans les 48h pour éviter tout blocage administratif.

Quelques questions simples sur :
• Ton ressenti général après 2 semaines
• Les accès et outils
• La clarté du scope et des priorités
• La communication avec l'équipe cliente
• Ta charge de travail et ton bien-être
• Les éventuels blocages

💡 **Pourquoi c'est important ?**
Ton retour nous permet d'intervenir rapidement si quelque chose coince. ${amName} suit personnellement ton expérience et peut débloquer toute situation en 24-48h.

**Tes réponses restent confidentielles** et nous aident à améliorer continuellement ton expérience.

Si quelque chose ne va pas, n'hésite pas — on est là pour t'aider ! 💪

Merci et excellente journée !

Cordialement,
csm@taliotalent.com
www.taliotalent.com

---

P.S. : Si tu préfères en parler de vive voix, tu peux réserver un créneau direct avec ${amName} : https://calendly.com/alouanihatim01/30min`;

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
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '24px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div className="flex items-center gap-3">
              <Mail size={24} style={{ color: '#6366F1' }} />
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#111827',
                margin: 0
              }}>
                Email d'invitation — Talent J+14
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#6B7280'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div style={{
            padding: '24px',
            overflow: 'auto',
            flex: 1
          }}>
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#374151'
              }}>
                {emailTemplate}
              </pre>
            </div>

            <div style={{
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <p style={{ 
                fontSize: '13px', 
                color: '#4338CA',
                margin: 0,
                lineHeight: '1.5'
              }}>
                💡 <strong>Note :</strong> Cet email est adapté pour les Talents. Il utilise un ton friendly et rassurant, 
                sans mention d'upsell ou d'opportunités commerciales.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '24px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <Button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                color: '#6B7280',
                border: '1px solid #D1D5DB',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Fermer
            </Button>
            <Button
              onClick={handleCopy}
              style={{
                backgroundColor: copied ? '#10B981' : '#6366F1',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
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
                  Copier l'email
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
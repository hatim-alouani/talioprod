'use client';

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Textarea } from "@/app/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Info, Calendar, AlertCircle, PhoneCall, Copy, Check, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EmailTemplateModal } from "@/app/components/email-template-modal";
import { TalioTheme } from "@/config/talio-theme";
import { CheckInFormStyles } from "@/styles/checkin-form-styles";

interface NotificationPreview {
  type: "at-risk" | "upsell" | "call-programmed" | "check-in-ok";
  slackMessage: string;
  emailEntreprise: {
    subject: string;
    body: string;
  };
  emailTalent: {
    subject: string;
    body: string;
  };
}

interface UrlParams {
  contract_id: string;
  id: string;
  talent_whatsapp_number: string;
  company_id: string;
  company_name: string;
  talent_id: string;
  talent_full_name: string;
  talent_email: string;
  account_manager_full_name: string;
  account_manager_email: string;
  calendly_link: string;
  billing_period_start: string;
  billing_period_end: string;
  contract_duration: string;
  contract_start_date: string;
  contract_end_date: string;
  jx: string;
  jshow: string;
  hidden?: string;
}

interface CheckInFormProps {
  urlParams?: UrlParams;
  webhookUrl?: string;
}

export function CheckInForm({ urlParams, webhookUrl }: CheckInFormProps = {}) {
  // États du formulaire
  const [demarrage, setDemarrage] = useState("3");
  const [detailsDemarrage, setDetailsDemarrage] = useState("");
  const [commentaireDemarrage, setCommentaireDemarrage] = useState("");
  const [acces, setAcces] = useState("partiel");
  const [detailsAcces, setDetailsAcces] = useState("");
  const [clartebrief, setClartebrief] = useState("4");
  const [detailsClarte, setDetailsClarte] = useState("");
  const [commentaireClarte, setCommentaireClarte] = useState("");
  const [collaboration, setCollaboration] = useState("4");
  const [detailsCollaboration, setDetailsCollaboration] = useState("");
  const [commentaireCollaboration, setCommentaireCollaboration] = useState("");
  const [engagement, setEngagement] = useState("4");
  const [commentaireEngagement, setCommentaireEngagement] = useState("");
  const [premiereLivraison, setPremiereLivraison] = useState("en-cours");
  const [blocageLivraison, setBlocageLivraison] = useState("");
  const [chargeTravail, setChargeTravail] = useState("equilibre");
  const [blocage, setBlocage] = useState("non");
  const [sujetPrincipal, setSujetPrincipal] = useState("");
  const [axesAmelioration, setAxesAmelioration] = useState("");
  const [contexteBlocage, setContexteBlocage] = useState("");
  const [call, setCall] = useState("non");
  const [calendlyBooked, setCalendlyBooked] = useState(false);
  const [showCalendlyWarning, setShowCalendlyWarning] = useState(false);
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormLink(window.location.href);
    }
  }, []);

  // Load Calendly widget script
  useEffect(() => {
    // Add Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Reset booking status when call changes
  useEffect(() => {
    if (call === "non") {
      setCalendlyBooked(false);
      setShowCalendlyWarning(false);
    }
  }, [call]);
  const [upsell, setUpsell] = useState("");
  const [successStory, setSuccessStory] = useState("");
  
  // États pour le récapitulatif
  const [showSummary, setShowSummary] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreview | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedState, setCopiedState] = useState<string>("");
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handlers avec réinitialisation automatique des détails
  const handleDemarrageChange = (value: string) => {
    setDemarrage(value);
    if (parseInt(value) > 3) {
      setDetailsDemarrage("");
      setCommentaireDemarrage("");
    } else if (parseInt(value) > 2) {
      setDetailsDemarrage("");
    }
  };

  const handleClarteChange = (value: string) => {
    setClartebrief(value);
    if (parseInt(value) > 3) {
      setDetailsClarte("");
      setCommentaireClarte("");
    } else if (parseInt(value) > 2) {
      setDetailsClarte("");
    }
  };

  const handleCollaborationChange = (value: string) => {
    setCollaboration(value);
    if (parseInt(value) > 3) {
      setDetailsCollaboration("");
      setCommentaireCollaboration("");
    } else if (parseInt(value) > 2) {
      setDetailsCollaboration("");
    }
  };

  const handleEngagementChange = (value: string) => {
    setEngagement(value);
    if (parseInt(value) > 3) {
      setCommentaireEngagement("");
    }
  };

  const handlePremiereLivraisonChange = (value: string) => {
    setPremiereLivraison(value);
    if (value === "oui") {
      setBlocageLivraison("");
    }
  };

  const handleChargeTravailChange = (value: string) => {
    setChargeTravail(value);
  };

  const handleAccesChange = (value: string) => {
    setAcces(value);
    // Réinitialiser les détails si l'accès devient "oui"
    if (value === "oui") {
      setDetailsAcces("");
    }
  };

  const handleBlocageChange = (value: string) => {
    setBlocage(value);
    // Réinitialiser les détails si le blocage devient "non"
    if (value === "non") {
      setSujetPrincipal("");
      setAxesAmelioration("");
      setContexteBlocage("");
    }
  };

  const generateNotifications = (formData: any): NotificationPreview => {
    const talentName = urlParams?.talent_full_name || "Nadia Berrada";
    const entrepriseName = urlParams?.company_name || "[Entreprise]";
    const calendlyLink = urlParams?.calendly_link || "https://calendly.com/alouanihatim01/30min";
    const accountManagerName = urlParams?.account_manager_full_name || "[Account Manager]";
    
    // Calculer J+2 pour les dates de réponse
    const responseDate = new Date();
    responseDate.setDate(responseDate.getDate() + 2);
    const responseDateFormatted = responseDate.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });

    // Analyse des scores
    const demarrageScore = parseInt(formData.demarrage);
    const clarteScore = parseInt(formData.clartebrief);
    const collaborationScore = parseInt(formData.collaboration);
    const engagementScore = parseInt(formData.engagement);
    
    const isDemarrageWeak = demarrageScore <= 2;
    const isClarteWeak = clarteScore <= 2;
    const isCollaborationWeak = collaborationScore <= 2;
    const isEngagementWeak = engagementScore <= 2;
    const isDemarrageWarning = demarrageScore === 3;
    const isClarteWarning = clarteScore === 3;
    const isCollaborationWarning = collaborationScore === 3;
    const isEngagementWarning = engagementScore === 3;
    const isAccessIssue = formData.acces === "non" || formData.acces === "partiel";
    const isCriticalAccess = formData.acces === "non";
    const isBloquant = formData.blocage === "oui-bloquant";
    const isMineur = formData.blocage === "oui-mineur";
    const hasUpsell = formData.upsell.trim() !== "";
    const noLivraison = formData.premiereLivraison === "non";
    const livraisonEnCours = formData.premiereLivraison === "en-cours";
    const isSousUtilise = formData.chargeTravail === "sous-utilise";
    const isSurcharge = formData.chargeTravail === "surcharge";
    const hasSuccessStory = formData.successStory.trim() !== "";
    
    // ✅ NOUVELLE LOGIQUE 1 : Combo "Équilibrée" + "Pas de livraison"
    const isEquilibreButNoDelivery = formData.chargeTravail === "equilibre" && noLivraison;
    
    // ✅ NOUVELLE LOGIQUE 2 : Tous les scores à 3/5
    const allScoresAre3 = demarrageScore === 3 && clarteScore === 3 && collaborationScore === 3 && engagementScore === 3;
    
    // ===== CALCUL MISSION HEALTH SCORE /100 =====
    const calculateHealthScore = (formData: any): number => {
      let score = 0;
      
      // 1. Démarrage (santé globale): 15 points max - Scale 1-5 to 0-15
      const demarragePoints = ((parseInt(formData.demarrage) - 1) / 4) * 15;
      score += demarragePoints;
      
      // 2. Clarté du brief: 15 points max - Scale 1-5 to 0-15
      const clartePoints = ((parseInt(formData.clartebrief) - 1) / 4) * 15;
      score += clartePoints;
      
      // 3. Collaboration: 15 points max - Scale 1-5 to 0-15
      const collaborationPoints = ((parseInt(formData.collaboration) - 1) / 4) * 15;
      score += collaborationPoints;
      
      // 4. Engagement: 20 points max - Scale 1-5 to 0-20 (plus important)
      const engagementPoints = ((parseInt(formData.engagement) - 1) / 4) * 20;
      score += engagementPoints;
      
      // 5. Accès & outils: 15 points max
      const accesPoints = formData.acces === "oui" ? 15 : 
                          formData.acces === "partiel" ? 8 : 0;
      score += accesPoints;
      
      // 6. Première livraison: 10 points max
      const livraisonPoints = formData.premiereLivraison === "oui" ? 10 : 
                              formData.premiereLivraison === "en-cours" ? 6 : 0;
      score += livraisonPoints;
      
      // 7. Charge de travail: 5 points max
      const chargePoints = formData.chargeTravail === "equilibre" ? 5 : 
                          formData.chargeTravail === "sous-utilise" ? 3 : 0;
      score += chargePoints;
      
      // 8. Blocage: 5 points max
      const blocagePoints = formData.blocage === "non" ? 5 : 
                           formData.blocage === "oui-mineur" ? 2 : 0;
      score += blocagePoints;
      
      // Arrondir le score final
      return Math.round(score);
    };
    
    const healthScore = calculateHealthScore(formData);
    
    // Déterminer l'emoji et la couleur selon les nouveaux seuils
    const healthEmoji = healthScore >= 70 ? "🟢" : healthScore >= 50 ? "🟠" : "🔴";
    const healthColor = healthScore >= 70 ? "green" : healthScore >= 50 ? "yellow" : "red";
    const healthStatus = healthScore >= 70 ? "Bonne santé" : healthScore >= 50 ? "À surveiller" : "Critique";
    
    const hasCallRequested = formData.call === "oui";

    const isAtRisk = isDemarrageWeak || isClarteWeak || isCollaborationWeak || isEngagementWeak || isCriticalAccess || isBloquant || noLivraison || isSurcharge || isEquilibreButNoDelivery;
    const needsImmediateCall = isBloquant || (isDemarrageWeak && isClarteWeak) || (isCollaborationWeak && isCriticalAccess) || (isEngagementWeak && noLivraison) || isSurcharge || isEquilibreButNoDelivery;

    // Déterminer le type principal de notification
    let notificationType: "at-risk" | "upsell" | "call-programmed" | "check-in-ok" = "check-in-ok";
    if (isAtRisk) notificationType = "at-risk";
    else if (hasUpsell && !isAtRisk) notificationType = "upsell";
    else if (hasCallRequested && !isAtRisk) notificationType = "call-programmed";

    // ===== GÉNÉRATION MESSAGE SLACK (RÉSUMÉ COMPLET) - BLOCK KIT FORMAT =====
    
    // Déterminer l'en-tête selon priorité
    let headerEmoji = "✅";
    let headerTitle = `Check-in J+14 – Mission OK chez ${entrepriseName}`;
    if (isBloquant) {
      headerEmoji = "🚨";
      headerTitle = `URGENT – Mission à risque critique chez ${entrepriseName}`;
    } else if (isAtRisk) {
      headerEmoji = "⚠️";
      headerTitle = `Check-in J+14 – Mission à risque chez ${entrepriseName}`;
    } else if (hasUpsell) {
      headerEmoji = "💡";
      headerTitle = `Upsell potentiel – Mission ${entrepriseName}`;
    }

    // Détails des points faibles (uniquement si les scores/réponses déclenchent des alertes)
    const weakPoints = [];
    if (isDemarrageWeak && formData.detailsDemarrage) weakPoints.push(`*Démarrage :* ${formData.detailsDemarrage}`);
    if (isClarteWeak && formData.detailsClarte) weakPoints.push(`*Clarté :* ${formData.detailsClarte}`);
    if (isCollaborationWeak && formData.detailsCollaboration) weakPoints.push(`*Collaboration :* ${formData.detailsCollaboration}`);
    if (isEngagementWeak && formData.commentaireEngagement) weakPoints.push(`*Engagement :* ${formData.commentaireEngagement}`);
    if (isAccessIssue && formData.detailsAcces) weakPoints.push(`*Accès :* ${formData.detailsAcces}`);
    if ((noLivraison || livraisonEnCours) && formData.blocageLivraison) weakPoints.push(`*Blocage livraison :* ${formData.blocageLivraison}`);
    if (isBloquant && formData.contexteBlocage) weakPoints.push(`*Blocage critique :* ${formData.contexteBlocage}`);
    if (isMineur && formData.axesAmelioration) weakPoints.push(`*Axes d'amélioration (mineur) :* ${formData.axesAmelioration}`);

    // Warnings (score 3)
    const warningPoints = [];
    if (isDemarrageWarning && formData.commentaireDemarrage) warningPoints.push(`*Démarrage :* ${formData.commentaireDemarrage}`);
    if (isClarteWarning && formData.commentaireClarte) warningPoints.push(`*Clarté :* ${formData.commentaireClarte}`);
    if (isCollaborationWarning && formData.commentaireCollaboration) warningPoints.push(`*Collaboration :* ${formData.commentaireCollaboration}`);
    if (isEngagementWarning && formData.commentaireEngagement) warningPoints.push(`*Engagement :* ${formData.commentaireEngagement}`);

    // Red flags combinés
    const redFlags = [];
    if (isEngagementWeak && noLivraison) redFlags.push("🔴 *ALERTE COMBO :* Engagement faible + Aucune livraison → Risque churn 90%");
    if (isSousUtilise && noLivraison) redFlags.push("⚠️ Talent sous-utilisé sans livraison → Frustration + Mauvais ROI");
    if (isSurcharge) redFlags.push("🔴 *URGENT :* Talent surchargé → Risque burnout immédiat");
    if (isEquilibreButNoDelivery) redFlags.push("⚠️ Charge OK mais pas de livraison → Talent bloqué ou mal aligné ?");

    // Construire le texte détaillé
    let detailsText = `📊 *Mission Health Score : ${healthScore}/100* ${healthEmoji} *[${healthStatus}]*\n`;
    detailsText += `_Score < 50 🔴 Critique | 50-70 🟠 À surveiller | > 70 🟢 Bonne santé_\n\n`;
    detailsText += `*Détail des composantes :*\n`;
    detailsText += `• Démarrage : ${demarrageScore}/5 ${isDemarrageWeak ? "🔴" : demarrageScore === 3 ? "🟠" : "🟢"}\n`;
    detailsText += `• Clarté du brief : ${clarteScore}/5 ${isClarteWeak ? "🔴" : clarteScore === 3 ? "🟠" : "🟢"}\n`;
    detailsText += `• Collaboration : ${collaborationScore}/5 ${isCollaborationWeak ? "🔴" : collaborationScore === 3 ? "🟠" : "🟢"}\n`;
    detailsText += `• Engagement talent : ${engagementScore}/5 ${isEngagementWeak ? "🔴" : engagementScore === 3 ? "🟠" : "🟢"}\n`;
    detailsText += `• Accès & outils : ${formData.acces} ${isCriticalAccess ? "🔴" : isAccessIssue ? "🟠" : "🟢"}\n`;
    detailsText += `• Première livraison : ${formData.premiereLivraison === "oui" ? "✅ Oui" : formData.premiereLivraison === "en-cours" ? "🟠 En cours" : "🔴 Non"}\n`;
    detailsText += `• Charge travail : ${formData.chargeTravail === "equilibre" ? "✅ Équilibrée" : formData.chargeTravail === "sous-utilise" ? "⚠️ Sous-utilisé" : "🔴 Surchargé"}\n`;
    detailsText += `• Blocage : ${formData.blocage === "non" ? "✅ Aucun" : isBloquant ? "🔴 Bloquant" : "🟠 Mineur"}\n`;
    
    if (formData.blocage !== "non") {
      if (formData.sujetPrincipal) {
        detailsText += `  └─ Sujet : ${formData.sujetPrincipal}\n`;
      }
    }

    if (redFlags.length > 0) {
      detailsText += `\n🚨 *RED FLAGS CRITIQUES :*\n`;
      redFlags.forEach(flag => detailsText += `${flag}\n`);
    }

    if (weakPoints.length > 0) {
      detailsText += `\n📝 *Détails & Points critiques :*\n`;
      weakPoints.forEach(point => detailsText += `${point}\n`);
    }

    if (warningPoints.length > 0) {
      detailsText += `\n⚠️ *Points de vigilance (zone orange) :*\n`;
      warningPoints.forEach(point => detailsText += `${point}\n`);
    }

    if (allScoresAre3) {
      detailsText += `\n⚠️ *ATTENTION : Tous les scores sont à 3/5* → Signe de 'politeness bias' → Creuser en call\n`;
    }

    if (hasUpsell) {
      detailsText += `\n💡 *Upsell / Besoin complémentaire :*\n${formData.upsell}\n`;
    }
    if (isSousUtilise && !hasUpsell) {
      detailsText += `\n💡 *Opportunité upsell détectée :* Talent sous-utilisé → Proposer extension scope\n`;
    }

    // Actions prioritaires
    detailsText += `\n🎯 *ACTIONS PRIORITAIRES (par ordre) :*\n`;
    let actionNumber = 1;
    
    if (isSurcharge || isBloquant) {
      detailsText += `${actionNumber}. 🔥 *AUJOURD'HUI* : Call immédiat ${isSurcharge ? "avec le talent (surcharge)" : "avec l'entreprise (blocage)"}\n`;
      detailsText += `   └─ 📞 Calendly : ${calendlyLink}\n`;
      actionNumber++;
    }
    
    if (isEngagementWeak && noLivraison) {
      detailsText += `${actionNumber}. 🚨 *CETTE SEMAINE* : Call talent pour comprendre désengagement + débloquer première livraison\n`;
      actionNumber++;
    }
    
    if (needsImmediateCall && !isSurcharge && !isBloquant) {
      detailsText += `${actionNumber}. ⚠️ *URGENT* : Call avec l'entreprise pour résoudre problèmes détectés\n`;
      detailsText += `   └─ 📞 Calendly : ${calendlyLink}\n`;
      actionNumber++;
    }
    
    if (hasCallRequested && !needsImmediateCall) {
      detailsText += `${actionNumber}. 📞 Call demandé par l'entreprise\n`;
      if (!isAtRisk && !hasUpsell) {
        detailsText += `   💡 *NOTE :* Call demandé sans problème apparent → Peut cacher quelque chose → PRIORISER ce call\n`;
      }
      detailsText += `   └─ 🔗 ${calendlyLink}\n`;
      actionNumber++;
    }
    
    if (isSousUtilise) {
      detailsText += `${actionNumber}. 💡 Proposer upsell (extension scope) - Talent sous-utilisé\n`;
      actionNumber++;
    }
    
    if (isMineur) {
      detailsText += `${actionNumber}. 📋 Suivi des axes d'amélioration avec le talent\n`;
      actionNumber++;
    }
    
    if (actionNumber === 1) {
      detailsText += `1. ✅ Continuer le suivi régulier - Mission saine\n`;
      detailsText += `2. 📅 Prochain check-in : J+30\n`;
    }

    detailsText += `\n⏰ *Deadline action prioritaire :* ${needsImmediateCall ? "Aujourd'hui 18h" : "Cette semaine"}`;

    // Construire le message Slack en Block Kit format
    const slackMessage = JSON.stringify({
      text: `${headerEmoji} ${headerTitle}`,
      blocks: notificationType === "check-in-ok" ? [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `✅ Check-in ${urlParams?.jshow || 'J+14'} – Mission OK chez ${entrepriseName}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*👤 Talent:*\n${talentName}`
            },
            {
              type: 'mrkdwn',
              text: `*🏢 Entreprise:*\n${entrepriseName}`
            },
            {
              type: 'mrkdwn',
              text: `*📊 Health Score:*\n${healthScore}/100 ${healthEmoji}`
            },
            {
              type: 'mrkdwn',
              text: `*✅ Statut:*\nMission OK`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `✅ *Indicateurs:*\n• Démarrage : *${demarrageScore}/5* 🟢\n• Clarté du brief : *${clarteScore}/5* 🟢\n• Collaboration : *${collaborationScore}/5* 🟢\n• Engagement talent : *${engagementScore}/5* 🟢\n• Accès & outils : *${formData.acces}* 🟢\n• Première livraison : *${formData.premiereLivraison === "oui" ? "Oui" : formData.premiereLivraison === "en-cours" ? "En cours" : "Non"}*\n• Charge travail : *${formData.chargeTravail === "equilibre" ? "Équilibrée" : formData.chargeTravail === "sous-utilise" ? "Sous-utilisé" : "Surchargé"}*`
          }
        },
        ...(formData.successStory ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*💬 Success Story:*\n"${formData.successStory}"`
          }
        }] : []),
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎯 *ACTIONS PRIORITAIRES (par ordre) :*\n1. ✅ Continuer le suivi régulier - Mission saine\n2. 📅 Prochain check-in : J+30\n\n⏰ *Deadline action prioritaire :* Cette semaine`
          }
        }
      ] : [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${headerEmoji} ${headerTitle}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*👤 Talent:*\n${talentName}`
            },
            {
              type: 'mrkdwn',
              text: `*🏢 Entreprise:*\n${entrepriseName}`
            },
            {
              type: 'mrkdwn',
              text: `*📊 Health Score:*\n${healthScore}/100 ${healthEmoji}`
            },
            {
              type: 'mrkdwn',
              text: `*⚠️ Statut:*\n${isBloquant ? "Critique" : "À risque"}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*📋 Détail des scores:*\n• Démarrage : *${demarrageScore}/5* ${isDemarrageWeak ? "🔴" : demarrageScore === 3 ? "🟠" : "🟢"}\n• Clarté du brief : *${clarteScore}/5* ${isClarteWeak ? "🔴" : clarteScore === 3 ? "🟠" : "🟢"}\n• Collaboration : *${collaborationScore}/5* ${isCollaborationWeak ? "🔴" : collaborationScore === 3 ? "🟠" : "🟢"}\n• Engagement talent : *${engagementScore}/5* ${isEngagementWeak ? "🔴" : engagementScore === 3 ? "🟠" : "🟢"}\n• Accès & outils : *${formData.acces}* ${isCriticalAccess ? "🔴" : isAccessIssue ? "🟠" : "🟢"}\n• Première livraison : *${formData.premiereLivraison === "oui" ? "Oui" : formData.premiereLivraison === "en-cours" ? "En cours" : "Non"}* ${formData.premiereLivraison === "oui" ? "🟢" : formData.premiereLivraison === "en-cours" ? "🟠" : "🔴"}\n• Charge travail : *${formData.chargeTravail === "equilibre" ? "Équilibrée" : formData.chargeTravail === "sous-utilise" ? "Sous-utilisé" : "Surchargé"}* ${formData.chargeTravail === "equilibre" ? "🟢" : formData.chargeTravail === "sous-utilise" ? "🟠" : "🔴"}${formData.blocage !== "non" ? `\n• Blocage : *${isBloquant ? "Oui, bloquant" : "Oui, mineur"}* ${isBloquant ? "🔴" : "🟠"}` : ""}${formData.sujetPrincipal ? `\n  └─ Sujet : ${formData.sujetPrincipal}` : ""}`
          }
        },
        ...(redFlags.length > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🚨 *RED FLAGS CRITIQUES:*\n${redFlags.join('\n')}`
          }
        }] : []),
        ...(weakPoints.length > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `📝 *Détails & Points critiques:*\n${weakPoints.join('\n')}`
          }
        }] : []),
        ...(warningPoints.length > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `⚠️ *Points de vigilance (zone orange):*\n${warningPoints.join('\n')}`
          }
        }] : []),
        ...(allScoresAre3 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `⚠️ *ATTENTION : Tous les scores sont à 3/5* → Signe de 'politeness bias' → Creuser en call`
          }
        }] : []),
        ...(hasUpsell ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `💡 *Upsell / Besoin complémentaire:*\n${formData.upsell}`
          }
        }] : []),
        ...(isSousUtilise && !hasUpsell ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `💡 *Opportunité upsell détectée:* Talent sous-utilisé → Proposer extension scope`
          }
        }] : []),
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎯 *ACTIONS PRIORITAIRES (par ordre):*\n${(() => {
              let actions = [];
              let actionNumber = 1;
              if (isSurcharge || isBloquant) {
                actions.push(actionNumber + '. 🔥 *AUJOURD\'HUI* : Call immédiat ' + (isSurcharge ? "avec le talent (surcharge)" : "avec l'entreprise (blocage)") + '\n   └─ 📞 Calendly : ' + calendlyLink);
                actionNumber++;
              }
              if (isEngagementWeak && noLivraison) {
                actions.push(actionNumber + '. 🚨 *CETTE SEMAINE* : Call talent pour comprendre désengagement + débloquer première livraison');
                actionNumber++;
              }
              if (needsImmediateCall && !isSurcharge && !isBloquant) {
                actions.push(actionNumber + '. ⚠️ *URGENT* : Call avec l\'entreprise pour résoudre problèmes détectés\n   └─ 📞 Calendly : ' + calendlyLink);
                actionNumber++;
              }
              if (hasCallRequested && !needsImmediateCall) {
                let callAction = actionNumber + '. 📞 Call demandé par l\'entreprise';
                if (!isAtRisk && !hasUpsell) {
                  callAction += '\n   💡 *NOTE :* Call demandé sans problème apparent → Peut cacher quelque chose → PRIORISER ce call';
                }
                callAction += '\n   └─ 🔗 ' + calendlyLink;
                actions.push(callAction);
                actionNumber++;
              }
              if (isSousUtilise) {
                actions.push(actionNumber + '. 💡 Proposer upsell (extension scope) - Talent sous-utilisé');
                actionNumber++;
              }
              if (isMineur) {
                actions.push(actionNumber + '. 📋 Suivi des axes d\'amélioration avec le talent');
                actionNumber++;
              }
              return actions.join('\n');
            })()}\n\n⏰ *Deadline action prioritaire:* ${needsImmediateCall ? "Aujourd'hui 18h" : "Cette semaine"}`
          }
        }
      ]
    });

    // ===== EMAIL WRAPPER FUNCTION =====
    const wrapEmailHTML = (headerTitle: string, body: string, headerGradient: string = "linear-gradient(90deg,#f59e0b 0%, #f97316 100%)", icon: string = "⚠️") => {
      return `<!-- Talio Email Template -->
<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:${headerGradient};text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  ${icon} ${headerTitle}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                ${body}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
    };

    // ===== GÉNÉRATION EMAIL ENTREPRISE (HTML) =====
    let emailEntreprise = {
      subject: "",
      body: ""
    };

    if (isBloquant) {
      emailEntreprise = {
        subject: `Action requise – Blocage critique détecté avec ${talentName}`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient orange -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">🚨 Action requise – Blocage critique</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">Bonjour,</p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Suite au check-in J+14 de votre mission avec <strong>${talentName}</strong>, nous avons détecté un point bloquant qui nécessite votre attention immédiate.
              </p>

              <!-- Blocage Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #92400e;">🚨 Contexte du blocage</h3>
                    ${formData.sujetPrincipal ? `<p style="margin: 0 0 10px 0; font-size: 14px; line-height: 20px; color: #92400e;"><strong>Sujet principal :</strong> ${formData.sujetPrincipal}</p>` : ""}
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e;">${formData.contexteBlocage}</p>
                  </td>
                </tr>
              </table>

              <!-- Scores -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">📊 Récapitulatif des scores</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Démarrage : <strong>${demarrageScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Clarté du brief : <strong>${clarteScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Collaboration : <strong>${collaborationScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Accès & outils : <strong>${formData.acces}</strong></td>
                </tr>
              </table>

              <!-- Prochaines étapes -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">💬 Prochaines étapes</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                <strong>${accountManagerName}</strong>, votre Account Manager, vous contactera d'ici <strong>${responseDateFormatted}</strong> (J+2 max) pour lever ce blocage rapidement.
              </p>

              <!-- Bouton Calendly -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${calendlyLink}" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">📞 Réserver un créneau maintenant</a>
                  </td>
                </tr>
              </table>

              <!-- SLA Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #1e40af;"><strong>⚡ SLA Talio :</strong> Réponse garantie sous 48h</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151;">
                On est là pour vous accompagner et garantir la réussite de votre mission.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 5px 0; font-size: 16px; color: #374151;">Cordialement,</p>
              <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">csm@taliotalent.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    } else if (isAtRisk) {
      const pointsFaibles = [];
      if (isDemarrageWeak) pointsFaibles.push(`• Démarrage : ${demarrageScore}/5 – ${formData.detailsDemarrage || "Quelques difficultés au démarrage"}`);
      if (isClarteWeak) pointsFaibles.push(`• Clarté du brief : ${clarteScore}/5 – ${formData.detailsClarte || "Points à clarifier"}`);
      if (isCollaborationWeak) pointsFaibles.push(`• Collaboration : ${collaborationScore}/5 – ${formData.detailsCollaboration || "Quelques frictions dans la collaboration"}`);
      if (isCriticalAccess) pointsFaibles.push(`• Accès & outils : ${formData.acces} – ${formData.detailsAcces || "Accès manquants"}`);

      emailEntreprise = {
        subject: `Check-in J+14 – Points d'attention avec ${talentName}`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient orange -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">⚠️ Points d'attention détectés</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">Bonjour,</p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Merci pour votre retour sur le check-in J+14 avec <strong>${talentName}</strong>.
              </p>

              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Quelques points d'attention ont été identifiés et nécessitent un alignement rapide :
              </p>

              <!-- Points d'attention Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    ${pointsFaibles.map(point => `<p style="margin: 0 0 10px 0; font-size: 14px; line-height: 20px; color: #92400e;">${point}</p>`).join('')}
                  </td>
                </tr>
              </table>

              <!-- Scores complets -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">📊 Récapitulatif complet</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Démarrage : <strong>${demarrageScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Clarté du brief : <strong>${clarteScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Collaboration : <strong>${collaborationScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Accès & outils : <strong>${formData.acces}</strong></td>
                </tr>
              </table>

              <!-- Prochaines étapes -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">💬 On fait quoi maintenant ?</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                <strong>${accountManagerName}</strong> va prendre contact avec vous pour aligner rapidement ces points et garantir la réussite de la mission.
              </p>

              ${hasCallRequested ? 
                `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                  Vous avez demandé un call – voici le lien pour réserver un créneau :
                </p>` : 
                `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                  Besoin d'un point rapide ? Réservez un créneau ici :
                </p>`
              }

              <!-- Bouton Calendly -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${calendlyLink}" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">📞 Réserver un créneau</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151;">
                On est là pour vous accompagner.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 5px 0; font-size: 16px; color: #374151;">Cordialement,</p>
              <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">csm@taliotalent.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    } else if (isMineur) {
      emailEntreprise = {
        subject: `Check-in J+14 – Axes d'amélioration pour ${talentName}`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient orange -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">📋 Axes d'amélioration</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">Bonjour,</p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Merci pour votre retour sur le check-in J+14 avec <strong>${talentName}</strong> !
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Vous avez mentionné quelques axes d'amélioration (points mineurs) :
              </p>

              <!-- Axes d'amélioration Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e;">${formData.axesAmelioration || formData.sujetPrincipal}</p>
                  </td>
                </tr>
              </table>

              <!-- Scores -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">📊 Récapitulatif</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Démarrage : <strong>${demarrageScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Clarté du brief : <strong>${clarteScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Collaboration : <strong>${collaborationScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Accès & outils : <strong>${formData.acces}</strong></td>
                </tr>
              </table>

              <!-- Prochaines étapes -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">💬 Prochaines étapes</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Nous allons partager ces retours avec <strong>${talentName}</strong> de manière constructive pour l'aider à progresser. Ce type de feedback est essentiel pour garantir une collaboration optimale.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                N'hésitez pas à continuer ce feedback régulier – c'est ce qui fait la différence !
              </p>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151;">
                Merci pour votre confiance.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 5px 0; font-size: 16px; color: #374151;">Cordialement,</p>
              <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">csm@taliotalent.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    } else {
      emailEntreprise = {
        subject: `Check-in J+14 – Tout roule avec ${talentName} 🎉`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient purple -->
          <tr>
            <td style="background: linear-gradient(135deg, #6b84ff 0%, #7b56b3 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">🎉 Tout roule avec ${talentName}</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">Bonjour,</p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Merci pour votre retour sur le check-in J+14 avec <strong>${talentName}</strong> !
              </p>

              <!-- Scores -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">📊 Récapitulatif</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Démarrage : <strong>${demarrageScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Clarté du brief : <strong>${clarteScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Collaboration : <strong>${collaborationScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Accès & outils : <strong>${formData.acces}</strong></td>
                </tr>
              </table>

              <!-- Success Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #065f46;">Tout semble bien se passer ! Nous continuerons le suivi régulier pour garantir la réussite de votre mission.</p>
                  </td>
                </tr>
              </table>

              ${hasUpsell ? `
              <!-- Upsell Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #1e40af;">💡 Besoin complémentaire détecté</h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 20px; color: #1e40af;">Vous avez mentionné : "${formData.upsell}"</p>
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #1e40af;"><strong>${accountManagerName}</strong> va revenir vers vous avec des options adaptées.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151;">
                Prochain check-in prévu : <strong>J+30</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 5px 0; font-size: 16px; color: #374151;">Cordialement,</p>
              <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">csm@taliotalent.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    }

    // ===== GÉNÉRATION EMAIL TALENT (HTML) =====
    let emailTalent = {
      subject: "",
      body: ""
    };

    if (isBloquant || isSurcharge) {
      // Déterminer le point positif
      const pointPositif = demarrageScore >= 4 ? "ton démarrage est solide" : 
                          clarteScore >= 4 ? "tu as bien compris le brief" :
                          collaborationScore >= 4 ? "ta collaboration avec l'équipe est au top" :
                          "tu es impliqué(e) sur la mission";
      
      // Déterminer l'action principale
      const actionPrincipale = isSurcharge ? 
        "la charge de travail semble trop importante" :
        `un point bloquant nécessite qu'on agisse rapidement : ${formData.sujetPrincipal || ""}`;

      emailTalent = {
        subject: `Check-in J+14 – On règle ça ensemble 💪`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient orange -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">💪 On règle ça ensemble</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">Salut <strong>${talentName}</strong> ! 👋</p>
              
              <!-- Point positif Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #065f46;"><strong>Ce qui roule déjà :</strong> ${pointPositif} – c'est important de le souligner !</p>
                  </td>
                </tr>
              </table>

              <!-- Ajustement Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e;"><strong>⚠️ Un ajustement rapide :</strong> ${actionPrincipale}</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                <strong>${accountManagerName}</strong> va te contacter rapidement pour qu'on règle ça ensemble. Pas de stress – c'est exactement notre rôle de débloquer ce genre de situation !
              </p>

              <!-- Info Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #1e40af;"><strong>💬 On est là pour toi :</strong> ${accountManagerName} est dispo ${isSurcharge ? "aujourd'hui" : "cette semaine"} pour en discuter.</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151; text-align: center; font-weight: 600;">
                Continue, tu assures ! 💪
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    } else if (isAtRisk) {
      // Identifier le meilleur score pour le positif
      const scores = [
        { name: "démarrage", score: demarrageScore },
        { name: "clarté du brief", score: clarteScore },
        { name: "collaboration", score: collaborationScore },
        { name: "engagement", score: engagementScore }
      ].sort((a, b) => b.score - a.score);
      
      const pointPositif = scores[0].score >= 4 ? 
        `Ta ${scores[0].name} est vraiment bien (${scores[0].score}/5)` :
        "Tu es impliqué(e) et motivé(e) sur cette mission";

      // Identifier LE point le plus critique (pas une liste)
      let pointCritique = "";
      if (isEngagementWeak && noLivraison) {
        pointCritique = "Le client aimerait te voir plus engagé(e) et pouvoir constater une première livraison concrète rapidement.";
      } else if (isDemarrageWeak) {
        pointCritique = `Le démarrage pourrait être amélioré. ${formData.detailsDemarrage ? "Feedback client : " + formData.detailsDemarrage : ""}`;
      } else if (isClarteWeak) {
        pointCritique = `Certaines priorités semblent floues. ${formData.detailsClarte ? "Point à clarifier : " + formData.detailsClarte : "N'hésite pas à demander des précisions !"}`;
      } else if (isCollaborationWeak) {
        pointCritique = `La communication avec l'équipe pourrait être renforcée. ${formData.detailsCollaboration || "Pense à des points de synchro réguliers !"}`;
      } else if (isCriticalAccess) {
        pointCritique = "Tu n'as pas encore tous les accès nécessaires – ça bloque ta productivité. On va régler ça rapidement !";
      } else {
        pointCritique = "Quelques petits ajustements à faire pour que tout roule parfaitement.";
      }

      emailTalent = {
        subject: `Check-in J+14 – Un petit ajustement à faire 🚀`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient orange -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">🚀 Un petit ajustement à faire</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">Salut <strong>${talentName}</strong> ! 👋</p>
              
              <!-- Point positif Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #065f46;"><strong>Ce qui roule déjà :</strong> ${pointPositif}</p>
                  </td>
                </tr>
              </table>

              <!-- Ajustement Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e;"><strong>⚠️ Un ajustement rapide :</strong> ${pointCritique}</p>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #1e40af;"><strong>💬 On est là pour toi :</strong> ${accountManagerName} est dispo cette semaine si tu veux en parler.</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151; text-align: center; font-weight: 600;">
                Continue, tu assures ! 💪
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    } else if (isMineur) {
      const pointPositif = demarrageScore >= 4 && clarteScore >= 4 ? 
        "Ton démarrage et ta compréhension du brief sont excellents !" :
        collaborationScore >= 4 ? "Ta collaboration avec l'équipe est au top !" :
        "Tu as bien démarré cette mission !";

      emailTalent = {
        subject: `Check-in J+14 – Un micro-ajustement 📈`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient orange -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">📈 Un micro-ajustement</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">Salut <strong>${talentName}</strong> ! 👋</p>
              
              <!-- Point positif Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #065f46;"><strong>Ce qui roule déjà :</strong> ${pointPositif}</p>
                  </td>
                </tr>
              </table>

              <!-- Micro-ajustement Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 20px; color: #92400e;"><strong>💡 Un micro-ajustement :</strong> Le client a mentionné ce petit point :</p>
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e; font-style: italic;">"${formData.axesAmelioration || formData.sujetPrincipal}"</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">
                C'est vraiment mineur – juste un détail à prendre en compte pour que tout soit parfait.
              </p>

              <!-- Info Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #1e40af;"><strong>💬 On est là pour toi :</strong> Si tu as des questions, ${accountManagerName} est dispo.</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151; text-align: center; font-weight: 600;">
                Continue comme ça ! 💪
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    } else {
      emailTalent = {
        subject: `Check-in J+14 – Excellent démarrage ! 🎉`,
        body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header avec gradient purple -->
          <tr>
            <td style="background: linear-gradient(135deg, #6b84ff 0%, #7b56b3 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">🎉 Excellent démarrage !</h1>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #374151;">Salut <strong>${talentName}</strong>,</p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Bravo pour ton excellent démarrage sur cette mission ! 🎉
              </p>

              <!-- Success Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #065f46;">Le client est très satisfait de ton travail après ces 2 premières semaines.</p>
                  </td>
                </tr>
              </table>

              <!-- Scores -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">📊 Récapitulatif</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Démarrage : <strong>${demarrageScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Clarté du brief : <strong>${clarteScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Collaboration : <strong>${collaborationScore}/5</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">• Accès & outils : <strong>${formData.acces}</strong></td>
                </tr>
              </table>

              <!-- Success Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #065f46;">Tout roule ! Continue sur cette lancée.</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 24px; color: #374151;">
                Prochain check-in : <strong>J+30</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">L'équipe Talio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };
    }

    return {
      type: notificationType,
      slackMessage,
      emailEntreprise,
      emailTalent
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for Calendly booking requirement
    if (call === "oui" && !calendlyBooked) {
      setShowCalendlyWarning(true);
      // Scroll to the call section
      const callSection = document.getElementById('call-preference-section');
      if (callSection) {
        callSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Validation pour la logique conditionnelle
    if (parseInt(demarrage) <= 2 && !detailsDemarrage.trim()) {
      alert("Veuillez préciser les détails concernant le démarrage difficile.");
      return;
    }

    if (acces === "non" && !detailsAcces.trim()) {
      alert("Veuillez préciser les détails concernant les accès manquants.");
      return;
    }

    if (parseInt(clartebrief) <= 2 && !detailsClarte.trim()) {
      alert("Veuillez préciser les points à clarifier dans le brief.");
      return;
    }

    if (parseInt(collaboration) <= 2 && !detailsCollaboration.trim()) {
      alert("Veuillez préciser les détails concernant les problèmes de collaboration.");
      return;
    }

    if (parseInt(engagement) <= 2 && !commentaireEngagement.trim()) {
      alert("Veuillez préciser ce qui pourrait améliorer l'engagement du talent.");
      return;
    }

    if (premiereLivraison === "non" && !blocageLivraison.trim()) {
      alert("Veuillez préciser ce qui bloque la première livraison.");
      return;
    }

    if (blocage === "oui-bloquant" && !contexteBlocage.trim()) {
      alert("Veuillez décrire le contexte du blocage.");
      return;
    }

    if (blocage !== "non" && !sujetPrincipal) {
      alert("Veuillez sélectionner le sujet principal lorsqu'il y a un blocage.");
      return;
    }

    const formData = {
      demarrage,
      detailsDemarrage,
      commentaireDemarrage,
      acces,
      detailsAcces,
      clartebrief,
      detailsClarte,
      commentaireClarte,
      collaboration,
      detailsCollaboration,
      commentaireCollaboration,
      engagement,
      commentaireEngagement,
      premiereLivraison,
      blocageLivraison,
      chargeTravail,
      blocage,
      sujetPrincipal,
      axesAmelioration,
      contexteBlocage,
      call,
      upsell,
      successStory,
    };
    
    // Générer les notifications
    const notifs = generateNotifications(formData);
    setNotifications(notifs);
    
    // Préparer les données à envoyer au webhook
    const webhookData = {
      ...urlParams,
      form_data: formData,
      notifications: notifs,
      submission_date: new Date().toISOString()
    };
    
    // Envoyer au webhook si disponible
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })
      .then(response => {
        console.log('Webhook response:', response.status);
      })
      .catch(error => {
        console.error('Webhook error:', error);
      });
    }
    
    // Logger dans la console pour debug
    console.log("=== FORMULAIRE SOUMIS ===");
    console.log("Données:", formData);
    console.log("\n=== NOTIFICATIONS GÉNÉRÉES ===");
    console.log("Type:", notifs.type);
    console.log("\nSlack (AM):", notifs.slackMessage);
    console.log("\nEmail Entreprise:", notifs.emailEntreprise);
    console.log("\nEmail Talent:", notifs.emailTalent);
    
    // Afficher le message de confirmation
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    if (confirm("Êtes-vous sûr de vouloir annuler ? Toutes vos réponses seront perdues.")) {
      window.location.reload();
    }
  };

  const handleCopyData = () => {
    if (!notifications) return;
    
    const dataText = `
=== WORKFLOW CHECK-IN J+14 ===

TYPE DE NOTIFICATION: ${notifications.type.toUpperCase()}

--- SLACK ([Nom du Manager]) ---
${notifications.slackMessage}

--- EMAIL ENTREPRISE ---
Objet: ${notifications.emailEntreprise.subject}
${notifications.emailEntreprise.body}

--- EMAIL TALENT ---
Objet: ${notifications.emailTalent.subject}
${notifications.emailTalent.body}
    `.trim();
    
    navigator.clipboard.writeText(dataText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyIndividual = (type: string) => {
    if (!notifications) return;
    
    let textToCopy = "";
    
    if (type === "slack") {
      textToCopy = notifications.slackMessage;
    } else if (type === "email-entreprise") {
      textToCopy = `Objet: ${notifications.emailEntreprise.subject}\n\n${notifications.emailEntreprise.body}`;
    } else if (type === "email-talent") {
      textToCopy = `Objet: ${notifications.emailTalent.subject}\n\n${notifications.emailTalent.body}`;
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedState(type);
    setTimeout(() => setCopiedState(""), 2000);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setNotifications(null);
  };

  // Détection de problèmes critiques
  const hasCriticalIssue = 
    parseInt(demarrage) <= 2 || 
    acces === "non" || 
    parseInt(clartebrief) <= 2 ||
    parseInt(collaboration) <= 2 ||
    parseInt(engagement) <= 2 ||
    premiereLivraison === "non" ||
    chargeTravail === "surcharge" ||
    blocage === "oui-bloquant";

  const needsCall = 
    parseInt(demarrage) <= 2 || 
    parseInt(clartebrief) <= 2 || 
    parseInt(collaboration) <= 2 ||
    parseInt(engagement) <= 2 ||
    premiereLivraison === "non" ||
    chargeTravail === "surcharge" ||
    blocage === "oui-bloquant";

  // Check access - hidden parameter must be present
  if (!urlParams?.hidden) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-[600px] mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div 
              className="mb-6 p-8 rounded-2xl"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${TalioTheme.colors.error}20`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${TalioTheme.colors.error}10`
                }}
              >
                <AlertCircle 
                  size={40} 
                  style={{ color: TalioTheme.colors.error }} 
                />
              </div>
              <h1 
                className="text-2xl font-bold mb-3"
                style={{ color: TalioTheme.colors.textPrimary }}
              >
                Accès refusé
              </h1>
              <p 
                className="text-base mb-2"
                style={{ color: TalioTheme.colors.textSecondary }}
              >
                Vous n'avez pas l'autorisation d'accéder à ce formulaire.
              </p>
              <p 
                className="text-sm"
                style={{ color: TalioTheme.colors.textMuted }}
              >
                Veuillez utiliser le lien fourni dans votre invitation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-[600px] mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            {/* Context Badge - Startup 2026 style */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: TalioTheme.colors.primaryLight,
                  border: `1px solid ${TalioTheme.colors.primary}20`
                }}
              >
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  color: TalioTheme.colors.primary 
                }}>
                  👤 {urlParams?.talent_full_name || 'Nadia Berrada'}
                </span>
                <span style={{ 
                  fontSize: '13px', 
                  color: TalioTheme.colors.textSecondary 
                }}>
                  @
                </span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  color: TalioTheme.colors.textPrimary 
                }}>
                  {urlParams?.company_name || 'Acme Corp'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 style={CheckInFormStyles.mainTitle}>
                  Check-in J+14
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      className="flex items-center justify-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: TalioTheme.colors.primaryLight,
                        border: 'none',
                        cursor: 'help'
                      }}
                    >
                      <Info size={14} style={{ color: TalioTheme.colors.primary }} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p style={{ fontSize: '12px', maxWidth: '200px' }}>
                      Suivi CSM proactif - Workflow complet automatisé
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div 
              className="rounded-lg p-5"
              style={{
                backgroundColor: '#F5F7FA',
                border: '1px solid #E0E0E0',
                fontSize: '16px',
                color: '#333333',
                lineHeight: '1.5',
                marginTop: '20px',
                marginBottom: '20px'
              }}
            >
              Hey ! 👋 Petit check rapide pour s'assurer que tout roule avec{" "}
              <span style={{ fontWeight: 600, color: TalioTheme.colors.primary }}>{urlParams?.talent_full_name || "Nadia"}</span>. Ce formulaire prend <strong>2 min</strong> et permet à {urlParams?.account_manager_full_name || "votre AM"} d'intervenir vite si besoin. Vos réponses restent entre nous 🤝
            </div>

            {/* Alerte critique si problème détecté */}
            <AnimatePresence>
              {hasCriticalIssue && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-lg p-4 flex items-start gap-3"
                  style={{
                    backgroundColor: '#FFF3CD',
                    border: '2px solid #FF9900'
                  }}
                >
                  <AlertCircle size={20} style={{ color: '#FF9900', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '14px', color: '#856404' }}>
                    <strong>⚠️ Point d'attention critique détecté</strong> - {urlParams?.account_manager_full_name || "Votre AM"} prendra contact rapidement pour résoudre la situation. Un call est fortement recommandé.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" style={{ marginTop: '8px' }}>
            {/* Section 1 : Démarrage */}
            <section>
              <h2 
                className="mb-6" 
                style={CheckInFormStyles.sectionTitle}
              >
                Démarrage (santé globale)
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: parseInt(demarrage) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                  borderLeft: parseInt(demarrage) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Label 
                    className="block" 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#111111',
                      margin: 0
                    }}
                  >
                    Comment se passe le démarrage avec le talent ?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" style={{ cursor: 'help', border: 'none', background: 'none', padding: 0 }}>
                        <Info size={14} style={{ color: '#777777' }} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p style={{ fontSize: '12px' }}>1 = Difficile, 5 = Parfait</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <RadioGroup
                  value={demarrage}
                  onValueChange={handleDemarrageChange}
                  className="flex gap-4"
                >
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem 
                        value={value} 
                        id={`demarrage-${value}`}
                        className="border-[#0055FF] text-[#0055FF]"
                        style={{
                          width: '20px',
                          height: '20px'
                        }}
                      />
                      <Label
                        htmlFor={`demarrage-${value}`}
                        className="cursor-pointer"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 400, 
                          color: '#333333',
                          margin: 0
                        }}
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Trigger : Démarrage ≤3 */}
              <AnimatePresence>
                {parseInt(demarrage) <= 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Champ détails obligatoire si ≤2, optionnel si =3 */}
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #E0E0E0',
                        borderLeft: parseInt(demarrage) <= 2 ? '4px solid #FF4444' : '4px solid #FFB84D'
                      }}
                    >
                      <Label 
                        htmlFor={parseInt(demarrage) <= 2 ? "detailsDemarrage" : "commentaireDemarrage"}
                        className="block mb-3 flex items-center gap-2" 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#111111',
                          margin: 0,
                          marginBottom: '12px'
                        }}
                      >
                        {parseInt(demarrage) <= 2 ? (
                          <>Détails / Blocage démarrage <span style={{ color: '#FF0000' }}>*</span></>
                        ) : (
                          "Commentaire rapide (optionnel)"
                        )}
                      </Label>
                      <Textarea
                        id={parseInt(demarrage) <= 2 ? "detailsDemarrage" : "commentaireDemarrage"}
                        value={parseInt(demarrage) <= 2 ? detailsDemarrage : commentaireDemarrage}
                        onChange={(e) => parseInt(demarrage) <= 2 ? setDetailsDemarrage(e.target.value) : setCommentaireDemarrage(e.target.value)}
                        placeholder={parseInt(demarrage) <= 2 ? "Décrivez les difficultés rencontrées au démarrage..." : "Ex: Quelques ajustements nécessaires mais rien de bloquant"}
                        rows={3}
                        required={parseInt(demarrage) <= 2}
                        className="resize-none"
                        style={{
                          border: '1px solid #CCCCCC',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          color: '#333333',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    {/* Proposition de call si ≤2 */}
                    {parseInt(demarrage) <= 2 && (
                      <div 
                        className="rounded-lg p-4 flex items-center gap-3"
                        style={{
                          backgroundColor: '#FFF3CD',
                          border: '1px solid #FFE69C'
                        }}
                      >
                        <PhoneCall size={20} style={{ color: '#FF9900', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', color: '#856404', fontWeight: 600, margin: 0 }}>
                            Call recommandé
                          </p>
                          <p style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
                            Un point avec {urlParams?.account_manager_full_name || "votre AM"} est fortement conseillé pour débloquer la situation.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 2 : Accès & outils */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Accès & outils
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: acces === "non" ? '#FFCCCC' : '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: acces === "non" ? '2px solid #FF4444' : '1px solid #E0E0E0',
                  borderLeft: acces === "non" ? '4px solid #FF4444' : '1px solid #E0E0E0'
                }}
              >
                <Label 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  Les accès / outils nécessaires sont-ils OK ? (repo, Slack, emails, environnements, docs)
                </Label>
                <RadioGroup value={acces} onValueChange={handleAccesChange} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="oui" 
                      id="acces-oui"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="acces-oui" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Oui
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="partiel" 
                      id="acces-partiel"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="acces-partiel" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Partiel
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="non" 
                      id="acces-non"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="acces-non" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Non
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Trigger : Accès = Non */}
              <AnimatePresence>
                {acces === "non" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-lg p-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E0E0E0',
                      borderLeft: '4px solid #FF4444'
                    }}
                  >
                    <Label 
                      htmlFor="detailsAcces" 
                      className="block mb-3 flex items-center gap-2" 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#111111',
                        margin: 0,
                        marginBottom: '12px'
                      }}
                    >
                      Détails / Blocage accès <span style={{ color: '#FF0000' }}>*</span>
                    </Label>
                    <Textarea
                      id="detailsAcces"
                      value={detailsAcces}
                      onChange={(e) => setDetailsAcces(e.target.value)}
                      placeholder="Exemple : Pas d'accès au repo GitHub, compte Slack non créé..."
                      rows={3}
                      required
                      className="resize-none"
                      style={{
                        border: '1px solid #CCCCCC',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '14px',
                        color: '#333333',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 3 : Clarté du brief */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Clarté du brief
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: parseInt(clartebrief) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                  borderLeft: parseInt(clartebrief) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Label 
                    className="block" 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#111111',
                      margin: 0
                    }}
                  >
                    Le besoin et les priorités sont-ils clairs pour le talent ?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" style={{ cursor: 'help', border: 'none', background: 'none', padding: 0 }}>
                        <Info size={14} style={{ color: '#777777' }} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p style={{ fontSize: '12px' }}>1 = Confus, 5 = Parfaitement clair</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <RadioGroup
                  value={clartebrief}
                  onValueChange={handleClarteChange}
                  className="flex gap-4"
                >
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem 
                        value={value} 
                        id={`clarte-${value}`}
                        className="border-[#0055FF] text-[#0055FF]"
                        style={{
                          width: '20px',
                          height: '20px'
                        }}
                      />
                      <Label
                        htmlFor={`clarte-${value}`}
                        className="cursor-pointer"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 400, 
                          color: '#333333',
                          margin: 0
                        }}
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Trigger : Clarté ≤3 */}
              <AnimatePresence>
                {parseInt(clartebrief) <= 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Champ détails obligatoire si ≤2, optionnel si =3 */}
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #E0E0E0',
                        borderLeft: parseInt(clartebrief) <= 2 ? '4px solid #FF9900' : '4px solid #FFB84D'
                      }}
                    >
                      <Label 
                        htmlFor={parseInt(clartebrief) <= 2 ? "detailsClarte" : "commentaireClarte"}
                        className="block mb-3 flex items-center gap-2" 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#111111',
                          margin: 0,
                          marginBottom: '12px'
                        }}
                      >
                        {parseInt(clartebrief) <= 2 ? (
                          <>Détails / Points à clarifier <span style={{ color: '#FF0000' }}>*</span></>
                        ) : (
                          "Commentaire rapide (optionnel)"
                        )}
                      </Label>
                      <Textarea
                        id={parseInt(clartebrief) <= 2 ? "detailsClarte" : "commentaireClarte"}
                        value={parseInt(clartebrief) <= 2 ? detailsClarte : commentaireClarte}
                        onChange={(e) => parseInt(clartebrief) <= 2 ? setDetailsClarte(e.target.value) : setCommentaireClarte(e.target.value)}
                        placeholder={parseInt(clartebrief) <= 2 ? "Précisez les points du brief qui nécessitent des clarifications..." : "Ex: Quelques questions mais globalement clair"}
                        rows={3}
                        required={parseInt(clartebrief) <= 2}
                        className="resize-none"
                        style={{
                          border: '1px solid #CCCCCC',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          color: '#333333',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    {/* Suggestion call si ≤2 */}
                    {parseInt(clartebrief) <= 2 && (
                      <div 
                        className="rounded-lg p-4 flex items-center gap-3"
                        style={{
                          backgroundColor: '#FFF3CD',
                          border: '1px solid #FFE69C'
                        }}
                      >
                        <PhoneCall size={20} style={{ color: '#FF9900', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', color: '#856404', fontWeight: 600, margin: 0 }}>
                            Call suggéré
                          </p>
                          <p style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
                            Un call est suggéré pour aligner le brief et les priorités.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 4 : Collaboration */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Collaboration
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: parseInt(collaboration) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                  borderLeft: parseInt(collaboration) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
                }}
              >
                <Label 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  Communication & collaboration (rythme, réactivité, alignement)
                </Label>
                <RadioGroup
                  value={collaboration}
                  onValueChange={handleCollaborationChange}
                  className="flex gap-4"
                >
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem 
                        value={value} 
                        id={`collab-${value}`}
                        className="border-[#0055FF] text-[#0055FF]"
                        style={{
                          width: '20px',
                          height: '20px'
                        }}
                      />
                      <Label
                        htmlFor={`collab-${value}`}
                        className="cursor-pointer"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 400, 
                          color: '#333333',
                          margin: 0
                        }}
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Trigger : Collaboration ≤3 */}
              <AnimatePresence>
                {parseInt(collaboration) <= 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Champ détails obligatoire si ≤2, optionnel si =3 */}
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #E0E0E0',
                        borderLeft: parseInt(collaboration) <= 2 ? '4px solid #FF9900' : '4px solid #FFB84D'
                      }}
                    >
                      <Label 
                        htmlFor={parseInt(collaboration) <= 2 ? "detailsCollaboration" : "commentaireCollaboration"}
                        className="block mb-3 flex items-center gap-2" 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#111111',
                          margin: 0,
                          marginBottom: '12px'
                        }}
                      >
                        {parseInt(collaboration) <= 2 ? (
                          <>Détails / Blocage collaboration <span style={{ color: '#FF0000' }}>*</span></>
                        ) : (
                          "Commentaire rapide (optionnel)"
                        )}
                      </Label>
                      <Textarea
                        id={parseInt(collaboration) <= 2 ? "detailsCollaboration" : "commentaireCollaboration"}
                        value={parseInt(collaboration) <= 2 ? detailsCollaboration : commentaireCollaboration}
                        onChange={(e) => parseInt(collaboration) <= 2 ? setDetailsCollaboration(e.target.value) : setCommentaireCollaboration(e.target.value)}
                        placeholder={parseInt(collaboration) <= 2 ? "Décrivez les difficultés de communication ou collaboration..." : "Ex: La collaboration fonctionne, quelques points de synchro à améliorer"}
                        rows={3}
                        required={parseInt(collaboration) <= 2}
                        className="resize-none"
                        style={{
                          border: '1px solid #CCCCCC',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          color: '#333333',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    {/* Suggestion call si ≤2 */}
                    {parseInt(collaboration) <= 2 && (
                      <div 
                        className="rounded-lg p-4 flex items-center gap-3"
                        style={{
                          backgroundColor: '#FFF3CD',
                          border: '1px solid #FFE69C'
                        }}
                      >
                        <PhoneCall size={20} style={{ color: '#FF9900', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', color: '#856404', fontWeight: 600, margin: 0 }}>
                            Call suggéré
                          </p>
                          <p style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
                            Un point est suggéré pour améliorer la collaboration.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 5 : Engagement du talent */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Engagement & Motivation
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: parseInt(engagement) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                  borderLeft: parseInt(engagement) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Label 
                    className="block" 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#111111',
                      margin: 0
                    }}
                  >
                    À quel point le talent semble-t-il engagé et motivé ?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" style={{ cursor: 'help', border: 'none', background: 'none', padding: 0 }}>
                        <Info size={14} style={{ color: '#777777' }} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p style={{ fontSize: '12px' }}>1 = Désengagé, 5 = Très motivé</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <RadioGroup
                  value={engagement}
                  onValueChange={handleEngagementChange}
                  className="flex gap-4"
                >
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem 
                        value={value} 
                        id={`engagement-${value}`}
                        className="border-[#0055FF] text-[#0055FF]"
                        style={{
                          width: '20px',
                          height: '20px'
                        }}
                      />
                      <Label
                        htmlFor={`engagement-${value}`}
                        className="cursor-pointer"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 400, 
                          color: '#333333',
                          margin: 0
                        }}
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Trigger : Engagement ≤3 */}
              <AnimatePresence>
                {parseInt(engagement) <= 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #E0E0E0',
                        borderLeft: parseInt(engagement) <= 2 ? '4px solid #FF9900' : '4px solid #FFB84D'
                      }}
                    >
                      <Label 
                        htmlFor="commentaireEngagement" 
                        className="block mb-3" 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#111111',
                          margin: 0,
                          marginBottom: '12px'
                        }}
                      >
                        {parseInt(engagement) <= 2 ? "Qu'est-ce qui pourrait améliorer son engagement ? *" : "Commentaire rapide (optionnel)"}
                      </Label>
                      <Textarea
                        id="commentaireEngagement"
                        value={commentaireEngagement}
                        onChange={(e) => setCommentaireEngagement(e.target.value)}
                        placeholder="Décrivez ce qui pourrait améliorer l'engagement du talent..."
                        rows={3}
                        required={parseInt(engagement) <= 2}
                        className="resize-none"
                        style={{
                          border: '1px solid #CCCCCC',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          color: '#333333',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 6 : Première livraison */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Première valeur livrée
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: premiereLivraison === "non" ? '#FFCCCC' : '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: premiereLivraison === "non" ? '2px solid #FF4444' : '1px solid #E0E0E0',
                  borderLeft: premiereLivraison === "non" ? '4px solid #FF4444' : '1px solid #E0E0E0'
                }}
              >
                <Label 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  Le talent a-t-il déjà livré sa première contribution significative ?
                </Label>
                <RadioGroup value={premiereLivraison} onValueChange={handlePremiereLivraisonChange} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="oui" 
                      id="livraison-oui"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="livraison-oui" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Oui ✅
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="en-cours" 
                      id="livraison-encours"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="livraison-encours" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      En cours
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="non" 
                      id="livraison-non"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="livraison-non" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Non 🔴
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Trigger : Livraison = Non ou En cours */}
              <AnimatePresence>
                {(premiereLivraison === "non" || premiereLivraison === "en-cours") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-lg p-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E0E0E0',
                      borderLeft: premiereLivraison === "non" ? '4px solid #FF4444' : '4px solid #FFB84D'
                    }}
                  >
                    <Label 
                      htmlFor="blocageLivraison" 
                      className="block mb-3" 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#111111',
                        margin: 0,
                        marginBottom: '12px'
                      }}
                    >
                      {premiereLivraison === "non" ? "Qu'est-ce qui bloque la première livraison ? *" : "Quand est-elle prévue ? (optionnel)"}
                    </Label>
                    <Textarea
                      id="blocageLivraison"
                      value={blocageLivraison}
                      onChange={(e) => setBlocageLivraison(e.target.value)}
                      placeholder={premiereLivraison === "non" ? "Décrivez ce qui empêche la première livraison..." : "Ex: D'ici fin de semaine, sprint en cours..."}
                      rows={2}
                      required={premiereLivraison === "non"}
                      className="resize-none"
                      style={{
                        border: '1px solid #CCCCCC',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '14px',
                        color: '#333333',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 7 : Charge de travail */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Charge de travail
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: chargeTravail === "surcharge" ? '#FFCCCC' : '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: chargeTravail === "surcharge" ? '2px solid #FF4444' : chargeTravail === "sous-utilise" ? '2px solid #FFB84D' : '1px solid #E0E0E0',
                  borderLeft: chargeTravail === "surcharge" ? '4px solid #FF4444' : chargeTravail === "sous-utilise" ? '4px solid #FFB84D' : '1px solid #E0E0E0'
                }}
              >
                <Label 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  Comment évaluez-vous la charge de travail actuelle du talent ?
                </Label>
                <RadioGroup value={chargeTravail} onValueChange={handleChargeTravailChange} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="equilibre" 
                      id="charge-equilibre"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="charge-equilibre" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Équilibrée ✅
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="sous-utilise" 
                      id="charge-sous"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="charge-sous" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Sous-utilisé(e) ⚠️
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="surcharge" 
                      id="charge-sur"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="charge-sur" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Surchargé(e) 🔴
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Alerte pour sous-utilisation */}
              <AnimatePresence>
                {chargeTravail === "sous-utilise" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-lg p-4 flex items-start gap-3"
                    style={{
                      backgroundColor: '#FFF3CD',
                      border: '1px solid #FFE69C'
                    }}
                  >
                    <AlertCircle size={20} style={{ color: '#FF9900', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '14px', color: '#856404' }}>
                      <strong>💡 Opportunité d'upsell</strong> - Un talent sous-utilisé = opportunité d'extension de scope. {urlParams?.account_manager_full_name || "Votre AM"} pourra proposer des options au client.
                    </div>
                  </motion.div>
                )}
                {chargeTravail === "surcharge" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-lg p-4 flex items-start gap-3"
                    style={{
                      backgroundColor: '#FFCCCC',
                      border: '2px solid #FF4444'
                    }}
                  >
                    <AlertCircle size={20} style={{ color: '#FF0000', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '14px', color: '#721C24' }}>
                      <strong>🚨 ALERTE CRITIQUE</strong> - Risque de burnout immédiat. Un call urgent avec le talent est nécessaire pour réajuster la charge.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 8 : Blocage / Axes d'amélioration */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Blocage / Axes d'amélioration
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E0E0E0'
                }}
              >
                <Label 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  Y a-t-il un point à débloquer dès maintenant ?
                </Label>
                <RadioGroup value={blocage} onValueChange={handleBlocageChange} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="non" 
                      id="blocage-non"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="blocage-non" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Non
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="oui-mineur" 
                      id="blocage-mineur"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="blocage-mineur" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Oui, mineur
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="oui-bloquant" 
                      id="blocage-bloquant"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="blocage-bloquant" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Oui, bloquant
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sujet principal - Conditionnel si blocage */}
              <AnimatePresence>
                {blocage !== "non" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-lg p-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E0E0E0',
                      borderLeft: blocage === "oui-bloquant" ? '4px solid #FF4444' : '4px solid #FF9900'
                    }}
                  >
                    <Label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#111111',
                        margin: 0,
                        marginBottom: '12px'
                      }}
                    >
                      Quel est le sujet principal ?{" "}
                      <span style={{ color: '#FF0000' }}>*</span>
                    </Label>
                    <RadioGroup
                      value={sujetPrincipal}
                      onValueChange={setSujetPrincipal}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem 
                          value="acces" 
                          id="sujet-acces"
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label 
                          htmlFor="sujet-acces" 
                          className="cursor-pointer"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#333333',
                            margin: 0
                          }}
                        >
                          Accès / outils
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem 
                          value="brief" 
                          id="sujet-brief"
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label 
                          htmlFor="sujet-brief" 
                          className="cursor-pointer"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#333333',
                            margin: 0
                          }}
                        >
                          Brief / priorités
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem 
                          value="organisation" 
                          id="sujet-organisation"
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label 
                          htmlFor="sujet-organisation" 
                          className="cursor-pointer"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#333333',
                            margin: 0
                          }}
                        >
                          Organisation / communication
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem 
                          value="competences" 
                          id="sujet-competences"
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label 
                          htmlFor="sujet-competences" 
                          className="cursor-pointer"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#333333',
                            margin: 0
                          }}
                        >
                          Compétences / qualité
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem 
                          value="charge" 
                          id="sujet-charge"
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label 
                          htmlFor="sujet-charge" 
                          className="cursor-pointer"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#333333',
                            margin: 0
                          }}
                        >
                          Charge / disponibilité
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem 
                          value="autre" 
                          id="sujet-autre"
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label 
                          htmlFor="sujet-autre" 
                          className="cursor-pointer"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#333333',
                            margin: 0
                          }}
                        >
                          Autre
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Oui mineur → Axes d'amélioration (facultatif) */}
              <AnimatePresence>
                {blocage === "oui-mineur" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-lg p-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E0E0E0',
                      borderLeft: '4px solid #FF9900'
                    }}
                  >
                    <Label 
                      htmlFor="axesAmelioration" 
                      className="block mb-3" 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#111111',
                        margin: 0,
                        marginBottom: '12px'
                      }}
                    >
                      Détails / Axes d'amélioration pour le talent (facultatif)
                    </Label>
                    <Textarea
                      id="axesAmelioration"
                      value={axesAmelioration}
                      onChange={(e) => setAxesAmelioration(e.target.value)}
                      placeholder="Sur quoi le talent peut progresser ou ajuster son travail ?"
                      rows={3}
                      className="resize-none"
                      style={{
                        border: '1px solid #CCCCCC',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '14px',
                        color: '#333333',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Oui bloquant → Contexte du blocage (obligatoire) + call direct */}
              <AnimatePresence>
                {blocage === "oui-bloquant" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Champ obligatoire */}
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #E0E0E0',
                        borderLeft: '4px solid #FF4444'
                      }}
                    >
                      <Label 
                        htmlFor="contexteBlocage" 
                        className="block mb-3" 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#111111',
                          margin: 0,
                          marginBottom: '12px'
                        }}
                      >
                        Détails / Contexte du blocage <span style={{ color: '#FF0000' }}>*</span>
                      </Label>
                      <Textarea
                        id="contexteBlocage"
                        value={contexteBlocage}
                        onChange={(e) => setContexteBlocage(e.target.value)}
                        placeholder="Décrivez le contexte et l'impact du blocage en 1–2 phrases..."
                        rows={3}
                        required
                        className="resize-none"
                        style={{
                          border: '1px solid #CCCCCC',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          color: '#333333',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    {/* Bouton call direct Calendly */}
                    <a
                      href="https://calendly.com/alouanihatim01/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg p-4 transition-shadow hover:shadow-md"
                      style={{
                        backgroundColor: '#FF4444',
                        border: '2px solid #FF0000',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      <Calendar size={18} />
                      🚨 Blocage critique - Réserver un call immédiat avec {urlParams?.account_manager_full_name || "votre AM"}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 6 : Call rapide */}
            <section id="call-preference-section">
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Point d'échange
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E0E0E0'
                }}
              >
                <Label 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  🗓️ Souhaitez-vous un point avec {urlParams?.account_manager_full_name || "votre AM"} pour optimiser la collaboration ? (15 min)
                </Label>
                <RadioGroup value={call} onValueChange={setCall} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="oui" 
                      id="call-oui"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="call-oui" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Oui
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem 
                      value="non" 
                      id="call-non"
                      className="border-[#0055FF] text-[#0055FF]"
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    <Label 
                      htmlFor="call-non" 
                      className="cursor-pointer"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#333333',
                        margin: 0
                      }}
                    >
                      Non
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Bouton Calendly direct si Oui */}
              <AnimatePresence>
                {call === "oui" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCalendlyBooked(true);
                        setShowCalendlyWarning(false);
                        // @ts-ignore - Calendly is loaded via script
                        if (window.Calendly) {
                          // @ts-ignore
                          window.Calendly.initPopupWidget({
                            url: urlParams?.calendly_link || 'https://calendly.com/alouanihatim01/30min'
                          });
                        }
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg p-4 transition-shadow hover:shadow-md w-full"
                      style={{
                        backgroundColor: calendlyBooked ? '#10b981' : '#E8F0FE',
                        border: calendlyBooked ? '2px solid #059669' : '2px solid #0055FF',
                        color: calendlyBooked ? '#FFFFFF' : '#0055FF',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {calendlyBooked ? (
                        <>
                          <Check size={18} />
                          Créneau réservé ✓
                        </>
                      ) : (
                        <>
                          <Calendar size={18} />
                          Réserver un créneau avec {urlParams?.account_manager_full_name || "votre AM"} (15 min)
                        </>
                      )}
                    </button>

                    {/* Warning message */}
                    <AnimatePresence>
                      {showCalendlyWarning && !calendlyBooked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-2 rounded-lg p-3"
                          style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fca5a5',
                            marginTop: '12px'
                          }}
                        >
                          <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '14px', color: '#dc2626', fontWeight: 500 }}>
                            Veuillez réserver un créneau avec {urlParams?.account_manager_full_name || "votre AM"} avant d'envoyer le formulaire.
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section 7 : Success Story */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #00CC88',
                  paddingBottom: '12px'
                }}
              >
                🎉 Ce qui marche bien
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E0E0E0',
                  borderLeft: '4px solid #00CC88'
                }}
              >
                <Label 
                  htmlFor="successStory" 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  Qu'est-ce qui a super bien fonctionné ces 2 semaines ? (Compétence du talent, processus, livrable...)
                </Label>
                <Textarea
                  id="successStory"
                  value={successStory}
                  onChange={(e) => setSuccessStory(e.target.value)}
                  placeholder="Ex: Excellente proactivité, livraison rapide du prototype, très bonne communication..."
                  rows={3}
                  className="resize-none"
                  style={{
                    border: '1px solid #CCCCCC',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '14px',
                    color: '#333333',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
            </section>

            {/* Section 8 : Besoins complémentaires (ex-upsell) */}
            <section>
              <h2 
                className="mb-6" 
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#111111',
                  borderBottom: '2px solid #0055FF',
                  paddingBottom: '12px'
                }}
              >
                Besoins complémentaires
              </h2>

              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E0E0E0'
                }}
              >
                <Label 
                  htmlFor="upsell" 
                  className="block mb-3" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0,
                    marginBottom: '12px'
                  }}
                >
                  💡 Avez-vous identifié d'autres besoins où Nadia pourrait vous aider ? (Extension scope, autre profil, renfort...)
                </Label>
                <Textarea
                  id="upsell"
                  value={upsell}
                  onChange={(e) => setUpsell(e.target.value)}
                  placeholder="Ex: Renfort Dev souhaité à partir du 15/02, ou besoin d'un designer en complément..."
                  rows={3}
                  className="resize-none"
                  style={{
                    border: '1px solid #CCCCCC',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '14px',
                    color: '#333333',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
            </section>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                type="submit"
                className="flex-1 sm:flex-initial transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: '#0055FF',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none'
                }}
              >
                Envoyer mon feedback
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-initial transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#333333',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid #0055FF'
                }}
              >
                Annuler
              </Button>
            </div>
          </form>

          {/* Footer */}
          <footer className="mt-12 pt-8" style={{ borderTop: '1px solid #E0E0E0' }}>
            <div className="space-y-4">
              {/* Contact */}
              <div className="flex items-center gap-2" style={{ fontSize: '12px' }}>
                <span style={{ color: '#777777' }}>Contact :</span>
                <a
                  href="mailto:csm@taliotalent.com"
                  style={{ color: '#0055FF' }}
                  className="hover:underline"
                >
                  csm@taliotalent.com
                </a>
              </div>

              {/* Liens utiles */}
              <div className="flex flex-wrap gap-3" style={{ fontSize: '12px' }}>
                <a 
                  href="/" 
                  style={{ color: '#777777' }}
                  className="hover:underline"
                >
                  Accueil
                </a>
                <span style={{ color: '#CCCCCC' }}>•</span>
                <a 
                  href="/temoignages" 
                  style={{ color: '#777777' }}
                  className="hover:underline"
                >
                  Témoignages
                </a>
                <span style={{ color: '#CCCCCC' }}>•</span>
                <a 
                  href="/blog" 
                  style={{ color: '#777777' }}
                  className="hover:underline"
                >
                  Blog
                </a>
                <span style={{ color: '#CCCCCC' }}>•</span>
                <a
                  href="/trouver-talent"
                  style={{ color: '#0055FF', fontWeight: 600 }}
                  className="hover:underline"
                >
                  Trouvez votre talent →
                </a>
                <span style={{ color: '#CCCCCC' }}>•</span>
                <a 
                  href="/privacy" 
                  style={{ color: '#777777' }}
                  className="hover:underline"
                >
                  Privacy
                </a>
              </div>
            </div>
          </footer>
        </div>

        {/* Message de confirmation après soumission */}
        <AnimatePresence>
          {formSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setFormSubmitted(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-lg w-full text-center relative overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Header avec gradient */}
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #0055FF 0%, #00CC88 100%)',
                    padding: '32px 24px',
                    position: 'relative'
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setFormSubmitted(false)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <X size={20} style={{ color: '#FFFFFF' }} />
                  </button>

                  {/* Icône de succès animée */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-4"
                  >
                    <div 
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Check size={48} style={{ color: '#00CC88', strokeWidth: 3 }} />
                    </div>
                  </motion.div>

                  {/* Titre */}
                  <h2 style={{ 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    color: '#FFFFFF',
                    marginBottom: '8px',
                    letterSpacing: '-0.5px'
                  }}>
                    Check-in enregistré ! 🎉
                  </h2>
                  
                  <p style={{ 
                    fontSize: '16px', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.5'
                  }}>
                    Merci pour votre retour
                  </p>
                </div>

                {/* Contenu principal */}
                <div style={{ padding: '32px 24px' }}>
                  {/* Section Prochaines étapes */}
                  <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#111111',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#E8F0FE',
                        color: '#0055FF',
                        fontSize: '14px',
                        fontWeight: 700
                      }}>✓</span>
                      Prochaines étapes
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Étape 1 */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E0E0E0'
                      }}>
                        <span style={{ fontSize: '20px', lineHeight: '1' }}>📧</span>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111', margin: '0 0 4px 0' }}>
                            Confirmation par email
                          </p>
                          <p style={{ fontSize: '13px', color: '#666666', margin: 0, lineHeight: '1.4' }}>
                            Vous allez recevoir un email de confirmation dans quelques minutes
                          </p>
                        </div>
                      </div>

                      {call === "oui" && (
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          padding: '12px',
                          backgroundColor: '#E8F0FE',
                          borderRadius: '8px',
                          border: '1px solid #0055FF'
                        }}>
                          <span style={{ fontSize: '20px', lineHeight: '1' }}>📞</span>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0055FF', margin: '0 0 4px 0' }}>
                              Call programmé
                            </p>
                            <p style={{ fontSize: '13px', color: '#0055FF', margin: 0, lineHeight: '1.4' }}>
                              {urlParams?.account_manager_full_name || 'Votre AM'} vous contactera selon le créneau réservé
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Étape 2 */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E0E0E0'
                      }}>
                        <span style={{ fontSize: '20px', lineHeight: '1' }}>⏰</span>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111', margin: '0 0 4px 0' }}>
                            Suivi sous 48h max
                          </p>
                          <p style={{ fontSize: '13px', color: '#666666', margin: 0, lineHeight: '1.4' }}>
                            {urlParams?.account_manager_full_name || 'Votre AM'} reviendra vers vous d'ici <strong style={{ color: '#0055FF' }}>mercredi prochain</strong>
                          </p>
                        </div>
                      </div>

                      {/* Étape 3 - Info sur le talent */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E0E0E0'
                      }}>
                        <span style={{ fontSize: '20px', lineHeight: '1' }}>🤝</span>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111', margin: '0 0 4px 0' }}>
                            Accompagnement continu
                          </p>
                          <p style={{ fontSize: '13px', color: '#666666', margin: 0, lineHeight: '1.4' }}>
                            Nous suivons {urlParams?.talent_full_name || 'le talent'} de près pour assurer une collaboration réussie
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badge SLA */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '100px',
                      backgroundColor: '#FFF7ED',
                      border: '1px solid #FED7AA',
                      marginBottom: '24px'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#EA580C' }}>
                      ⚡ SLA Talio : Réponse garantie sous 48h
                    </span>
                  </div>

                  {/* Bouton de fermeture */}
                  <button
                    onClick={() => setFormSubmitted(false)}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      backgroundColor: '#0055FF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 6px rgba(0, 85, 255, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0044CC';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 85, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0055FF';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 85, 255, 0.2)';
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Modèle d'email */}
      <EmailTemplateModal
        isOpen={showEmailTemplate}
        onClose={() => setShowEmailTemplate(false)}
        talentName={urlParams?.talent_full_name || "Nadia Berrada"}
        entrepriseName={urlParams?.company_name || "[Entreprise]"}
        formLink={formLink}
      />
    </TooltipProvider>
  );
}

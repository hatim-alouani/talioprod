'use client';

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Textarea } from "@/app/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Info, Calendar, AlertCircle, PhoneCall, Copy, Check, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EmailTemplateModalTalent } from "@/app/components/email-template-modal-talent";
import { TalioTheme } from "@/config/talio-theme";
import { CheckInFormStyles } from "@/styles/checkin-form-styles";

interface NotificationPreview {
  type: "critical" | "warning" | "upsell" | "all-good";
  slackMessage: string;
  emailAM: {
    subject: string;
    body: string;
  };
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
}

interface CheckInFormTalentProps {
  urlParams?: UrlParams;
  webhookUrl?: string;
}

export function CheckInFormTalent({ urlParams, webhookUrl }: CheckInFormTalentProps = {}) {
  // États du formulaire
  const [overallFeeling, setOverallFeeling] = useState("4");
  const [detailsFeeling, setDetailsFeeling] = useState("");
  const [commentaireFeeling, setCommentaireFeeling] = useState("");
  const [accessStatus, setAccessStatus] = useState("oui");
  const [accessMissingDetails, setAccessMissingDetails] = useState("");
  const [scopeClarity, setScopeClarity] = useState("4");
  const [detailsScopeClarity, setDetailsScopeClarity] = useState("");
  const [commentaireScopeClarity, setCommentaireScopeClarity] = useState("");
  const [clientCommunication, setClientCommunication] = useState("4");
  const [detailsCommunication, setDetailsCommunication] = useState("");
  const [commentaireCommunication, setCommentaireCommunication] = useState("");
  const [firstDeliveryStatus, setFirstDeliveryStatus] = useState("en-cours");
  const [deliveryBlockageDetails, setDeliveryBlockageDetails] = useState("");
  const [workloadStatus, setWorkloadStatus] = useState("equilibree");
  const [shortTermRisk, setShortTermRisk] = useState("non");
  const [riskType, setRiskType] = useState("");
  const [riskDetails, setRiskDetails] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");
  const [needCall, setNeedCall] = useState("non");
  const [openFeedback, setOpenFeedback] = useState("");
  const [successStory, setSuccessStory] = useState("");
  
  // États pour le récapitulatif
  const [showSummary, setShowSummary] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreview | null>(null);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [copiedState, setCopiedState] = useState<"slack" | "email-am" | "email-entreprise" | "email-talent" | null>(null);
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormLink(window.location.href);
    }
  }, []);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handlers avec réinitialisation automatique
  const handleFeelingChange = (value: string) => {
    setOverallFeeling(value);
    if (parseInt(value) > 3) {
      setDetailsFeeling("");
      setCommentaireFeeling("");
    }
  };

  const handleAccessStatusChange = (value: string) => {
    setAccessStatus(value);
    if (value === "oui") {
      setAccessMissingDetails("");
    }
  };

  const handleScopeClarityChange = (value: string) => {
    setScopeClarity(value);
    if (parseInt(value) > 3) {
      setDetailsScopeClarity("");
      setCommentaireScopeClarity("");
    }
  };

  const handleCommunicationChange = (value: string) => {
    setClientCommunication(value);
    if (parseInt(value) > 3) {
      setDetailsCommunication("");
      setCommentaireCommunication("");
    }
  };

  const handleFirstDeliveryChange = (value: string) => {
    setFirstDeliveryStatus(value);
    if (value !== "non") {
      setDeliveryBlockageDetails("");
    }
  };

  const handleRiskChange = (value: string) => {
    setShortTermRisk(value);
    if (value === "non") {
      setRiskType("");
      setRiskDetails("");
    }
  };

  // Détection du problème critique
  const hasCriticalIssue = 
    parseInt(overallFeeling) <= 2 ||
    accessStatus === "non" ||
    parseInt(scopeClarity) <= 2 ||
    parseInt(clientCommunication) <= 2 ||
    firstDeliveryStatus === "non" ||
    workloadStatus === "trop-elevee" ||
    shortTermRisk === "oui-bloquant";

  // 🎯 LOGIQUE EXPERTE CSM
  const getTriggerType = (): "critical" | "warning" | "upsell" | "all-good" => {
    // CRITIQUE
    if (
      parseInt(overallFeeling) <= 2 ||
      accessStatus === "non" ||
      firstDeliveryStatus === "non" ||
      workloadStatus === "trop-elevee" ||
      shortTermRisk === "oui-bloquant"
    ) {
      return "critical";
    }

    // UPSELL
    if (
      workloadStatus === "trop-faible" ||
      openFeedback.toLowerCase().includes("montée") ||
      openFeedback.toLowerCase().includes("extension") ||
      openFeedback.toLowerCase().includes("scope")
    ) {
      return "upsell";
    }

    // WARNING
    if (
      parseInt(overallFeeling) === 3 ||
      accessStatus === "partiel" ||
      parseInt(scopeClarity) <= 3 ||
      parseInt(clientCommunication) <= 3 ||
      shortTermRisk === "oui-mineur"
    ) {
      return "warning";
    }

    return "all-good";
  };

  const generateNotifications = (formData: any): NotificationPreview => {
    const triggerType = getTriggerType();
    const talentName = urlParams?.talent_full_name || "Nadia Berrada";
    const companyName = urlParams?.company_name || "Acme Corp";
    const amName = urlParams?.account_manager_full_name || "Mehdi";
    const calendlyLink = urlParams?.calendly_link || "https://calendly.com/alouanihatim01/30min";

    // Détection des red flags
    const redFlags: string[] = [];
    
    if (parseInt(overallFeeling) <= 2) redFlags.push(`Ressenti catastrophique (${overallFeeling}/5) - TALENT EN DÉTRESSE`);
    if (parseInt(overallFeeling) === 3) redFlags.push(`Ressenti mitigé (${overallFeeling}/5)`);
    if (accessStatus === "non") redFlags.push(`ACCÈS CRITIQUES MANQUANTS - Talent bloqué techniquement`);
    if (accessStatus === "partiel") redFlags.push(`Accès partiels manquants: ${accessMissingDetails || "à préciser"}`);
    if (parseInt(scopeClarity) <= 2) redFlags.push(`Clarté du scope très faible (${scopeClarity}/5) - Talent ne sait pas quoi faire`);
    if (parseInt(scopeClarity) === 3) redFlags.push(`Scope peu clair (${scopeClarity}/5)`);
    if (firstDeliveryStatus === "non") redFlags.push(`PREMIÈRE LIVRAISON BLOQUÉE - ${deliveryBlockageDetails || "Raison non précisée"}`);
    if (parseInt(clientCommunication) <= 2) redFlags.push(`Communication client catastrophique (${clientCommunication}/5)`);
    if (parseInt(clientCommunication) === 3) redFlags.push(`Communication client difficile (${clientCommunication}/5)`);
    if (workloadStatus === "trop-elevee") redFlags.push(`RISQUE BURNOUT - Charge de travail excessive`);
    if (workloadStatus === "trop-faible") redFlags.push(`Charge faible - Talent sous-utilisé (opportunité upsell)`);
    if (shortTermRisk === "oui-bloquant") redFlags.push(`RISQUE COURT TERME BLOQUANT - Type: ${riskType || "Non précisé"}`);
    if (shortTermRisk === "oui-mineur") redFlags.push(`Risque mineur identifié - Type: ${riskType || "Non précisé"}`);
    
    // ✅ NOUVELLE LOGIQUE 1 : Combo "Équilibrée" + "Pas de livraison"
    const isEquilibreButNoDelivery = workloadStatus === "equilibree" && firstDeliveryStatus === "non";
    if (isEquilibreButNoDelivery) redFlags.push(`⚠️ Charge équilibrée mais pas de livraison → Talent bloqué ou mal aligné ?`);
    
    // ✅ NOUVELLE LOGIQUE 2 : Tous les scores à 3/5
    const allScoresAre3 = parseInt(overallFeeling) === 3 && parseInt(scopeClarity) === 3 && parseInt(clientCommunication) === 3;
    if (allScoresAre3) redFlags.push(`⚠️ Tous les scores sont à 3/5 → Signe de 'politeness bias' → Creuser en call`);
    
    // ✅ NOUVELLE LOGIQUE 3 : Call demandé SANS problème détecté
    const hasNoProblemDetected = parseInt(overallFeeling) >= 4 && parseInt(scopeClarity) >= 4 && parseInt(clientCommunication) >= 4 && accessStatus === "oui" && firstDeliveryStatus !== "non" && workloadStatus === "equilibree" && shortTermRisk === "non";
    const callWithoutIssue = needCall === "oui" && hasNoProblemDetected;
    
    if (needCall === "oui") {
      if (callWithoutIssue) {
        redFlags.push(`TALENT DEMANDE UN APPEL sans problème apparent → 💡 Peut cacher quelque chose → PRIORISER`);
      } else {
        redFlags.push(`TALENT DEMANDE UN APPEL - Support requis`);
      }
    }

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

    switch (triggerType) {
      case "critical":
        return {
          type: "critical",
          slackMessage: JSON.stringify({
            text: `🚨 ALERTE TALENT ${urlParams?.jshow || 'J+14'} — Intervention urgente requise`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `🚨 ALERTE TALENT ${urlParams?.jshow || 'J+14'} — Intervention urgente requise`
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
                    text: `*🏢 Entreprise:*\n${companyName}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*📊 Score global:*\n${overallFeeling}/5`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*⚠️ Risque:*\n${shortTermRisk}`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `🔴 *Points critiques détectés:*\n${redFlags.filter(f => !f.includes('opportunité')).map(flag => `• ${flag}`).join('\n')}`
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*📋 Détails:*\n• Ressenti global: *${overallFeeling}/5*\n• Accès/Outils: *${accessStatus}*${accessMissingDetails ? `\n  → ${accessMissingDetails}` : ''}\n• Clarté scope: *${scopeClarity}/5*${detailsScopeClarity ? `\n  → ${detailsScopeClarity}` : ''}\n• Communication client: *${clientCommunication}/5*${detailsCommunication ? `\n  → ${detailsCommunication}` : ''}\n• Première livraison: *${firstDeliveryStatus}*${deliveryBlockageDetails ? `\n  → ${deliveryBlockageDetails}` : ''}\n• Charge travail: *${workloadStatus}*\n• Risque court terme: *${shortTermRisk}*${riskType ? `\n  → Type: ${riskType}` : ''}`
                }
              },
              ...(riskDetails ? [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*🔍 Contexte du risque:*\n"${riskDetails}"`
                }
              }] : []),
              ...(openFeedback ? [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*💬 Feedback du talent:*\n"${openFeedback}"`
                }
              }] : []),
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `📞 *TALENT DEMANDE UN APPEL* — Calendly partagé\n\n*Action requise:* Call urgent avec ${talentName} + potentiel alignement avec ${companyName}`
                }
              }
            ]
          }),
          emailAM: {
            subject: `URGENT — ${talentName} en difficulté chez ${companyName} (${urlParams?.jshow || 'J+14'})`,
            body: wrapEmailHTML(
              `URGENT — ${talentName} en difficulté`,
              `
                <p style="margin:0 0 18px 0;">Bonjour <strong>${amName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  <strong>ALERTE CRITIQUE</strong> détectée sur le check-in ${urlParams?.jshow || 'J+14'} de <strong>${talentName}</strong> chez ${companyName}.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#fee;border-radius:8px;border:1px solid #fca;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#7f1d1d;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        🔴 Points critiques
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        ${redFlags.filter(f => !f.includes('opportunité')).map(flag => `• ${flag}`).join('<br>')}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        📊 Réponses clés
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        • Ressenti global: <strong>${overallFeeling}/5</strong><br>
                        • Accès: <strong>${accessStatus}</strong>${accessMissingDetails ? `<br>  → Détails: ${accessMissingDetails}` : ''}<br>
                        • Clarté scope: <strong>${scopeClarity}/5</strong>${detailsScopeClarity ? `<br>  → ${detailsScopeClarity}` : ''}<br>
                        • Communication client: <strong>${clientCommunication}/5</strong>${detailsCommunication ? `<br>  → ${detailsCommunication}` : ''}<br>
                        • Première livraison: <strong>${firstDeliveryStatus}</strong>${deliveryBlockageDetails ? `<br>  → Blocage: ${deliveryBlockageDetails}` : ''}<br>
                        • Charge: <strong>${workloadStatus}</strong><br>
                        • Risque: <strong>${shortTermRisk}</strong>${riskType ? ` (${riskType})` : ''}
                      </div>
                    </td>
                  </tr>
                </table>
                ${riskDetails ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        🔍 Contexte du risque
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;font-style:italic;">
                        "${riskDetails}"
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                ${openFeedback ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💬 Feedback
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;font-style:italic;">
                        "${openFeedback}"
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                ${needCall === "oui" ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#dbeafe;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#2563eb;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <strong>⚠️ ${talentName} a demandé un support</strong> — Calendly partagé.
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#fee;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#dc2626;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">⚡ Actions recommandées</div>
                        <div style="margin:0;">
                          1. Call avec ${talentName} sous 24h maximum<br>
                          2. Comprendre la source du blocage<br>
                          3. Débloquer les accès/outils manquants si applicable<br>
                          4. Évaluer si intervention côté ${companyName} nécessaire${workloadStatus === "trop-elevee" ? '<br>5. ⚠️ ATTENTION BURNOUT — Revoir le scope/charge immédiatement' : ''}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 14px 0;">Merci d'intervenir rapidement,</p>
              `,
              'linear-gradient(90deg,#ef4444 0%, #dc2626 100%)',
              '🚨'
            )
          },
          emailEntreprise: {
            subject: `Check-in ${urlParams?.jshow || 'J+14'} — ${talentName} : Quelques ajustements nécessaires`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#f59e0b;background:linear-gradient(90deg,#f59e0b 0%, #f97316 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  Check-in ${urlParams?.jshow || 'J+14'} — ${talentName}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Bonjour,</p>
                <p style="margin:0 0 16px 0;">
                  Nous venons de faire le point avec <strong>${talentName}</strong> sur ses 2 premières semaines
                  chez <strong>${companyName}</strong>.
                </p>
                <p style="margin:0 0 16px 0;">
                  <strong>Bonne nouvelle :</strong> ${talentName} est motivé·e et impliqué·e dans la mission.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#fff7ed;border-radius:8px;border:1px solid #fed7aa;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#7c2d12;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        ⚠️ Points d'attention identifiés
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        ${accessStatus !== "oui" ? `• Quelques accès/outils sont encore à débloquer pour une productivité optimale<br>` : ""}${parseInt(scopeClarity) <= 3 ? `• Certaines priorités mériteraient d'être clarifiées pour maximiser l'impact<br>` : ""}${parseInt(clientCommunication) <= 3 ? `• La fréquence ou le format des échanges pourrait être ajusté<br>` : ""}${firstDeliveryStatus === "non" ? `• La première livraison nécessite quelques ajustements pour être finalisée<br>` : ""}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        🤝 Ce qu'on met en place
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        De notre côté, nous allons échanger avec ${talentName} pour débloquer ces points rapidement.
                        ${accessStatus !== "oui" || parseInt(scopeClarity) <= 3 ? `<br><br>Si besoin, nous proposons un point d'alignement rapide à 3 pour s'assurer que tout le monde est bien synchronisé.` : ""}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#ecfeff;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#06b6d4;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">📌 Votre rôle</div>
                        <div style="margin:0;">
                          ${accessStatus !== "oui" ? `• Finaliser les accès manquants dès que possible<br>` : ""}${parseInt(scopeClarity) <= 3 ? `• Clarifier les priorités immédiates avec ${talentName}<br>` : ""}${parseInt(clientCommunication) <= 3 ? `• Maintenir des points réguliers (idéalement 2-3x/semaine en phase de démarrage)<br>` : ""}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px 0;">
                  Nous restons à votre disposition pour faciliter cette collaboration. N'hésitez pas si vous souhaitez
                  un point avec nous.
                </p>
                <p style="margin:0 0 14px 0;">Merci pour votre confiance,</p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0;color:#6b7280;">csm@taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          },
          emailTalent: {
            subject: `On est là pour t'aider 💪`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#6b84ff;background:linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  On est là pour t'aider 💪
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Salut <strong>${talentName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Merci pour ton retour honnête sur ton démarrage avec <strong>${companyName}</strong>.
                </p>
                <p style="margin:0 0 16px 0;">
                  J'ai bien noté les points que tu as mentionnés et je vais intervenir rapidement pour débloquer
                  la situation.
                </p>
                ${needCall === "oui" ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#dbeafe;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#2563eb;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <strong>👉 Tu as demandé un échange</strong> — tu trouveras un lien Calendly dans ta page
                        de confirmation pour qu'on puisse en parler de vive voix.
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <p style="margin:0 0 16px 0;">
                  Je te tiens au courant dès que j'ai avancé de mon côté.
                </p>
                ${workloadStatus === "trop-elevee" ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#fff7ed;border-radius:6px;border:1px solid #fed7aa;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#7c2d12;font-size:15px;line-height:22px;">
                        <strong>⚠️ Important:</strong> J'ai vu que la charge est élevée. On va ajuster ça ensemble
                        pour que ce soit soutenable.
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <p style="margin:0 0 16px 0;">Courage et à très vite,</p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0 0 6px 0;color:#6b7280;font-size:14px;">csm@taliotalent.com</p>
                <p style="margin:0;color:#6b7280;font-size:14px;">www.taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          }
        };

      case "upsell":
        return {
          type: "upsell",
          slackMessage: JSON.stringify({
            text: `💡 OPPORTUNITÉ UPSELL DÉTECTÉE — Talent sous-utilisé`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `💡 OPPORTUNITÉ UPSELL DÉTECTÉE — Talent sous-utilisé`
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
                    text: `*🏢 Entreprise:*\n${companyName}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*📊 Score global:*\n${overallFeeling}/5`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*⚖️ Charge:*\n${workloadStatus}`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `💚 *Signaux positifs:*\n${workloadStatus === "trop-faible" ? "• Charge de travail trop faible (talent sous-utilisé)\n" : ""}• Ressenti global: *${overallFeeling}/5*\n• Communication client: *${clientCommunication}/5*\n• Première livraison: *${firstDeliveryStatus}*`
                }
              },
              ...(openFeedback ? [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*💬 Feedback Talent:*\n"${openFeedback}"`
                }
              }] : []),
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `🎯 *Action recommandée:* Explorer montée en scope / extension avec ${companyName}`
                }
              }
            ]
          }),
          emailAM: {
            subject: `💡 Opportunité Upsell — ${talentName} chez ${companyName}`,
            body: wrapEmailHTML(
              `💡 Opportunité Upsell — ${talentName}`,
              `
                <p style="margin:0 0 18px 0;">Bonjour <strong>${amName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Bonne nouvelle : une <strong>opportunité d'upsell</strong> a été détectée sur le check-in
                  ${urlParams?.jshow || 'J+14'} de <strong>${talentName}</strong>.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#14532d;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💚 Signaux positifs
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        • Charge actuelle: <strong>${workloadStatus}</strong>${workloadStatus === "trop-faible" ? "<br>  → Talent sous-utilisé, capacité disponible" : ""}<br>
                        • Ressenti global: <strong>${overallFeeling}/5</strong><br>
                        • Communication client: <strong>${clientCommunication}/5</strong><br>
                        • Première livraison: <strong>${firstDeliveryStatus}</strong>
                      </div>
                    </td>
                  </tr>
                </table>
                ${openFeedback ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💬 Feedback du Talent
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;font-style:italic;">
                        "${openFeedback}"
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#ecfeff;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#06b6d4;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">📌 Actions recommandées</div>
                        <div style="margin:0;">
                          1. Échanger avec ${talentName} sur sa disponibilité<br>
                          2. Identifier les besoins additionnels chez ${companyName}<br>
                          3. Proposer une extension de scope / montée en charge
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 14px 0;">Excellente opportunité à exploiter ! 🎯</p>
              `,
              'linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%)',
              '💡'
            )
          },
          emailEntreprise: {
            subject: `Check-in ${urlParams?.jshow || 'J+14'} — ${talentName} : Mission bien lancée, opportunité d'extension`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#6b84ff;background:linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  Check-in ${urlParams?.jshow || 'J+14'} — ${talentName}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Bonjour,</p>
                <p style="margin:0 0 16px 0;">
                  Excellente nouvelle : le check-in ${urlParams?.jshow || 'J+14'} avec <strong>${talentName}</strong>
                  est très positif ! 🎉
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#14532d;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        Ce qui fonctionne bien
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        • ${talentName} s'est bien intégré·e et est opérationnel·le<br>
                        • La communication avec vos équipes est fluide<br>
                        • ${firstDeliveryStatus === "oui" ? "La première livraison est déjà finalisée" : "Les premières contributions avancent bien"}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💡 Opportunité identifiée
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        ${talentName} a mentionné avoir de la capacité disponible et être ouvert·e à élargir son
                        périmètre si besoin.
                      </div>
                      ${openFeedback ? `<div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;margin-top:10px;font-style:italic;">
                        <strong>Son feedback :</strong><br>
                        "${openFeedback}"
                      </div>` : ''}
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#ecfeff;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#06b6d4;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">🚀 Et maintenant ?</div>
                        <div style="margin:0;">
                          Si vous avez des besoins additionnels ou des projets en attente, c'est le moment idéal pour
                          explorer une extension de scope. Nous pouvons organiser un point pour discuter des possibilités.
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px 0;">Ravi de voir cette collaboration démarrer sur de bonnes bases !</p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0;color:#6b7280;">csm@taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          },
          emailTalent: {
            subject: `Super démarrage ! 🎉`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#6b84ff;background:linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  Super démarrage ! 🎉
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Salut <strong>${talentName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Merci pour ton retour — ravi de voir que les choses avancent bien avec <strong>${companyName}</strong> ! 🚀
                </p>
                <p style="margin:0 0 16px 0;">
                  J'ai noté que tu sembles avoir de la capacité disponible. On pourrait explorer ensemble s'il y a des
                  opportunités d'élargir ton scope ou de monter en charge si ça t'intéresse.
                </p>
                <p style="margin:0 0 16px 0;">
                  Je reviens vers toi prochainement pour en discuter.
                </p>
                <p style="margin:0 0 16px 0;">Continue comme ça ! 💪</p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0 0 6px 0;color:#6b7280;font-size:14px;">csm@taliotalent.com</p>
                <p style="margin:0;color:#6b7280;font-size:14px;">www.taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          }
        };

      case "warning":
        return {
          type: "warning",
          slackMessage: JSON.stringify({
            text: `⚠️ Attention requise — ${talentName} chez ${companyName} (${urlParams?.jshow || 'J+14'})`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `⚠️ Points d'attention — ${urlParams?.jshow || 'J+14'}`
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
                    text: `*🏢 Entreprise:*\n${companyName}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*📊 Score global:*\n${overallFeeling}/5`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*⚠️ Risque:*\n${shortTermRisk}`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `🟡 *Alertes détectées:*\n${redFlags.filter(f => !f.includes('opportunité')).map(flag => `• ${flag}`).join('\n')}`
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*📋 Réponses:*\n• Ressenti global: *${overallFeeling}/5*\n• Accès: *${accessStatus}*${accessMissingDetails ? `\n  → ${accessMissingDetails}` : ''}\n• Clarté scope: *${scopeClarity}/5*\n• Communication: *${clientCommunication}/5*\n• Charge: *${workloadStatus}*\n• Risque: *${shortTermRisk}*`
                }
              },
              ...(openFeedback ? [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*💬 Feedback:*\n"${openFeedback}"`
                }
              }] : []),
              ...(needCall === "oui" ? [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `⚠️ *${talentName} souhaite un échange* — Calendly partagé.`
                }
              }] : []),
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `📌 *Actions recommandées:*\n1. Follow-up avec ${talentName} sous 48h\n2. ${accessStatus !== "oui" ? "Débloquer les accès manquants\n3. " : ""}${parseInt(scopeClarity) <= 3 ? "Clarifier les priorités et le scope" : "Soutenir le talent dans sa montée en compétence"}`
                }
              }
            ]
          }),
          emailAM: {
            subject: `⚠️ Points d'attention — ${talentName} chez ${companyName} (${urlParams?.jshow || 'J+14'})`,
            body: wrapEmailHTML(
              `⚠️ Points d'attention — ${talentName}`,
              `
                <p style="margin:0 0 18px 0;">Bonjour <strong>${amName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Le check-in ${urlParams?.jshow || 'J+14'} de <strong>${talentName}</strong> révèle quelques
                  <strong>points d'attention</strong> qui méritent un suivi.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#fff7ed;border-radius:8px;border:1px solid #fed7aa;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#7c2d12;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        ⚠️ Alertes détectées
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        ${redFlags.filter(f => !f.includes('opportunité')).map(flag => `• ${flag}`).join('<br>')}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        📊 Réponses
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        • Ressenti global: <strong>${overallFeeling}/5</strong><br>
                        • Accès: <strong>${accessStatus}</strong>${accessMissingDetails ? `<br>  → ${accessMissingDetails}` : ''}<br>
                        • Clarté scope: <strong>${scopeClarity}/5</strong><br>
                        • Communication: <strong>${clientCommunication}/5</strong><br>
                        • Charge: <strong>${workloadStatus}</strong><br>
                        • Risque: <strong>${shortTermRisk}</strong>
                      </div>
                    </td>
                  </tr>
                </table>
                ${openFeedback ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💬 Feedback
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;font-style:italic;">
                        "${openFeedback}"
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                ${needCall === "oui" ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#dbeafe;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#2563eb;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <strong>⚠️ ${talentName} souhaite un échange</strong> — Calendly partagé.
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#fef3c7;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#f59e0b;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">📌 Actions recommandées</div>
                        <div style="margin:0;">
                          1. Follow-up avec ${talentName} sous 48h<br>
                          2. ${accessStatus !== "oui" ? "Débloquer les accès manquants<br>3. " : ""}${parseInt(scopeClarity) <= 3 ? "Clarifier les priorités et le scope" : ""}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 14px 0;">Merci de suivre ces points,</p>
              `,
              'linear-gradient(90deg,#f59e0b 0%, #f97316 100%)',
              '⚠️'
            )
          },
          emailEntreprise: {
            subject: `Check-in ${urlParams?.jshow || 'J+14'} — ${talentName} : Démarrage en cours, quelques ajustements`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#f59e0b;background:linear-gradient(90deg,#f59e0b 0%, #f97316 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  Check-in ${urlParams?.jshow || 'J+14'} — ${talentName}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Bonjour,</p>
                <p style="margin:0 0 16px 0;">
                  Nous venons de faire le point avec <strong>${talentName}</strong> sur ses 2 premières semaines
                  chez <strong>${companyName}</strong>.
                </p>
                <p style="margin:0 0 16px 0;">
                  <strong>Dans l'ensemble :</strong> Le démarrage avance bien et ${talentName} est investi·e dans la mission.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#fff7ed;border-radius:8px;border:1px solid #fed7aa;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#7c2d12;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        🔧 Quelques ajustements à faire
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        ${accessStatus !== "oui" ? `• Certains accès/outils restent à finaliser<br>` : ""}${parseInt(scopeClarity) <= 3 ? `• Quelques clarifications sur les priorités seraient utiles<br>` : ""}${parseInt(clientCommunication) <= 3 ? `• La fréquence des syncs pourrait être optimisée<br>` : ""}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        👥 Actions de notre côté
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        Nous faisons un point avec ${talentName} cette semaine pour lever ces points et nous assurer
                        que tout est bien aligné.
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#ecfeff;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#06b6d4;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">📌 Comment vous pouvez aider</div>
                        <div style="margin:0;">
                          ${accessStatus !== "oui" ? `• Finaliser les accès en attente dès que possible<br>` : ""}${parseInt(scopeClarity) <= 3 ? `• Prendre 15-20 min pour clarifier les priorités immédiates<br>` : ""}${parseInt(clientCommunication) <= 3 ? `• Maintenir des points réguliers (2-3x/semaine recommandés en phase de démarrage)<br>` : ""}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px 0;">
                  Rien d'alarmant, juste des ajustements classiques de démarrage. N'hésitez pas si vous souhaitez
                  échanger avec nous.
                </p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0;color:#6b7280;">csm@taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          },
          emailTalent: {
            subject: `On est là pour t'aider 💪`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#6b84ff;background:linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  On est là pour t'aider 💪
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Salut <strong>${talentName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Merci pour ton retour sur ton démarrage avec <strong>${companyName}</strong>.
                </p>
                <p style="margin:0 0 16px 0;">
                  J'ai noté quelques points qu'on peut améliorer ensemble. Je vais intervenir de mon côté pour
                  faciliter les choses.
                </p>
                ${needCall === "oui" ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#dbeafe;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#2563eb;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <strong>👉 Tu as demandé un échange</strong> — tu trouveras un lien Calendly dans ta page
                        de confirmation.
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                ${accessStatus !== "oui" ? `<p style="margin:0 0 16px 0;">
                  Je vais m'occuper de débloquer les accès manquants dès maintenant.
                </p>` : ''}
                <p style="margin:0 0 16px 0;">
                  N'hésite pas à me tenir au courant si d'autres points émergent.
                </p>
                <p style="margin:0 0 16px 0;">À très vite,</p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0 0 6px 0;color:#6b7280;font-size:14px;">csm@taliotalent.com</p>
                <p style="margin:0;color:#6b7280;font-size:14px;">www.taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          }
        };

      default:
        return {
          type: "all-good",
          slackMessage: JSON.stringify({
            text: `Check-in ${urlParams?.jshow || 'J+14'} TALENT — Tout va bien`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `Check-in ${urlParams?.jshow || 'J+14'} TALENT — Tout va bien`
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
                    text: `*🏢 Entreprise:*\n${companyName}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*📊 Score global:*\n${overallFeeling}/5`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*✅ Statut:*\nTout va bien`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `✅ *Tous les indicateurs au vert:*\n• Accès/Outils: *OK*\n• Clarté scope: *${scopeClarity}/5*\n• Communication client: *${clientCommunication}/5*\n• Charge: *${workloadStatus}*\n• Première livraison: *${firstDeliveryStatus}*\n• Aucun risque identifié`
                }
              },
              ...(openFeedback ? [{
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*💬 Feedback positif:*\n"${openFeedback}"`
                }
              }] : []),
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `👍 *Aucune action requise* — Mission sur de bons rails !`
                }
              }
            ]
          }),
          emailAM: {
            subject: `Check-in ${urlParams?.jshow || 'J+14'} positif — ${talentName} chez ${companyName}`,
            body: wrapEmailHTML(
              `Check-in positif — ${talentName}`,
              `
                <p style="margin:0 0 18px 0;">Bonjour <strong>${amName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Excellente nouvelle : le check-in ${urlParams?.jshow || 'J+14'} de <strong>${talentName}</strong>
                  est très positif ! 🎉
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#14532d;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        ✅ Tous les indicateurs sont au vert
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        • Ressenti global: <strong>${overallFeeling}/5</strong><br>
                        • Accès/Outils: <strong>OK</strong><br>
                        • Clarté du scope: <strong>${scopeClarity}/5</strong><br>
                        • Communication client: <strong>${clientCommunication}/5</strong><br>
                        • Charge de travail: <strong>${workloadStatus}</strong><br>
                        • Première livraison: <strong>${firstDeliveryStatus}</strong>
                      </div>
                    </td>
                  </tr>
                </table>
                ${openFeedback ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💬 Feedback du Talent
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;font-style:italic;">
                        "${openFeedback}"
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <p style="margin:0 0 16px 0;">
                  <strong>Aucune action nécessaire</strong> — la collaboration démarre sur de bonnes bases ! 🚀
                </p>
                <p style="margin:0 0 16px 0;">Prochain check-in dans quelques semaines.</p>
                <p style="margin:0 0 14px 0;">Système Check-in Talio</p>
              `,
              'linear-gradient(90deg,#22c55e 0%, #10b981 100%)',
              '✅'
            )
          },
          emailEntreprise: {
            subject: `Check-in ${urlParams?.jshow || 'J+14'} — ${talentName} : Tout roule ! 🎉`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#6b84ff;background:linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  Check-in ${urlParams?.jshow || 'J+14'} — ${talentName}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Bonjour,</p>
                <p style="margin:0 0 16px 0;">
                  Excellente nouvelle : nous venons de faire le point avec <strong>${talentName}</strong> et tout
                  se passe très bien ! 🎉
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:16px 0 18px 0;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#14532d;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        Indicateurs positifs
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;">
                        • ${talentName} s'est parfaitement intégré·e à vos équipes<br>
                        • La communication est fluide et les syncs sont productifs<br>
                        • ${firstDeliveryStatus === "oui" ? "La première livraison est déjà finalisée" : "Les premières contributions avancent bien"}<br>
                        • Aucun blocage identifié
                      </div>
                    </td>
                  </tr>
                </table>
                ${openFeedback ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:0 0 18px 0;background:#f8fafc;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#111827;font-size:15px;font-weight:700;margin:0 0 10px 0;">
                        💬 Feedback de ${talentName}
                      </div>
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#374151;font-size:14px;line-height:22px;font-style:italic;">
                        "${openFeedback}"
                      </div>
                    </td>
                  </tr>
                </table>` : ''}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                  style="margin:10px 0 18px 0;background:#ecfeff;border-radius:6px;">
                  <tr>
                    <td style="width:4px;background:#06b6d4;border-radius:6px 0 0 6px;"></td>
                    <td style="padding:14px 16px;">
                      <div style="font-family:Arial, Helvetica, sans-serif;color:#0f172a;font-size:15px;line-height:22px;">
                        <div style="font-weight:700;margin:0 0 6px 0;">🚀 Et maintenant ?</div>
                        <div style="margin:0;">
                          On continue comme ça ! Nous referons un point dans quelques semaines pour nous assurer
                          que la collaboration reste sur les bons rails.
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px 0;">
                  Merci pour cette collaboration réussie — c'est exactement ce qu'on vise avec chaque mission
                  Talio ! 🚀
                </p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0;color:#6b7280;">csm@taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          },
          emailTalent: {
            subject: `Super démarrage ! 🎉`,
            body: `<div style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640"
          style="width:640px;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:#6b84ff;background:linear-gradient(90deg,#6b84ff 0%, #7b56b3 100%);text-align:center;padding:34px 18px;">
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:28px;line-height:36px;font-weight:800;color:#ffffff;">
                  Super démarrage ! 🎉
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 10px 34px;">
              <div style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;font-size:16px;line-height:26px;">
                <p style="margin:0 0 18px 0;">Salut <strong>${talentName}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Merci pour ton retour — ravi de voir que tout roule avec <strong>${companyName}</strong> ! 🚀
                </p>
                <p style="margin:0 0 16px 0;">
                  On reste dispo si tu as besoin, et on se recontacte dans quelques semaines pour le prochain check-in.
                </p>
                <p style="margin:0 0 16px 0;">Keep rocking! 🎸</p>
                <p style="margin:0 0 4px 0;"><strong>${amName}</strong> — Talio</p>
                <p style="margin:0 0 6px 0;color:#6b7280;font-size:14px;">csm@taliotalent.com</p>
                <p style="margin:0;color:#6b7280;font-size:14px;">www.taliotalent.com</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
          }
        };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (parseInt(overallFeeling) <= 2 && !detailsFeeling.trim()) {
      alert("Veuillez préciser les détails concernant vos difficultés.");
      return;
    }

    if (accessStatus === "non" && !accessMissingDetails.trim()) {
      alert("Veuillez préciser les accès manquants.");
      return;
    }

    if (parseInt(scopeClarity) <= 2 && !detailsScopeClarity.trim()) {
      alert("Veuillez préciser ce qui n'est pas clair dans le scope.");
      return;
    }

    if (parseInt(clientCommunication) <= 2 && !detailsCommunication.trim()) {
      alert("Veuillez préciser les problèmes de communication.");
      return;
    }

    if (firstDeliveryStatus === "non" && !deliveryBlockageDetails.trim()) {
      alert("Veuillez préciser ce qui bloque la livraison.");
      return;
    }

    if (shortTermRisk !== "non" && !riskType) {
      alert("Veuillez sélectionner le type de risque.");
      return;
    }

    if (shortTermRisk === "oui-bloquant" && !riskDetails.trim()) {
      alert("Veuillez décrire le contexte du risque bloquant.");
      return;
    }

    const formData = {
      overallFeeling,
      detailsFeeling,
      commentaireFeeling,
      accessStatus,
      accessMissingDetails,
      scopeClarity,
      detailsScopeClarity,
      commentaireScopeClarity,
      clientCommunication,
      detailsCommunication,
      commentaireCommunication,
      firstDeliveryStatus,
      deliveryBlockageDetails,
      workloadStatus,
      shortTermRisk,
      riskType,
      riskDetails,
      improvementAreas,
      needCall,
      openFeedback,
      successStory
    };
    
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
    
    console.log("=== FORMULAIRE TALENT SOUMIS ===");
    console.log("Données:", formData);
    console.log("\n=== NOTIFICATIONS GÉNÉRÉES ===");
    console.log("Type:", notifs.type);
    console.log("\nSlack:", notifs.slackMessage);
    console.log("\nEmail AM:", notifs.emailAM);
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
=== WORKFLOW CHECK-IN J+14 TALENT ===

TYPE: ${notifications.type.toUpperCase()}

--- SLACK (MEHDI) ---
${notifications.slackMessage}

--- EMAIL ACCOUNT MANAGER ---
Sujet: ${notifications.emailAM.subject}

${notifications.emailAM.body}

--- EMAIL ENTREPRISE (CLIENT) ---
Sujet: ${notifications.emailEntreprise.subject}

${notifications.emailEntreprise.body}

--- EMAIL TALENT ---
Sujet: ${notifications.emailTalent.subject}

${notifications.emailTalent.body}
`;
    
    navigator.clipboard.writeText(dataText);
    alert("✅ Toutes les données ont été copiées dans le presse-papier !");
  };

  const handleCopyIndividual = (type: "slack" | "email-am" | "email-entreprise" | "email-talent") => {
    if (!notifications) return;
    
    let text = "";
    switch (type) {
      case "slack":
        text = notifications.slackMessage;
        break;
      case "email-am":
        text = `Sujet: ${notifications.emailAM.subject}\n\n${notifications.emailAM.body}`;
        break;
      case "email-entreprise":
        text = `Sujet: ${notifications.emailEntreprise.subject}\n\n${notifications.emailEntreprise.body}`;
        break;
      case "email-talent":
        text = `Sujet: ${notifications.emailTalent.subject}\n\n${notifications.emailTalent.body}`;
        break;
    }
    
    navigator.clipboard.writeText(text);
    setCopiedState(type);
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-[600px] mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="mb-8">
            {/* Context Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
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
                👤 Nadia Berrada
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
                Acme Corp
              </span>
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
              
              {/* Bouton Modèle d'email */}
              <Button
                onClick={() => setShowEmailTemplate(true)}
                type="button"
                style={{
                  backgroundColor: 'transparent',
                  color: TalioTheme.colors.primary,
                  border: `1px solid ${TalioTheme.colors.primary}`,
                  padding: '10px 16px',
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
                  e.currentTarget.style.backgroundColor = TalioTheme.colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Mail size={16} />
                Modèle d'email
              </Button>
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
              <span style={{ fontWeight: 600, color: TalioTheme.colors.primary }}>Acme Corp</span>. Ce formulaire prend <strong>2 min</strong> et permet à Mehdi d'intervenir vite si besoin. Tes réponses restent entre nous 🤝
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
                    <strong>⚠️ Point d'attention critique détecté</strong> - Mehdi prendra contact rapidement pour résoudre la situation. Un call est fortement recommandé.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!showSummary ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1 : Ressenti global */}
              <section>
                <h2 
                  className="mb-6" 
                  style={CheckInFormStyles.sectionTitle}
                >
                  Ressenti global
                </h2>

                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: parseInt(overallFeeling) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                    borderLeft: parseInt(overallFeeling) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
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
                      Comment te sens-tu sur cette expérience internationale après 2 semaines ?
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" style={{ cursor: 'help', border: 'none', background: 'none', padding: 0 }}>
                          <Info size={14} style={{ color: '#777777' }} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p style={{ fontSize: '12px' }}>1 = Très difficile, 5 = Excellent</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <RadioGroup
                    value={overallFeeling}
                    onValueChange={handleFeelingChange}
                    className="flex gap-4"
                  >
                    {["1", "2", "3", "4", "5"].map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem 
                          value={value} 
                          id={`feeling-${value}`}
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label
                          htmlFor={`feeling-${value}`}
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

                {/* Trigger : Ressenti ≤3 */}
                <AnimatePresence>
                  {parseInt(overallFeeling) <= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div 
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #E0E0E0',
                          borderLeft: parseInt(overallFeeling) <= 2 ? '4px solid #FF4444' : '4px solid #FFB84D'
                        }}
                      >
                        <Label 
                          htmlFor={parseInt(overallFeeling) <= 2 ? "detailsFeeling" : "commentaireFeeling"}
                          className="block mb-3 flex items-center gap-2" 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#111111',
                            margin: 0,
                            marginBottom: '12px'
                          }}
                        >
                          {parseInt(overallFeeling) <= 2 ? (
                            <>Détails / Que se passe-t-il ? <span style={{ color: '#FF0000' }}>*</span></>
                          ) : (
                            "Commentaire rapide (optionnel)"
                          )}
                        </Label>
                        <Textarea
                          id={parseInt(overallFeeling) <= 2 ? "detailsFeeling" : "commentaireFeeling"}
                          value={parseInt(overallFeeling) <= 2 ? detailsFeeling : commentaireFeeling}
                          onChange={(e) => parseInt(overallFeeling) <= 2 ? setDetailsFeeling(e.target.value) : setCommentaireFeeling(e.target.value)}
                          placeholder={parseInt(overallFeeling) <= 2 ? "Décris ce qui ne va pas pour qu'on puisse t'aider..." : "Ex: Quelques ajustements mais rien de bloquant"}
                          rows={3}
                          required={parseInt(overallFeeling) <= 2}
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

                      {parseInt(overallFeeling) <= 2 && (
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
                              Un point avec Mehdi est fortement conseillé pour débloquer la situation.
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
                    backgroundColor: accessStatus === "non" ? '#FFCCCC' : '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: accessStatus === "non" ? '2px solid #FF0000' : '1px solid #E0E0E0',
                    borderLeft: accessStatus === "non" ? '4px solid #FF0000' : '1px solid #E0E0E0'
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
                      As-tu tous les accès et outils nécessaires pour être pleinement opérationnel ?
                    </Label>
                  </div>
                  <RadioGroup
                    value={accessStatus}
                    onValueChange={handleAccessStatusChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="oui" 
                        id="access-yes"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="access-yes"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Oui, tout est OK
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="partiel" 
                        id="access-partial"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="access-partial"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Quelques accès manquent
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="non" 
                        id="access-no"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="access-no"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Accès critiques manquants
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Trigger : Accès manquants */}
                <AnimatePresence>
                  {accessStatus !== "oui" && (
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
                          borderLeft: accessStatus === "non" ? '4px solid #FF0000' : '4px solid #FFB84D'
                        }}
                      >
                        <Label 
                          htmlFor="accessDetails"
                          className="block mb-3" 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#111111',
                            margin: 0,
                            marginBottom: '12px'
                          }}
                        >
                          Quels accès/outils manquent ? <span style={{ color: '#FF0000' }}>*</span>
                        </Label>
                        <Textarea
                          id="accessDetails"
                          value={accessMissingDetails}
                          onChange={(e) => setAccessMissingDetails(e.target.value)}
                          placeholder="Ex: GitHub, Slack interne, credentials API, Figma..."
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Section 3 : Scope & Mission */}
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
                  Scope & Mission
                </h2>

                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: parseInt(scopeClarity) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                    borderLeft: parseInt(scopeClarity) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
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
                      Le scope de ta mission et les attentes sont-ils clairs ?
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" style={{ cursor: 'help', border: 'none', background: 'none', padding: 0 }}>
                          <Info size={14} style={{ color: '#777777' }} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p style={{ fontSize: '12px' }}>1 = Très flou, 5 = Très clair</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <RadioGroup
                    value={scopeClarity}
                    onValueChange={handleScopeClarityChange}
                    className="flex gap-4"
                  >
                    {["1", "2", "3", "4", "5"].map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem 
                          value={value} 
                          id={`scope-${value}`}
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label
                          htmlFor={`scope-${value}`}
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

                {/* Trigger : Clarté scope ≤3 */}
                <AnimatePresence>
                  {parseInt(scopeClarity) <= 3 && (
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
                          borderLeft: parseInt(scopeClarity) <= 2 ? '4px solid #FF4444' : '4px solid #FFB84D'
                        }}
                      >
                        <Label 
                          htmlFor={parseInt(scopeClarity) <= 2 ? "detailsScope" : "commentaireScope"}
                          className="block mb-3" 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#111111',
                            margin: 0,
                            marginBottom: '12px'
                          }}
                        >
                          {parseInt(scopeClarity) <= 2 ? (
                            <>Que faudrait-il clarifier ? <span style={{ color: '#FF0000' }}>*</span></>
                          ) : (
                            "Commentaire rapide (optionnel)"
                          )}
                        </Label>
                        <Textarea
                          id={parseInt(scopeClarity) <= 2 ? "detailsScope" : "commentaireScope"}
                          value={parseInt(scopeClarity) <= 2 ? detailsScopeClarity : commentaireScopeClarity}
                          onChange={(e) => parseInt(scopeClarity) <= 2 ? setDetailsScopeClarity(e.target.value) : setCommentaireScopeClarity(e.target.value)}
                          placeholder={parseInt(scopeClarity) <= 2 ? "Ex: Priorités, livrables attendus, deadlines..." : "Ex: Quelques points à préciser mais globalement clair"}
                          rows={3}
                          required={parseInt(scopeClarity) <= 2}
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

              {/* Section 4 : Communication */}
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
                  Communication
                </h2>

                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: parseInt(clientCommunication) <= 2 ? '2px solid #FF9900' : '1px solid #E0E0E0',
                    borderLeft: parseInt(clientCommunication) <= 2 ? '4px solid #FF9900' : '1px solid #E0E0E0'
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
                      Comment se passe la communication avec ton client ?
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" style={{ cursor: 'help', border: 'none', background: 'none', padding: 0 }}>
                          <Info size={14} style={{ color: '#777777' }} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p style={{ fontSize: '12px' }}>1 = Très difficile, 5 = Excellente</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <RadioGroup
                    value={clientCommunication}
                    onValueChange={handleCommunicationChange}
                    className="flex gap-4"
                  >
                    {["1", "2", "3", "4", "5"].map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem 
                          value={value} 
                          id={`comm-${value}`}
                          className="border-[#0055FF] text-[#0055FF]"
                          style={{
                            width: '20px',
                            height: '20px'
                          }}
                        />
                        <Label
                          htmlFor={`comm-${value}`}
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

                {/* Trigger : Communication ≤3 */}
                <AnimatePresence>
                  {parseInt(clientCommunication) <= 3 && (
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
                          borderLeft: parseInt(clientCommunication) <= 2 ? '4px solid #FF4444' : '4px solid #FFB84D'
                        }}
                      >
                        <Label 
                          htmlFor={parseInt(clientCommunication) <= 2 ? "detailsComm" : "commentaireComm"}
                          className="block mb-3" 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#111111',
                            margin: 0,
                            marginBottom: '12px'
                          }}
                        >
                          {parseInt(clientCommunication) <= 2 ? (
                            <>Détails / Problème de communication <span style={{ color: '#FF0000' }}>*</span></>
                          ) : (
                            "Commentaire rapide (optionnel)"
                          )}
                        </Label>
                        <Textarea
                          id={parseInt(clientCommunication) <= 2 ? "detailsComm" : "commentaireComm"}
                          value={parseInt(clientCommunication) <= 2 ? detailsCommunication : commentaireCommunication}
                          onChange={(e) => parseInt(clientCommunication) <= 2 ? setDetailsCommunication(e.target.value) : setCommentaireCommunication(e.target.value)}
                          placeholder={parseInt(clientCommunication) <= 2 ? "Ex: Réponses tardives, manque de feedback, barrière linguistique..." : "Ex: Quelques ajustements mais ça avance"}
                          rows={3}
                          required={parseInt(clientCommunication) <= 2}
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

              {/* Section 5 : Livraison & Charge */}
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
                  Livraison & Charge
                </h2>

                {/* Première livraison */}
                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{
                    backgroundColor: firstDeliveryStatus === "non" ? '#FFCCCC' : '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: firstDeliveryStatus === "non" ? '2px solid #FF0000' : '1px solid #E0E0E0',
                    borderLeft: firstDeliveryStatus === "non" ? '4px solid #FF0000' : '1px solid #E0E0E0'
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
                      As-tu pu effectuer ta première livraison / contribution ?
                    </Label>
                  </div>
                  <RadioGroup
                    value={firstDeliveryStatus}
                    onValueChange={handleFirstDeliveryChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="oui" 
                        id="delivery-yes"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="delivery-yes"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Oui, déjà livrée
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="en-cours" 
                        id="delivery-progress"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="delivery-progress"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        En cours (normal à J+14)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="non" 
                        id="delivery-no"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="delivery-no"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Non, bloquée
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Trigger : Livraison bloquée */}
                <AnimatePresence>
                  {firstDeliveryStatus === "non" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <div 
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #E0E0E0',
                          borderLeft: '4px solid #FF0000'
                        }}
                      >
                        <Label 
                          htmlFor="deliveryBlockage"
                          className="block mb-3" 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#111111',
                            margin: 0,
                            marginBottom: '12px'
                          }}
                        >
                          Qu'est-ce qui bloque ta première livraison ? <span style={{ color: '#FF0000' }}>*</span>
                        </Label>
                        <Textarea
                          id="deliveryBlockage"
                          value={deliveryBlockageDetails}
                          onChange={(e) => setDeliveryBlockageDetails(e.target.value)}
                          placeholder="Ex: Manque de specs, accès manquants, attente validation..."
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Charge de travail */}
                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: workloadStatus === "trop-elevee" ? '#FFCCCC' : '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: workloadStatus === "trop-elevee" ? '2px solid #FF0000' : '1px solid #E0E0E0',
                    borderLeft: workloadStatus === "trop-elevee" ? '4px solid #FF0000' : '1px solid #E0E0E0'
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
                      Comment évalues-tu ta charge de travail actuelle ?
                    </Label>
                  </div>
                  <RadioGroup
                    value={workloadStatus}
                    onValueChange={setWorkloadStatus}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="trop-faible" 
                        id="workload-low"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="workload-low"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Trop faible (j'ai de la capacité)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="equilibree" 
                        id="workload-balanced"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="workload-balanced"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Équilibrée
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="trop-elevee" 
                        id="workload-high"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="workload-high"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Trop élevée (risque de surcharge)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </section>

              {/* Section 6 : Risques & Amélioration */}
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
                  Risques & Amélioration
                </h2>

                {/* Risque court terme */}
                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{
                    backgroundColor: shortTermRisk === "oui-bloquant" ? '#FFCCCC' : '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: shortTermRisk === "oui-bloquant" ? '2px solid #FF0000' : '1px solid #E0E0E0',
                    borderLeft: shortTermRisk === "oui-bloquant" ? '4px solid #FF0000' : '1px solid #E0E0E0'
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
                      Vois-tu un risque potentiel à court terme sur cette mission ?
                    </Label>
                  </div>
                  <RadioGroup
                    value={shortTermRisk}
                    onValueChange={handleRiskChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="non" 
                        id="risk-no"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="risk-no"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Non, tout va bien
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="oui-mineur" 
                        id="risk-minor"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="risk-minor"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Oui, risque mineur
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="oui-bloquant" 
                        id="risk-blocking"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="risk-blocking"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Oui, risque bloquant
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Trigger : Risque détecté */}
                <AnimatePresence>
                  {shortTermRisk !== "non" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 space-y-4"
                    >
                      <div 
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #E0E0E0',
                          borderLeft: shortTermRisk === "oui-bloquant" ? '4px solid #FF0000' : '4px solid #FFB84D'
                        }}
                      >
                        <Label 
                          htmlFor="riskType"
                          className="block mb-3" 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#111111',
                            margin: 0,
                            marginBottom: '12px'
                          }}
                        >
                          Type de risque <span style={{ color: '#FF0000' }}>*</span>
                        </Label>
                        <RadioGroup
                          value={riskType}
                          onValueChange={setRiskType}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="technique" id="risk-tech" className="border-[#0055FF] text-[#0055FF]" />
                            <Label htmlFor="risk-tech" className="cursor-pointer" style={{ fontSize: '14px', color: '#333333', margin: 0 }}>
                              Technique
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="relationnel" id="risk-rel" className="border-[#0055FF] text-[#0055FF]" />
                            <Label htmlFor="risk-rel" className="cursor-pointer" style={{ fontSize: '14px', color: '#333333', margin: 0 }}>
                              Relationnel
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="scope" id="risk-scope" className="border-[#0055FF] text-[#0055FF]" />
                            <Label htmlFor="risk-scope" className="cursor-pointer" style={{ fontSize: '14px', color: '#333333', margin: 0 }}>
                              Scope / Attentes
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="autre" id="risk-other" className="border-[#0055FF] text-[#0055FF]" />
                            <Label htmlFor="risk-other" className="cursor-pointer" style={{ fontSize: '14px', color: '#333333', margin: 0 }}>
                              Autre
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {shortTermRisk === "oui-bloquant" && (
                        <div 
                          className="rounded-lg p-4"
                          style={{
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #E0E0E0',
                            borderLeft: '4px solid #FF0000'
                          }}
                        >
                          <Label 
                            htmlFor="riskDetails"
                            className="block mb-3" 
                            style={{ 
                              fontSize: '14px', 
                              fontWeight: 600, 
                              color: '#111111',
                              margin: 0,
                              marginBottom: '12px'
                            }}
                          >
                            Contexte du risque bloquant <span style={{ color: '#FF0000' }}>*</span>
                          </Label>
                          <Textarea
                            id="riskDetails"
                            value={riskDetails}
                            onChange={(e) => setRiskDetails(e.target.value)}
                            placeholder="Décris la situation pour qu'on puisse t'aider rapidement..."
                            rows={4}
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
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Axes d'amélioration */}
                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E0E0E0'
                  }}
                >
                  <Label 
                    htmlFor="improvement"
                    className="block mb-3" 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#111111',
                      margin: 0,
                      marginBottom: '12px'
                    }}
                  >
                    Y a-t-il des axes d'amélioration que tu aimerais partager ? (Optionnel)
                  </Label>
                  <Textarea
                    id="improvement"
                    value={improvementAreas}
                    onChange={(e) => setImprovementAreas(e.target.value)}
                    placeholder="Ton feedback nous aide à améliorer l'expérience..."
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

                {/* Besoin d'un call */}
                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E0E0E0'
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
                      Souhaites-tu un échange avec ton Account Manager (Mehdi) ?
                    </Label>
                  </div>
                  <RadioGroup
                    value={needCall}
                    onValueChange={setNeedCall}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="non" 
                        id="call-no"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="call-no"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Non, tout va bien
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem 
                        value="oui" 
                        id="call-yes"
                        className="border-[#0055FF] text-[#0055FF]"
                      />
                      <Label
                        htmlFor="call-yes"
                        className="cursor-pointer"
                        style={{ fontSize: '14px', color: '#333333', margin: 0 }}
                      >
                        Oui, je voudrais un call
                      </Label>
                    </div>
                  </RadioGroup>

                  <AnimatePresence>
                    {needCall === "oui" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <a
                          href="https://calendly.com/mehdi-talio/check-in-talent"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-lg p-4 transition-shadow hover:shadow-md"
                          style={{
                            backgroundColor: '#E8F0FE',
                            border: '2px solid #0055FF',
                            color: '#0055FF',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginTop: '16px'
                          }}
                        >
                          <Calendar size={18} />
                          Réserver un créneau avec Mehdi (15 min)
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Section 7 : Feedback ouvert */}
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
                  Feedback ouvert
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
                    htmlFor="openFeedback"
                    className="block mb-3" 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#111111',
                      margin: 0,
                      marginBottom: '12px'
                    }}
                  >
                    Un dernier mot ? (Optionnel)
                  </Label>
                  <Textarea
                    id="openFeedback"
                    value={openFeedback}
                    onChange={(e) => setOpenFeedback(e.target.value)}
                    placeholder="Partage-nous tout ce qui te semble important..."
                    rows={4}
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
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  style={{
                    backgroundColor: TalioTheme.colors.primary,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Envoyer mon check-in
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: 'transparent',
                    color: TalioTheme.colors.textSecondary,
                    border: `1px solid ${TalioTheme.colors.border}`,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          ) : (
            /* Récapitulatif */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* En-tête récapitulatif */}
              <div 
                className="rounded-lg p-6 mb-6"
                style={{
                  backgroundColor: notifications?.type === "critical" ? '#FFF3CD' :
                                  notifications?.type === "warning" ? '#FFF3CD' :
                                  notifications?.type === "upsell" ? '#E8F5E9' :
                                  '#E8F5E9',
                  border: notifications?.type === "critical" ? '2px solid #FF9900' :
                          notifications?.type === "warning" ? '2px solid #FF9900' :
                          '1px solid #4CAF50'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {notifications?.type === "critical" && (
                    <AlertCircle size={32} style={{ color: '#FF9900', flexShrink: 0 }} />
                  )}
                  {notifications?.type === "warning" && (
                    <AlertCircle size={32} style={{ color: '#FF9900', flexShrink: 0 }} />
                  )}
                  {(notifications?.type === "upsell" || notifications?.type === "all-good") && (
                    <div style={{ fontSize: '32px' }}>✅</div>
                  )}

                  <div>
                    <h2 style={{ 
                      fontSize: '20px', 
                      fontWeight: 700, 
                      color: '#111111',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      {notifications?.type === "critical" && "Check-in envoyé — Intervention urgente"}
                      {notifications?.type === "warning" && "Check-in envoyé — Suivi nécessaire"}
                      {notifications?.type === "upsell" && "Check-in envoyé — Opportunité détectée"}
                      {notifications?.type === "all-good" && "Check-in envoyé — Tout va bien !"}
                    </h2>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#555555',
                      margin: 0
                    }}>
                      {notifications?.type === "critical" && "Mehdi va te contacter sous 24h"}
                      {notifications?.type === "warning" && "Mehdi va te contacter sous 48h"}
                      {notifications?.type === "upsell" && "Mehdi reviendra vers toi prochainement"}
                      {notifications?.type === "all-good" && "Continue comme ça ! On se reparle bientôt."}
                    </p>
                  </div>
                </div>

                {needCall === "oui" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg p-4 flex items-start gap-3"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #0055FF',
                      marginTop: '16px'
                    }}
                  >
                    <PhoneCall size={20} style={{ color: TalioTheme.colors.primary, flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: '#111111', margin: 0, marginBottom: '8px', fontSize: '14px' }}>
                        Prends RDV avec Mehdi
                      </p>
                      <p style={{ fontSize: '13px', color: '#555555', margin: 0, marginBottom: '12px' }}>
                        Tu as demandé un échange — choisis ton créneau :
                      </p>
                      <Button
                        onClick={() => window.open('https://calendly.com/mehdi-talio/30min', '_blank')}
                        style={{
                          backgroundColor: TalioTheme.colors.primary,
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Calendar size={16} />
                        Réserver un créneau Calendly
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Notifications générées */}
              <div 
                className="rounded-lg p-6 mb-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E0E0E0'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#111111',
                    margin: 0
                  }}>
                    Notifications envoyées automatiquement
                  </h3>
                  <Button
                    onClick={handleCopyData}
                    style={{
                      backgroundColor: 'transparent',
                      color: TalioTheme.colors.primary,
                      border: `1px solid ${TalioTheme.colors.primary}`,
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Copy size={14} />
                    Copier tout
                  </Button>
                </div>

                {/* Slack */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: '#4A154B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        S
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                        Slack → #team-success
                      </span>
                    </div>
                    <Button
                      onClick={() => handleCopyIndividual("slack")}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#777777',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedState === "slack" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedState === "slack" ? "Copié" : "Copier"}
                    </Button>
                  </div>
                  <div style={{
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #E0E0E0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    color: '#333333',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {notifications?.slackMessage}
                  </div>
                </div>

                {/* Email AM */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} style={{ color: TalioTheme.colors.primary }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                        Email → Mehdi (Account Manager)
                      </span>
                    </div>
                    <Button
                      onClick={() => handleCopyIndividual("email-am")}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#777777',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedState === "email-am" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedState === "email-am" ? "Copié" : "Copier"}
                    </Button>
                  </div>
                  <div style={{
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #E0E0E0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px'
                  }}>
                    <p style={{ margin: 0, marginBottom: '8px', fontWeight: 600, color: '#111111' }}>
                      {notifications?.emailAM.subject}
                    </p>
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      color: '#333333',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {notifications?.emailAM.body}
                    </div>
                  </div>
                </div>

                {/* Email Entreprise */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} style={{ color: '#FF9900' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                        Email → Acme Corp (Client)
                      </span>
                    </div>
                    <Button
                      onClick={() => handleCopyIndividual("email-entreprise")}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#777777',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedState === "email-entreprise" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedState === "email-entreprise" ? "Copié" : "Copier"}
                    </Button>
                  </div>
                  <div style={{
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #E0E0E0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px'
                  }}>
                    <p style={{ margin: 0, marginBottom: '8px', fontWeight: 600, color: '#111111' }}>
                      {notifications?.emailEntreprise.subject}
                    </p>
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      color: '#333333',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {notifications?.emailEntreprise.body}
                    </div>
                  </div>
                </div>

                {/* Email Talent */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} style={{ color: '#4CAF50' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                        Email → Nadia Berrada (Talent)
                      </span>
                    </div>
                    <Button
                      onClick={() => handleCopyIndividual("email-talent")}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#777777',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedState === "email-talent" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedState === "email-talent" ? "Copié" : "Copier"}
                    </Button>
                  </div>
                  <div style={{
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #E0E0E0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px'
                  }}>
                    <p style={{ margin: 0, marginBottom: '8px', fontWeight: 600, color: '#111111' }}>
                      {notifications?.emailTalent.subject}
                    </p>
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      color: '#333333',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {notifications?.emailTalent.body}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton Nouveau check-in */}
              <Button
                onClick={() => {
                  setShowSummary(false);
                  setNotifications(null);
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: TalioTheme.colors.primary,
                  border: `1px solid ${TalioTheme.colors.primary}`,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Faire un nouveau check-in
              </Button>
            </motion.div>
          )}
        </div>

        {/* Modal Email Template */}
        {showEmailTemplate && (
          <EmailTemplateModalTalent 
            isOpen={showEmailTemplate}
            onClose={() => setShowEmailTemplate(false)}
            talentName={urlParams?.talent_full_name || "[Nom du Talent]"}
            formLink={formLink}
            amName={urlParams?.account_manager_full_name || "Mehdi"}
          />
        )}

        {/* Message de confirmation après soumission */}
        <AnimatePresence>
          {formSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Icône de succès animée */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6 flex justify-center"
                >
                  <div 
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#E8F5E9',
                      border: '4px solid #10B981'
                    }}
                  >
                    <Check size={48} style={{ color: '#10B981' }} />
                  </div>
                </motion.div>

                {/* Message principal */}
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: '#111111',
                  marginBottom: '12px'
                }}>
                  Merci ! 🎉
                </h2>
                
                <p style={{ 
                  fontSize: '16px', 
                  color: '#555555',
                  marginBottom: '8px',
                  lineHeight: '1.5'
                }}>
                  Ton check-in a bien été enregistré.
                </p>
                
                <p style={{ 
                  fontSize: '14px', 
                  color: '#777777',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>
                  {urlParams?.account_manager_full_name || "Ton AM"} te contactera d'ici <strong style={{ color: '#0055FF' }}>mercredi prochain (J+2)</strong> pour assurer le suivi.
                </p>

                {/* SLA Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor: '#E8F0FE',
                    border: '1px solid #0055FF20'
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#0055FF' }}>
                    ⚡ SLA Talio : Réponse garantie sous 48h
                  </span>
                </div>


              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}

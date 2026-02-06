'use client';

import { CheckInForm } from "@/app/components/checkin-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function J14EntrepriseContent() {
  const searchParams = useSearchParams();
  
  const urlParams = {
    contract_id: searchParams.get('contract_id') || '',
    id: searchParams.get('id') || '',
    talent_whatsapp_number: searchParams.get('talent_whatsapp_number') || '',
    company_id: searchParams.get('company_id') || '',
    company_name: searchParams.get('company_name') || '[Entreprise]',
    company_email: searchParams.get('company_email') || '',
    talent_id: searchParams.get('talent_id') || '',
    talent_full_name: searchParams.get('talent_full_name') || 'Nadia Berrada',
    talent_email: searchParams.get('talent_email') || '',
    account_manager_full_name: searchParams.get('account_manager_full_name') || '[Account Manager]',
    account_manager_email: searchParams.get('account_manager_email') || '',
    calendly_link: searchParams.get('calendly_link') || 'https://calendly.com/alouanihatim01/30min',
    billing_period_start: searchParams.get('billing_period_start') || '',
    billing_period_end: searchParams.get('billing_period_end') || '',
    contract_duration: searchParams.get('contract_duration') || '',
    contract_start_date: searchParams.get('contract_start_date') || '',
    contract_end_date: searchParams.get('contract_end_date') || '',
    jx: searchParams.get('jx') || '',
    jshow: searchParams.get('jshow') || ''
  };

  return (
    <div className="size-full">
      <CheckInForm urlParams={urlParams} webhookUrl="https://n8n.taliotalent-com.unitalk.ai/webhook/bc1edb5a-3284-4c09-a77f-d99235644708" />
    </div>
  );
}

export default function J14EntreprisePage() {
  return (
    <Suspense fallback={<div className="size-full flex items-center justify-center">Chargement...</div>}>
      <J14EntrepriseContent />
    </Suspense>
  );
}








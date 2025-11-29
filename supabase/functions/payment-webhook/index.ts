import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const fedapaySecretKey = Deno.env.get('FEDAPAY_SECRET_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const webhookData = await req.json();
    console.log('Received FedaPay webhook:', JSON.stringify(webhookData));

    // FedaPay sends transaction data in webhook
    const transaction = webhookData.entity || webhookData;
    const transactionId = transaction.id;
    const status = transaction.status;
    const requestId = transaction.custom_metadata?.request_id;

    console.log(`Transaction ${transactionId} status: ${status}`);

    if (!requestId) {
      console.error('No request_id in webhook data');
      return new Response(
        JSON.stringify({ error: 'Missing request_id' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update company request based on payment status
    let newStatus = 'pending';
    if (status === 'approved' || status === 'transferred') {
      newStatus = 'payment_confirmed';
    } else if (status === 'declined' || status === 'canceled') {
      newStatus = 'payment_failed';
    }

    const { error: updateError } = await supabase
      .from('company_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request:', updateError);
      throw updateError;
    }

    console.log(`Request ${requestId} updated to status: ${newStatus}`);

    // Send notification email if payment is confirmed
    if (newStatus === 'payment_confirmed') {
      const { data: request } = await supabase
        .from('company_requests')
        .select('email, contact_name, tracking_number')
        .eq('id', requestId)
        .single();

      if (request) {
        // Call send-notification function
        await supabase.functions.invoke('send-notification', {
          body: {
            to: request.email,
            subject: 'Confirmation de paiement - LegalForm',
            html: `
              <h2>Paiement confirmé !</h2>
              <p>Bonjour ${request.contact_name},</p>
              <p>Nous avons bien reçu votre paiement pour votre demande de création d'entreprise.</p>
              <p><strong>Numéro de suivi :</strong> ${request.tracking_number || requestId}</p>
              <p>Nous allons maintenant traiter votre dossier. Vous recevrez un email dès que votre entreprise sera créée.</p>
              <p>Cordialement,<br>L'équipe LegalForm</p>
            `
          }
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, status: newStatus }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in payment-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

serve(handler);

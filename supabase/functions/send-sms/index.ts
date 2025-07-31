import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, content, clientName } = await req.json()

    // Récupérer les paramètres Twilio depuis les secrets
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured')
    }

    // Préparer le contenu du SMS avec les variables remplacées
    const personalizedContent = content
      .replace(/{prenom}/g, clientName?.split(' ')[0] || 'Client')
      .replace(/{nom}/g, clientName?.split(' ')[1] || '')
      .replace(/{nom_complet}/g, clientName || 'Client')
      .replace(/{heure}/g, new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

    // Créer l'authentification Basic pour Twilio
    const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`)

    // Préparer les données pour Twilio
    const smsData = new URLSearchParams({
      To: to,
      From: twilioPhoneNumber,
      Body: personalizedContent
    })

    // Envoyer le SMS via Twilio
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: smsData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Twilio error:', errorText)
      throw new Error(`Twilio API error: ${response.status}`)
    }

    const responseData = await response.json()
    console.log('SMS envoyé:', responseData.sid)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'SMS envoyé avec succès',
        status: 'delivered',
        sid: responseData.sid
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erreur envoi SMS:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        status: 'failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
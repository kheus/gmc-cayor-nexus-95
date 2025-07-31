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
    const { to, subject, content, clientName } = await req.json()

    // Récupérer la clé API SendGrid depuis les secrets
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
    if (!sendgridApiKey) {
      throw new Error('SendGrid API key not configured')
    }

    // Préparer le contenu de l'email avec les variables remplacées
    const personalizedContent = content
      .replace(/{prenom}/g, clientName?.split(' ')[0] || 'Client')
      .replace(/{nom}/g, clientName?.split(' ')[1] || '')
      .replace(/{nom_complet}/g, clientName || 'Client')

    // Préparer les données pour SendGrid
    const emailData = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject
        }
      ],
      from: {
        email: "noreply@gmc.sn",
        name: "GMC Sénégal"
      },
      content: [
        {
          type: "text/plain",
          value: personalizedContent
        },
        {
          type: "text/html",
          value: personalizedContent.replace(/\n/g, '<br>')
        }
      ]
    }

    // Envoyer l'email via SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SendGrid error:', errorText)
      throw new Error(`SendGrid API error: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès',
        status: 'delivered'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erreur envoi email:', error)
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
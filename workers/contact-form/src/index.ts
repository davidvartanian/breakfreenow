export interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TO_EMAIL: string;
}

const ALLOWED_ORIGINS = [
  'https://breakfreenow.co',
  'https://www.breakfreenow.co',
  'http://localhost:4321',
  'http://localhost:4322',
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, corsOrigin);
    }

    try {
      const body = await request.json<{ turnstileToken: string; name: string; email: string; subject: string; message: string }>();

      if (!body.turnstileToken || !body.name || !body.email || !body.message) {
        return jsonResponse({ error: 'Missing required fields' }, 400, corsOrigin);
      }

      // Verify Turnstile token
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: body.turnstileToken,
        }),
      });

      const verifyData = await verifyRes.json<{ success: boolean; 'error-codes'?: string[] }>();
      if (!verifyData.success) {
        return jsonResponse({ error: 'Turnstile verification failed' }, 400, corsOrigin);
      }

      // Send email via Resend
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: env.RESEND_TO_EMAIL,
          subject: `Contact: ${body.subject || 'No subject'}`,
          text: `Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
          reply_to: body.email,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error('Resend error:', errText);
        return jsonResponse({ error: 'Failed to send email' }, 500, corsOrigin);
      }

      return jsonResponse({ success: true }, 200, corsOrigin);

    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Internal server error' }, 500, corsOrigin);
    }
  },
};

function jsonResponse(data: unknown, status: number, corsOrigin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOrigin,
    },
  });
}

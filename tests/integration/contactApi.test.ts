import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

describe('Contact API Endpoint (/api/contact)', () => {
  it('accepts valid inquiry payload and returns reference code', async () => {
    const validPayload = {
      project_type: 'Web Applications',
      description: 'Building an enterprise-grade collaborative workspace with WebSockets and Next.js.',
      platform: 'Web',
      features: ['Authentication', 'Real-time functionality'],
      budget: '₹1 lakh–₹2 lakh',
      project_stage: 'Planning',
      design_preference: 'Futuristic',
      name: 'Sarah Connor',
      email: 'sarah@sky.net',
      phone: '+1 800-555-0199',
      company: 'Cyberdyne Systems'
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.99'
      },
      body: JSON.stringify(validPayload)
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.referenceCode).toBeDefined();
    expect(data.referenceCode).toMatch(/^SL-[A-Z0-9]{6}$/);
  });

  it('rejects invalid payload with 422 and field errors', async () => {
    const invalidPayload = {
      project_type: '',
      description: 'Too short',
      budget: '',
      project_stage: '',
      name: '',
      email: 'invalid-email'
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.101'
      },
      body: JSON.stringify(invalidPayload)
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.success).toBe(false);
    expect(data.fieldErrors).toBeDefined();
    expect(data.fieldErrors.email).toBeDefined();
  });

  it('rejects non-JSON payload with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'x-forwarded-for': '127.0.0.102'
      },
      body: 'invalid-non-json-string'
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});

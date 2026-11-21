import { describe, it, expect, vi } from 'vitest';
import { GET as getProjects, POST as createProject } from '@/app/api/admin/projects/route';
import { GET as getInquiries, PATCH as patchInquiry } from '@/app/api/admin/inquiries/route';
import { GET as getSettings, POST as postSettings } from '@/app/api/admin/settings/route';
import { NextRequest } from 'next/server';

// Mock cookies and Supabase auth to simulate an unauthenticated request
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
    set: () => {},
  })),
}));

vi.mock('@/lib/auth/admin', () => ({
  SUPER_ADMIN_EMAIL: 'techshivendraa@gmail.com',
  getAuthenticatedAdmin: vi.fn(async () => null), // simulate unauthenticated by default
  requireAdmin: vi.fn(),
  requireSuperAdmin: vi.fn(),
  logActivity: vi.fn(async () => {}),
}));

describe('Admin API Protection & Security Boundaries', () => {
  it('blocks unauthenticated GET request to /api/admin/projects with 401', async () => {
    const res = await getProjects();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('blocks unauthenticated POST request to /api/admin/projects with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Secret Project', slug: 'secret-project' })
    });

    const res = await createProject(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('blocks unauthenticated GET request to /api/admin/inquiries with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/inquiries');
    const res = await getInquiries(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('blocks unauthenticated PATCH request to /api/admin/inquiries with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'some-id', status: 'In Review' })
    });

    const res = await patchInquiry(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('blocks unauthenticated GET request to /api/admin/settings with 401', async () => {
    const res = await getSettings();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });

  it('blocks unauthenticated POST request to /api/admin/settings with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandStatement: 'New statement' })
    });

    const res = await postSettings(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });
});

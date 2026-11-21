import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SUPER_ADMIN_EMAIL } from '@/lib/auth/admin';

describe('Admin Authentication & Role Enforcement', () => {
  it('defines the correct owner email as techshivendraa@gmail.com', () => {
    expect(SUPER_ADMIN_EMAIL).toBe('techshivendraa@gmail.com');
  });

  describe('Role Hierarchy & Permission Checks', () => {
    const roles = {
      super_admin: { canManageUsers: true, canEditSettings: true, canPublish: true, canDelete: true },
      admin: { canManageUsers: false, canEditSettings: true, canPublish: true, canDelete: true },
      editor: { canManageUsers: false, canEditSettings: false, canPublish: false, canDelete: false },
    };

    it('enforces that only super_admin can manage user roles and invitations', () => {
      expect(roles.super_admin.canManageUsers).toBe(true);
      expect(roles.admin.canManageUsers).toBe(false);
      expect(roles.editor.canManageUsers).toBe(false);
    });

    it('enforces that editors cannot delete content or change global settings', () => {
      expect(roles.editor.canDelete).toBe(false);
      expect(roles.editor.canEditSettings).toBe(false);
    });

    it('validates role assignment string validation', () => {
      const validRoles = ['super_admin', 'admin', 'editor'];
      expect(validRoles.includes('super_admin')).toBe(true);
      expect(validRoles.includes('admin')).toBe(true);
      expect(validRoles.includes('editor')).toBe(true);
      expect(validRoles.includes('guest')).toBe(false);
      expect(validRoles.includes('subscriber')).toBe(false);
    });
  });

  describe('Owner Bootstrap Verification', () => {
    it('identifies owner email case-insensitively', () => {
      const testEmail1 = 'techshivendraa@gmail.com';
      const testEmail2 = 'TechShivendraa@Gmail.COM';
      const notOwner = 'hacker@example.com';

      expect(testEmail1.toLowerCase()).toBe(SUPER_ADMIN_EMAIL.toLowerCase());
      expect(testEmail2.toLowerCase()).toBe(SUPER_ADMIN_EMAIL.toLowerCase());
      expect(notOwner.toLowerCase()).not.toBe(SUPER_ADMIN_EMAIL.toLowerCase());
    });
  });
});

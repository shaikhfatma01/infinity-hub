import { api } from './apiClient';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersPage {
  success: true;
  users: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const adminService = {
  async getUsers(page: number, search: string): Promise<AdminUsersPage> {
    return api.get<AdminUsersPage>('/admin/users', {
      page,
      pageSize: 20,
      search,
    });
  },
};

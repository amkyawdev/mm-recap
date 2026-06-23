import { account } from "./client";

export const authService = {
  async register(email, password, name) {
    return await account.create("unique()", email, password, name);
  },

  async login(email, password) {
    return await account.createEmailPasswordSession(email, password);
  },

  async logout() {
    return await account.deleteSession("current");
  },

  async getUser() {
    return await account.get();
  },

  async updateName(name) {
    return await account.updateName(name);
  },

  async updatePassword(password, oldPassword) {
    return await account.updatePassword(password, oldPassword);
  },

  async createMagicSession(email) {
    return await account.createMagicURLToken("unique()", email, true);
  },
};

import { APIRequestContext, APIResponse } from "@playwright/test";

export class GitHubApiService {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiBaseUrl: string,
  ) {}

  async getAuthenticatedUser(): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/user`);
  }

  async getRepository(owner: string, repository: string): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/repos/${owner}/${repository}`);
  }

  async createRepository(
    name: string,
    description: string,
  ): Promise<APIResponse> {
    return this.request.post(`${this.apiBaseUrl}/user/repos`, {
      data: {
        name,
        description,
        private: true,
        auto_init: true,
      },
    });
  }

  async deleteRepository(
    owner: string,
    repository: string,
  ): Promise<APIResponse> {
    return this.request.delete(
      `${this.apiBaseUrl}/repos/${owner}/${repository}`,
    );
  }
}

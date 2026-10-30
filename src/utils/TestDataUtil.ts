import { randomUUID } from "crypto";

export class TestDataUtil {
  private constructor() {}

  static generateUniqueName(prefix: string): string {
    const sanitizedPrefix = TestDataUtil.sanitizeName(prefix);

    const timestamp = Date.now();
    const uniqueId = randomUUID().replace(/-/g, "").substring(0, 8);

    return `${sanitizedPrefix}-${timestamp}-${uniqueId}`;
  }

  static generateRepositoryName(prefix: string): string {
    const repositoryName = TestDataUtil.generateUniqueName(prefix);

    return repositoryName.substring(0, 100);
  }

  static generateNonexistentOwner(prefix: string): string {
    const ownerName = TestDataUtil.generateUniqueName(prefix);

    return ownerName.substring(0, 39);
  }

  static sanitizeName(value: string): string {
    const sanitizedValue = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[._-]+|[._-]+$/g, "");

    if (!sanitizedValue) {
      throw new Error(
        "The test-data prefix must contain at least one valid character.",
      );
    }

    return sanitizedValue;
  }
}

import { test, expect } from "@playwright/test";
import { TestDataUtil } from "../../src/utils/TestDataUtil";

test.describe("TestDataUtil", () => {
  test("should generate unique repository names", () => {
    const firstName = TestDataUtil.generateRepositoryName(
      "AIQE Test Repository",
    );

    const secondName = TestDataUtil.generateRepositoryName(
      "AIQE Test Repository",
    );

    expect(firstName).toMatch(/^aiqe-test-repository-\d+-[a-f0-9]{8}$/);

    expect(secondName).toMatch(/^aiqe-test-repository-\d+-[a-f0-9]{8}$/);

    expect(firstName).not.toBe(secondName);
    expect(firstName.length).toBeLessThanOrEqual(100);
  });

  test("should generate a valid nonexistent owner name", () => {
    const owner = TestDataUtil.generateNonexistentOwner(
      "Nonexistent AIQE Owner",
    );

    expect(owner).toMatch(/^nonexistent-aiqe-owner-\d+-[a-f0-9]+$/);

    expect(owner.length).toBeLessThanOrEqual(39);
  });

  test("should sanitize invalid name characters", () => {
    const sanitizedName = TestDataUtil.sanitizeName(
      "  AIQE Test @ Repository !!!  ",
    );

    expect(sanitizedName).toBe("aiqe-test-repository");
  });

  test("should reject a prefix without valid characters", () => {
    expect(() => TestDataUtil.sanitizeName("!!!")).toThrow(
      "The test-data prefix must contain at least one valid character.",
    );
  });
});

import { describe, expect, it } from "vitest";
import { formatCPF, isValidCPF } from "@/features/announcement/fn";

describe("isValidCPF", () => {
  describe("valid CPF numbers", () => {
    it("should validate correctly formatted CPF", () => {
      expect(isValidCPF("123.456.789-09")).toBe(true);
      expect(isValidCPF("111.444.777-35")).toBe(true);
      expect(isValidCPF("987.654.321-00")).toBe(true);
    });

    it("should validate unformatted CPF", () => {
      expect(isValidCPF("12345678909")).toBe(true);
      expect(isValidCPF("11144477735")).toBe(true);
      expect(isValidCPF("98765432100")).toBe(true);
    });

    it("should validate CPF with mixed formatting", () => {
      expect(isValidCPF("123.456789-09")).toBe(true);
      expect(isValidCPF("123456.789-09")).toBe(true);
    });
  });

  describe("invalid CPF patterns", () => {
    it("should reject CPFs with all same digits", () => {
      expect(isValidCPF("111.111.111-11")).toBe(false);
      expect(isValidCPF("222.222.222-22")).toBe(false);
      expect(isValidCPF("000.000.000-00")).toBe(false);
      expect(isValidCPF("11111111111")).toBe(false);
    });

    it("should reject CPFs with wrong length", () => {
      expect(isValidCPF("123.456.789")).toBe(false);
      expect(isValidCPF("123.456.789-0")).toBe(false);
      expect(isValidCPF("123.456.789-090")).toBe(false);
      expect(isValidCPF("123456789")).toBe(false);
      expect(isValidCPF("1234567890")).toBe(false);
      expect(isValidCPF("123456789090")).toBe(false);
    });

    it("should reject CPFs with invalid check digits", () => {
      expect(isValidCPF("123.456.789-00")).toBe(false);
      expect(isValidCPF("123.456.789-10")).toBe(false);
      expect(isValidCPF("111.444.777-00")).toBe(false);
    });

    it("should reject empty or invalid input", () => {
      expect(isValidCPF("")).toBe(false);
      expect(isValidCPF("abc.def.ghi-jk")).toBe(false);
      expect(isValidCPF("123.abc.789-09")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle special characters in input", () => {
      expect(isValidCPF("123.456.789-09")).toBe(true);
      expect(isValidCPF("123@456#789$09")).toBe(true);
      expect(isValidCPF("123 456 789 09")).toBe(true);
    });

    it("should handle very long strings", () => {
      expect(isValidCPF("123456789091234567890")).toBe(false);
    });
  });
});

describe("formatCPF", () => {
  describe("progressive formatting", () => {
    it("should format numbers up to 3 digits", () => {
      expect(formatCPF("1")).toBe("1");
      expect(formatCPF("12")).toBe("12");
      expect(formatCPF("123")).toBe("123");
    });

    it("should format numbers 4-6 digits with first dot", () => {
      expect(formatCPF("1234")).toBe("123.4");
      expect(formatCPF("12345")).toBe("123.45");
      expect(formatCPF("123456")).toBe("123.456");
    });

    it("should format numbers 7-9 digits with two dots", () => {
      expect(formatCPF("1234567")).toBe("123.456.7");
      expect(formatCPF("12345678")).toBe("123.456.78");
      expect(formatCPF("123456789")).toBe("123.456.789");
    });

    it("should format 10+ digits with complete formatting", () => {
      expect(formatCPF("1234567890")).toBe("123.456.789-0");
      expect(formatCPF("12345678909")).toBe("123.456.789-09");
      expect(formatCPF("123456789091")).toBe("123.456.789-09");
    });
  });

  describe("special character handling", () => {
    it("should strip non-numeric characters", () => {
      expect(formatCPF("123.456.789-09")).toBe("123.456.789-09");
      expect(formatCPF("123@456#789$09")).toBe("123.456.789-09");
      expect(formatCPF("123 456 789 09")).toBe("123.456.789-09");
      expect(formatCPF("abc123def456ghi789jkl09")).toBe("123.456.789-09");
    });

    it("should handle empty input", () => {
      expect(formatCPF("")).toBe("");
    });

    it("should handle only non-numeric characters", () => {
      expect(formatCPF("abc")).toBe("");
      expect(formatCPF("...")).toBe("");
      expect(formatCPF("---")).toBe("");
    });
  });

  describe("length limits", () => {
    it("should truncate input longer than 11 digits", () => {
      expect(formatCPF("123456789091234567890")).toBe("123.456.789-09");
    });

    it("should handle exactly 11 digits", () => {
      expect(formatCPF("12345678909")).toBe("123.456.789-09");
    });
  });

  describe("real-world scenarios", () => {
    it("should format as user types progressively", () => {
      const inputs = [
        "1",
        "12",
        "123",
        "1234",
        "12345",
        "123456",
        "1234567",
        "12345678",
        "123456789",
        "1234567890",
        "12345678909",
      ];
      const expected = [
        "1",
        "12",
        "123",
        "123.4",
        "123.45",
        "123.456",
        "123.456.7",
        "123.456.78",
        "123.456.789",
        "123.456.789-0",
        "123.456.789-09",
      ];

      inputs.forEach((input, index) => {
        expect(formatCPF(input)).toBe(expected[index]);
      });
    });

    it("should handle copy-paste scenarios", () => {
      expect(formatCPF("12345678909")).toBe("123.456.789-09");
      expect(formatCPF("123.456.789-09")).toBe("123.456.789-09");
    });
  });
});

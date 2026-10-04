import { describe, it, expect } from "vitest";
import { getWhatsAppUrl } from "../lib/whatsapp";

describe("getWhatsAppUrl", () => {
  it("returns the base URL when no message is provided", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "1234567890";
    expect(getWhatsAppUrl()).toBe("https://wa.me/1234567890");
  });

  it("appends the encoded message when provided", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "1234567890";
    expect(getWhatsAppUrl("Hello World!")).toBe(
      "https://wa.me/1234567890?text=Hello%20World!",
    );
  });
});

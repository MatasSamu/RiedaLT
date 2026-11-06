const storageKey = "riedalt-discount-codes";

const initialDiscountCodes = [
  {
    id: 1,
    code: "RLT-NU25-7KQ4M8ZP-T",
    amount: 25,
    validFrom: "2026-11-01",
    validUntil: "2026-12-31",
    uses: 0,
  },
];

export function getDiscountCodes() {
  const storedCodes = localStorage.getItem(storageKey);

  if (!storedCodes) {
    return initialDiscountCodes;
  }

  try {
    const codes = JSON.parse(storedCodes);
    const migratedCodes = codes.map((discount) => {
      if (isGeneratedCode(discount.code)) {
        return discount;
      }

      return {
        ...discount,
        code: generateDiscountCode(Number(discount.amount)),
      };
    });

    if (JSON.stringify(codes) !== JSON.stringify(migratedCodes)) {
      saveDiscountCodes(migratedCodes);
    }

    return migratedCodes;
  } catch {
    return initialDiscountCodes;
  }
}

export function saveDiscountCodes(codes) {
  localStorage.setItem(storageKey, JSON.stringify(codes));
}

function getPrefix(amount) {
  if (amount <= 10) {
    return "MA";
  }

  if (amount <= 25) {
    return "NU";
  }

  if (amount <= 50) {
    return "DID";
  }

  return "VIP";
}

function getControlSymbol(value) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const checksum = [...value].reduce(
    (total, character, index) =>
      total + character.charCodeAt(0) * (index + 1),
    0,
  );

  return alphabet[checksum % alphabet.length];
}

function getRandomPart(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from({ length }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");
}

function isGeneratedCode(code) {
  return /^RLT-[A-Z]+[0-9]+-[A-Z0-9]{8}-[A-Z0-9]$/.test(code);
}

export function generateDiscountCode(amount) {
  const prefix = getPrefix(amount);
  const randomPart = getRandomPart();
  const codeWithoutControlSymbol = `${prefix}${amount}${randomPart}`;
  const controlSymbol = getControlSymbol(codeWithoutControlSymbol);

  return `RLT-${prefix}${amount}-${randomPart}-${controlSymbol}`;
}

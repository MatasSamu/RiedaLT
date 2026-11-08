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


export function validateDiscountCode(code) {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    throw new Error("Įveskite nuolaidos kodą.");
  }

  const discount = getDiscountCodes().find(
    (item) => item.code.toUpperCase() === normalizedCode
  );

  if (!discount) {
    throw new Error("Nuolaidos kodas nerastas.");
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayString = `${year}-${month}-${day}`;

  if (
    todayString < discount.validFrom ||
    todayString > discount.validUntil
  ) {
    throw new Error("Nuolaidos kodo galiojimo laikas pasibaigęs arba dar neprasidėjęs.");
  }

  const amount = Number(discount.amount);

  if (!Number.isFinite(amount) || amount < 1 || amount > 90) {
    throw new Error("Neteisinga nuolaidos reikšmė.");
  }

  return discount;
}


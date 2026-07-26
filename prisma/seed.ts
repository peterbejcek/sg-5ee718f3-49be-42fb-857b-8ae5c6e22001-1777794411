// Seed: tarifné pásma, konfigurácia (provízia, registračný poplatok) a prvý majiteľ.
// Spustenie: npm run seed  (potrebuje DATABASE_URL a voliteľne INITIAL_OWNER_*).
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_FEE_TIERS, DEFAULT_PROVISION_RATE, DEFAULT_REGISTRATION_FEE } from "../src/lib/fees";

const prisma = new PrismaClient();

async function main() {
  // 1) Tarifné pásma (len ak tabuľka prázdna).
  const tierCount = await prisma.feeTier.count();
  if (tierCount === 0) {
    await prisma.feeTier.createMany({
      data: DEFAULT_FEE_TIERS.map((t, i) => ({
        trzbaOd: t.trzbaOd,
        trzbaDo: t.trzbaDo,
        poplatok: t.poplatok,
        poradie: i,
      })),
    });
    console.log(`✅ Vytvorených ${DEFAULT_FEE_TIERS.length} tarifných pásiem.`);
  }

  // 2) Konfigurácia.
  await prisma.appSetting.upsert({
    where: { key: "provisionRate" },
    update: {},
    create: { key: "provisionRate", value: String(DEFAULT_PROVISION_RATE) },
  });
  await prisma.appSetting.upsert({
    where: { key: "registrationFee" },
    update: {},
    create: { key: "registrationFee", value: String(DEFAULT_REGISTRATION_FEE) },
  });
  console.log("✅ Konfigurácia (provízia, registračný poplatok) pripravená.");

  // 3) Prvý majiteľ.
  const ownerEmail = (process.env.INITIAL_OWNER_EMAIL || "").toLowerCase().trim();
  const ownerPassword = process.env.INITIAL_OWNER_PASSWORD || "";
  if (ownerEmail && ownerPassword) {
    const existing = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: ownerEmail,
          meno: process.env.INITIAL_OWNER_MENO || "Majiteľ",
          priezvisko: process.env.INITIAL_OWNER_PRIEZVISKO || "E-TAXI",
          passwordHash: await bcrypt.hash(ownerPassword, 10),
          mustSetPassword: false,
          aktivny: true,
          roles: { create: [{ role: "MAJITEL" }] },
        },
      });
      console.log(`✅ Vytvorený majiteľ: ${ownerEmail}`);
    } else {
      console.log(`ℹ️  Majiteľ ${ownerEmail} už existuje — preskočené.`);
    }
  } else {
    console.log(
      "ℹ️  INITIAL_OWNER_EMAIL / INITIAL_OWNER_PASSWORD nie sú nastavené — majiteľ nevytvorený."
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed zlyhal:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

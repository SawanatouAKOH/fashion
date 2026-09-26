import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    console.error(
      "Missing environment variables: ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the seed."
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    const isAdmin = existingUser.role === Role.ADMIN;
    const passwordNeedsUpdate = !(await bcrypt.compare(adminPassword, existingUser.passwordHash));

    if (!isAdmin || passwordNeedsUpdate) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          ...(isAdmin ? {} : { role: Role.ADMIN }),
          ...(passwordNeedsUpdate ? { passwordHash: hashedPassword } : {}),
        },
      });

      console.log(
        `Admin account already existed for ${adminEmail}. ${!isAdmin ? "Role was updated to ADMIN." : ""} ${passwordNeedsUpdate ? "Password was updated." : ""}`.trim()
      );
    } else {
      console.log(`Admin account already existed for ${adminEmail}; no changes were needed.`);
    }

    return;
  }

  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin account created for ${adminEmail}.`);
}

main()
  .catch((error) => {
    console.error("Error while seeding the admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MessageToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_B_fkey";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_MessageToUser";

-- CreateTable
CREATE TABLE "MessageNotification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MessageNotificationToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessageNotificationToUser_AB_unique" ON "_MessageNotificationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageNotificationToUser_B_index" ON "_MessageNotificationToUser"("B");

-- AddForeignKey
ALTER TABLE "_MessageNotificationToUser" ADD CONSTRAINT "_MessageNotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "MessageNotification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageNotificationToUser" ADD CONSTRAINT "_MessageNotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

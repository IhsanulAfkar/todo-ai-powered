/*
  Warnings:

  - You are about to drop the column `is_done` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Ongoing', 'Completed');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "is_done",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Pending';

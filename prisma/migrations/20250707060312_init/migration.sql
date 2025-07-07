-- CreateTable
CREATE TABLE "FileExpiry" (
    "id" SERIAL NOT NULL,
    "fileLink" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileExpiry_pkey" PRIMARY KEY ("id")
);

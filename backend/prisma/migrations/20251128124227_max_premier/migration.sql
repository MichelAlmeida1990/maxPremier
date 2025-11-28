-- AlterTable
ALTER TABLE "Visit" ADD COLUMN "nomeColaborador" TEXT;
ALTER TABLE "Visit" ADD COLUMN "setor" TEXT;
ALTER TABLE "Visit" ADD COLUMN "turno" TEXT;

-- CreateIndex
CREATE INDEX "Visit_setor_idx" ON "Visit"("setor");

-- CreateIndex
CREATE INDEX "Visit_turno_idx" ON "Visit"("turno");

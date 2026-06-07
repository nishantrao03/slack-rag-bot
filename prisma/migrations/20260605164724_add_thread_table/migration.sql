-- CreateTable
CREATE TABLE "Thread" (
    "thread_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("thread_id")
);

-- CreateIndex
CREATE INDEX "Thread_project_id_idx" ON "Thread"("project_id");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "ProviderProfile_serviceCategory_idx" ON "ProviderProfile"("serviceCategory");

-- CreateIndex
CREATE INDEX "ProviderProfile_location_idx" ON "ProviderProfile"("location");

-- CreateIndex
CREATE INDEX "ProviderProfile_rating_idx" ON "ProviderProfile"("rating");

-- CreateIndex
CREATE INDEX "ProviderProfile_isAvailable_idx" ON "ProviderProfile"("isAvailable");

-- CreateIndex
CREATE INDEX "Booking_clientId_idx" ON "Booking"("clientId");

-- CreateIndex
CREATE INDEX "Booking_providerId_idx" ON "Booking"("providerId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_clientId_status_idx" ON "Booking"("clientId", "status");

-- CreateIndex
CREATE INDEX "Booking_providerId_status_idx" ON "Booking"("providerId", "status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

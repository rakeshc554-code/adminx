# ADMINX — API Specification (OpenAPI 3.0)

**Version:** 1.0  
**Date:** June 2026  
**Document Type:** API Specification

---

## 1. Introduction

This document defines the RESTful API endpoints used by AdminX for synchronization, backup, and cloud services. All APIs are secured with Firebase Authentication (Bearer token). Data is transmitted in JSON format over HTTPS.

---

## 2. OpenAPI Specification

Below is the full OpenAPI 3.0 specification for AdminX backend services.

```yaml
openapi: 3.0.0
info:
  title: AdminX Backend API
  description: Cloud services for AdminX business management app
  version: 1.0.0
  contact:
    name: AdminX Support
    email: support@adminx.app

servers:
  - url: https://api.adminx.app/v1
    description: Production server
  - url: https://staging-api.adminx.app/v1
    description: Staging server

security:
  - bearerAuth: []

paths:
  /auth/verify:
    post:
      summary: Verify Firebase ID token
      operationId: verifyToken
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [idToken]
              properties:
                idToken:
                  type: string
                  description: Firebase ID token
      responses:
        '200':
          description: Token valid
          content:
            application/json:
              schema:
                type: object
                properties:
                  uid: { type: string }
                  email: { type: string }
                  name: { type: string }
                  phone: { type: string }

  /sync/pull:
    post:
      summary: Pull remote changes since last sync
      operationId: pullChanges
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, businessId, lastSyncTimestamp]
              properties:
                userId: { type: string }
                businessId: { type: string }
                lastSyncTimestamp: { type: integer, format: int64 }
      responses:
        '200':
          description: Changes returned
          content:
            application/json:
              schema:
                type: object
                properties:
                  changes:
                    type: array
                    items:
                      type: object
                      properties:
                        entity: { type: string, enum: [customer, product, transaction, invoice, employee] }
                        action: { type: string, enum: [create, update, delete] }
                        data: { type: object }
                        timestamp: { type: integer, format: int64 }
                  newTimestamp: { type: integer, format: int64 }

  /sync/push:
    post:
      summary: Push local changes to cloud
      operationId: pushChanges
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, businessId, changes]
              properties:
                userId: { type: string }
                businessId: { type: string }
                changes:
                  type: array
                  items:
                    type: object
                    properties:
                      entity: { type: string, enum: [customer, product, transaction, invoice, employee] }
                      action: { type: string, enum: [create, update, delete] }
                      data: { type: object }
                      timestamp: { type: integer, format: int64 }
      responses:
        '200':
          description: Sync accepted
          content:
            application/json:
              schema:
                type: object
                properties:
                  accepted: { type: boolean }
                  conflicts:
                    type: array
                    items:
                      type: object
                      properties:
                        entity: { type: string }
                        localVersion: { type: object }
                        remoteVersion: { type: object }

  /backup/create:
    post:
      summary: Create a full data backup
      operationId: createBackup
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, businessId, data]
              properties:
                userId: { type: string }
                businessId: { type: string }
                data: { type: object, description: Full business data dump }
      responses:
        '200':
          description: Backup created
          content:
            application/json:
              schema:
                type: object
                properties:
                  backupId: { type: string }
                  timestamp: { type: integer, format: int64 }
                  size: { type: integer }

  /backup/list:
    get:
      summary: List available backups
      operationId: listBackups
      parameters:
        - name: userId
          in: query
          required: true
          schema: { type: string }
        - name: businessId
          in: query
          required: true
          schema: { type: string }
      responses:
        '200':
          description: List of backups
          content:
            application/json:
              schema:
                type: object
                properties:
                  backups:
                    type: array
                    items:
                      type: object
                      properties:
                        id: { type: string }
                        timestamp: { type: integer, format: int64 }
                        size: { type: integer }

  /backup/restore:
    post:
      summary: Restore from a backup
      operationId: restoreBackup
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, businessId, backupId]
              properties:
                userId: { type: string }
                businessId: { type: string }
                backupId: { type: string }
      responses:
        '200':
          description: Restore successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  restoredAt: { type: integer, format: int64 }

  /notifications/send:
    post:
      summary: Send a notification via WhatsApp/SMS
      operationId: sendNotification
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, businessId, recipient, channel, message]
              properties:
                userId: { type: string }
                businessId: { type: string }
                recipient: { type: string, description: Phone number with country code }
                channel: { type: string, enum: [whatsapp, sms] }
                message: { type: string }
                template: { type: string, description: Template name if using pre-defined }
      responses:
        '200':
          description: Notification sent
          content:
            application/json:
              schema:
                type: object
                properties:
                  messageId: { type: string }
                  channel: { type: string }
                  status: { type: string, enum: [sent, queued, failed] }

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
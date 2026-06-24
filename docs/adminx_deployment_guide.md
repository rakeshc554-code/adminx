# ADMINX — Deployment Guide

**Version:** 1.0  
**Date:** June 2026  
**Document Type:** Deployment Guide

---

## 1. Introduction

This guide provides step-by-step instructions for deploying AdminX to production across all platforms: Android (Google Play), iOS (App Store), Web (Vercel/Netlify), and Desktop (Windows/macOS).

---

## 2. Prerequisites

### 2.1 Accounts & Credentials
- Google Play Console account ($25 one-time fee)
- Apple Developer account ($99/year)
- Firebase project (Blaze plan recommended for production)
- Domain: `adminx.app` (or chosen domain)
- SSL certificate (provided by hosting platform)
- GitHub/GitLab repository with CI/CD configured
- Sentry or Firebase Crashlytics for error monitoring

### 2.2 Build Tools
- Android Studio (latest) with Gradle
- Xcode 15+ (for iOS)
- Node.js 18+ (for web)
- Kotlin Multiplatform toolchain
- ONNX Runtime libraries for AI

---

## 3. Build Process

### 3.1 Shared Code (KMP)
```bash
# Build shared library for all platforms
./gradlew assemble
# Changelog

All notable changes to this project will be documented in this file.

This project follows Semantic Versioning.

---

## [1.0.3] - 2026-02-19

### Fixed
- Resolved state synchronization issue where second toggle would not reflect properly.
- Eliminated race condition between `set()` and `get()` calls from HomeKit.
- Implemented optimistic state updates with post-write verification.
- Improved responsiveness during rapid toggle sequences.

### Improved
- Reduced cache TTL for better HomeKit responsiveness.
- Added forced state verification after DSM write operation.
- Improved session handling stability under repeated toggles.

---

## [1.0.2] - 2026-02-19

### Fixed
- Added required `homebridge.accessory` metadata to `package.json`.
- Resolved accessory not appearing for HomeKit pairing.

### Improved
- Verified compatibility with Homebridge child bridge mode.

---

## [1.0.1] - 2026-02-19

### Improved
- Implemented intelligent state caching for faster HomeKit response.
- Added session caching to reduce redundant DSM authentication.
- Reduced DSM API calls during repeated state reads.
- Improved perceived toggle performance.

---

## [1.0.0] - 2026-02-19

### Initial Release (DSM 7 Modernization)

Forked from:
homebridge-synology-surveillance-homemode (original author: Jon Bell)

### Added
- DSM 7+ compatibility.
- Migration to `/webapi/entry.cgi`.
- Modern SYNO.API.Auth (v7) authentication.
- Session expiration handling with automatic re-authentication.
- HTTPS-only communication.
- Optional support for self-signed certificates.
- Web UI configuration (`config.schema.json`).
- Node.js >= 20 requirement.
- Homebridge >= 1.8.0 requirement.
- Child bridge compatibility.
- Debug logging option.

### Removed
- Legacy DSM 6 CGI endpoint usage.
- Deprecated authentication handling.
- Implicit session assumptions.


# Synology DSM7 Surveillance (HomeMode)

"homepage": "https://github.com/Romeo1984/homebridge-synology-dsm7-surveillance",
"repository": {
  "type": "git",
  "url": "git+https://github.com/Romeo1984/homebridge-synology-dsm7-surveillance.git"
}

Modern DSM 7+ compatible Homebridge plugin for controlling Surveillance Station HomeMode.

---

## Acknowledgment

This project is based on the original  
**homebridge-synology-surveillance-homemode** plugin  
created by **Jon Bell**.

Original repository:
https://github.com/jon-bell/homebridge-synology-surveillance-homemode

This project modernizes the original implementation to support:

- DSM 7+
- Modern authentication handling
- `/webapi/entry.cgi` routing
- Session caching and automatic re-authentication
- Node.js 20+
- Homebridge 1.8+ / 2.0 compatibility
- Web UI configuration
- Child bridge support

All credit for the original concept and initial implementation belongs to Jon Bell.

---

## Requirements

- Node.js >= 20
- Homebridge >= 1.8.0
- Synology DSM 7+

---

## Tested On

- Synology DSM (Node 22)
- Homebridge 1.11.x
- Homebridge 2.0 beta

---

## Setup

Create a dedicated non-2FA service account in DSM:

- Surveillance Station permission enabled
- No administrator privileges required

This plugin does not support 2FA-enabled accounts due to API limitations.

---

## Features

- HomeMode toggle
- Session caching
- Auto re-authentication
- Child bridge compatible
- Web UI configuration
- Optional debug logging

## Performance

This plugin uses intelligent state caching to ensure fast HomeKit responsiveness while minimizing DSM API calls.


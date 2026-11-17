# Jami3ati Security Specification

## 1. Access Control Model & Roles
- **Anonymous / Public Visitor**: Can read public verified catalog overrides (`/institution_overrides`, `/university_overrides`) and **approved** anonymous student feedbacks (`/feedbacks` where `status == 'approved'`). Can submit new anonymous feedbacks (`status` forced to `'pending'`) and new inaccuracy reports (`status` forced to `'pending'`) with validated fields. Cannot read pending/rejected feedbacks, cannot read `/reports`, cannot read `/users`, and cannot approve or modify any shared catalog data.
- **Authenticated User (`student`)**: Can read and update their own `/users/{userId}` document (cannot escalate `role`).
- **Moderator / Admin (`moderator` / `admin`)**: Authenticated via verified Google Auth (`request.auth.token.email_verified == true`), either having `/users/{uid}.data.role in ['admin', 'moderator']` or matching the bootstrapped admin email `7175ismail@gmail.com`. Full read and moderation update/delete permissions on `/feedbacks`, `/reports`, `/institution_overrides`, `/university_overrides`. Only `'admin'` can modify roles in `/users/{uid}`.

## 2. Collection Rules & Attack Vectors Prevented
| Collection | Access | Invariants & Mitigations |
|---|---|---|
| `/users/{userId}` | Owner read/create/update (no role change), Admin full | Prevents privilege escalation (`role` locked to `'student'` on self-create; `unchanged('role')` on self-update). |
| `/feedbacks/{feedbackId}` | Public read ONLY if `status == 'approved'`; Moderator read/update/delete all; Validated create (`status == 'pending'`) | Prevents self-publishing (`status` must be `'pending'` on create), rating tampering (`1..5`), oversized payloads (`size <= 1500`), and unauthorized moderation. |
| `/reports/{reportId}` | Moderator read/update/delete; Validated create (`status == 'pending'`) | Prevents exposing pending reports or reporter notes publicly; requires valid `http(s)://` `source_proof_url`. |
| `/institution_overrides/{instId}` | Public read (non-PII public institutional catalog); Moderator write | Prevents unauthorized tampering with official university/institution links and statuses. |
| `/university_overrides/{univId}` | Public read (non-PII public university catalog); Moderator write | Same as above. |
| Default catch-all `/{document=**}` | Deny all (`false`) | Closed by default. |

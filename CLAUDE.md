# CLAUDE.md — rules for working on this repo

1. `spec.md` is the source of truth. If something is unclear or conflicts, **ask me** instead of guessing.
2. **Raw SQL only** with parameterized queries (`$1, $2, …`). **No ORM, no auth library.** Follow the security checklist in `spec.md` §10.
3. Always explain in simple English what you're doing and why, so I understand it.
4. Work **one step at a time** from `spec.md` §14. End each step with a **"Check yourself"** block, then **wait for my OK** before the next step.
5. At the start of every session: read `CLAUDE.md`, `spec.md` and `plan.md`, and tell me the current step.
6. Keep `plan.md` updated: tick tasks as they finish, update "Current step", and mark a step done **only after I confirm the checks passed**. Never silently delete or rewrite tasks.
7. **Commit after each verified step. Never push.**

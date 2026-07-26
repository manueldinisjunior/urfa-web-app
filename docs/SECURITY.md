Security guidance

- Remove secrets from the repository history using a tool like `git filter-repo` or the BFG Repo-Cleaner.
- Rotate any secrets that were committed (database passwords, JWT secrets, API keys).
- Add local environment files (e.g. `backend/.env`) to `.gitignore` and keep only `backend/.env.example` in the repo.

Quick steps:

1. Rotate secrets (change DB password, issue new JWT secret).
2. Add `backend/.env` with new values and DO NOT commit it.
3. Clean history (example with BFG):

```bash
# Install BFG and run (from repo root)
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --replace-text replacements.txt
# then
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

If you want, I can help run these steps interactively or prepare the BFG replacements file.

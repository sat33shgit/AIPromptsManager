@echo off
git add scripts/seed.ts
git commit -m "Fix type error in seed script: handle null db"
git push origin master

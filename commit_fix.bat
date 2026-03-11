@echo off
git add app/api/upload/route.ts
git commit -m "Fix attachment URL to use relative path instead of localhost"
git push origin master

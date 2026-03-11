@echo off
git add .
git commit -m "Refine R2 storage and clean up codebase"
git checkout master
git merge storage

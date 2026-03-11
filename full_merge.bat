@echo off
echo --- Switching to storage ---
git checkout storage > merge_final.txt 2>&1
echo --- Adding changes ---
git add . >> merge_final.txt 2>&1
echo --- Committing ---
git commit -m "Refine R2 storage and clean up codebase" >> merge_final.txt 2>&1
echo --- Switching to master ---
git checkout master >> merge_final.txt 2>&1
echo --- Merging storage ---
git merge storage >> merge_final.txt 2>&1
echo --- DONE ---
echo ALL_DONE >> merge_final.txt

@echo off
git checkout master > out.txt 2>&1
git merge storage >> out.txt 2>&1
echo DONE >> out.txt

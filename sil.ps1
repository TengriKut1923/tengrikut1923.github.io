$remote = "origin"
$branch = "main"

git checkout --orphan temp_branch

git add -A
git commit -m "29.10.2023"

git branch -D $branch
git branch -m $branch

git push -f $remote $branch
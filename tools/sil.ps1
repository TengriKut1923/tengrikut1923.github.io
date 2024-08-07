# Remote ve branch bilgilerini alın
$remote = "origin"
$branch = "main"

# Eski commit'leri saklamak için yeni bir branch oluşturun
git checkout --orphan temp_branch

# Tüm dosyaları sahneye ekleyin ve yeni bir commit yapın
git add -A
git commit -m "29.10.2023"

# Mevcut branch'i yeni commit ile güncelleyin
git branch -D $branch
git branch -m $branch

# Remote branch'i sıfırlayın ve push edin
git push -f $remote $branch
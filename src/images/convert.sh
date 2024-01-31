#/bin/sh

for file in *.jpg *.jpeg *.png; do cwebp "$file" -o "${file%.*}.webp"; done;

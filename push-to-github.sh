#!/bin/bash
# InvoiceEase GitHub Push Script

# Ganti dengan username dan repository Anda
GITHUB_USER="Rzandi"
REPO_NAME="Project_Toko"
GITHUB_REPO="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "🚀 Pushing Project_Toko to GitHub..."
echo "Repository: $GITHUB_REPO"
echo ""

# Add remote
git remote add origin $GITHUB_REPO

# Push to GitHub
git branch -M main
git push -u origin main

echo ""
echo "✅ Push complete!"
echo "📍 View at: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "🎉 Next steps for hosting:"
echo "   - Frontend: Deploy to Vercel (https://vercel.com/import)"
echo "   - Backend: Deploy to Railway (https://railway.app)"
echo "   - Database: Use MongoDB Atlas (https://mongodb.com/atlas)"

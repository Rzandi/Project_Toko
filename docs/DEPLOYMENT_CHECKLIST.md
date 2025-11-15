# Deployment Checklist

## Pre-Deployment Verification

### Backend Readiness ✅
- [ ] All TypeScript files compile without errors
- [ ] Environment variables configured (`.env` or system vars)
- [ ] MongoDB connection tested and working
- [ ] All API endpoints tested with Postman/PowerShell
- [ ] Error handling in place
- [ ] Logging configured
- [ ] CORS configured for frontend domain
- [ ] Rate limiting configured
- [ ] Security headers (Helmet) enabled
- [ ] JWT secret is strong (32+ characters)

### Frontend Readiness ✅
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in dev tools
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] API integration tested
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Environment variables set (VITE_API_URL)
- [ ] No broken images or assets
- [ ] Forms validate correctly
- [ ] Toast notifications work

### Database Readiness ✅
- [ ] MongoDB 7.0+ installed and running
- [ ] Database name: `invoice-ease`
- [ ] Collections created (User, Transaction, Invoice, Client, Counter)
- [ ] Indexes created for performance
- [ ] Backup strategy in place
- [ ] Connection string secure

---

## Deployment Steps

### Step 1: Frontend to Cloud

#### Option A: Vercel
```bash
cd frontend
npm run build
npx vercel --prod
# Set VITE_API_URL to your backend URL
```

#### Option B: Netlify
```bash
cd frontend
npm run build
# Upload dist/ to Netlify
# Set environment variable VITE_API_URL
```

#### Option C: GitHub Pages
```bash
cd frontend
npm run build
# Push dist/ to gh-pages branch
```

### Step 2: Backend to Cloud

#### Option A: Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/invoice-ease
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

#### Option B: Railway.app
```bash
railway up
railway config:set MONGO_URI=mongodb+srv://...
railway config:set JWT_SECRET=your_secret_key
```

#### Option C: AWS EC2
```bash
ssh ec2-user@your-instance
git clone your-repo
cd backend
npm install
npm start
```

### Step 3: MongoDB Cloud Setup

#### Atlas (Recommended)
1. Go to mongodb.com/cloud/atlas
2. Create free tier cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/invoice-ease`
5. Add IP whitelist (or allow all for dev)

### Step 4: Environment Variables

**Backend (.env or platform dashboard):**
```env
PORT=4000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/invoice-ease
JWT_SECRET=your_very_secret_key_here_32_chars_min
NODE_ENV=production
```

**Frontend (.env.local or platform dashboard):**
```env
VITE_API_URL=https://your-backend.com/api/v1
```

### Step 5: DNS & SSL

- [ ] Domain configured to point to frontend
- [ ] SSL certificate installed (auto via Vercel/Netlify)
- [ ] Backend API accessible via HTTPS
- [ ] CORS configured for HTTPS domain

### Step 6: Post-Deployment Testing

- [ ] Visit frontend URL in browser
- [ ] Test registration with new email
- [ ] Test login
- [ ] Create transaction
- [ ] Create invoice
- [ ] Check MongoDB for persisted data
- [ ] Test error scenarios
- [ ] Monitor logs for errors

---

## Monitoring & Maintenance

### Ongoing Tasks
- [ ] Monitor API response times
- [ ] Check error logs daily
- [ ] Monitor database disk usage
- [ ] Review security logs
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Test backup restore process

### Performance Monitoring
- [ ] Lighthouse score > 80
- [ ] API response time < 200ms
- [ ] Database query time < 100ms
- [ ] Server uptime > 99%

### Security Monitoring
- [ ] SSL certificate valid
- [ ] No exposed API keys in logs
- [ ] JWT tokens secure
- [ ] CORS only allows frontend domain
- [ ] Rate limiting active
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

---

## Rollback Plan

If deployment fails:

1. **Frontend Issue:**
   - Revert to previous build in Vercel/Netlify
   - Roll back to previous commit on GitHub Pages

2. **Backend Issue:**
   - Scale down and redeploy with previous version
   - Use git rollback: `git revert <commit-hash>`
   - Restore from database backup if data corrupted

3. **Database Issue:**
   - Restore from latest backup
   - Verify data integrity
   - Re-run migration scripts if needed

---

## Production Optimization

### Frontend
- [ ] Minify all assets
- [ ] Compress images (WebP format)
- [ ] Enable gzip compression
- [ ] Configure CDN caching
- [ ] Remove source maps (or secure them)
- [ ] Lazy load components
- [ ] Optimize bundle chunks

### Backend
- [ ] Enable database connection pooling
- [ ] Configure caching headers
- [ ] Enable gzip compression
- [ ] Set up reverse proxy (nginx)
- [ ] Configure logging (not too verbose)
- [ ] Optimize database indexes
- [ ] Remove debug logging

### Database
- [ ] Enable backups (daily)
- [ ] Set up monitoring/alerts
- [ ] Verify indexes exist
- [ ] Monitor slow queries
- [ ] Archive old data if needed
- [ ] Plan for scaling

---

## Final Deployment Checklist

- [ ] All code committed and pushed
- [ ] No console warnings or errors
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Team informed of changes
- [ ] Backup created before deployment
- [ ] Deployment performed during low traffic
- [ ] Post-deployment tests all pass
- [ ] Monitoring alerts configured
- [ ] Team on standby for issues

---

## Support Contacts

**Issues?** Check:
1. Frontend console (F12) for client errors
2. Backend logs for API errors  
3. MongoDB logs for database errors
4. Platform dashboard for deployment status

---

**Deployment Status: READY ✅**

Last Updated: November 15, 2025

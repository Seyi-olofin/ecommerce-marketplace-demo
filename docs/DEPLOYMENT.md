# 🚀 Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Domain name (optional)
- SSL certificate (optional)

## Quick Deployment

### 1. Backend Deployment

```bash
cd backend
npm install --production
npm start
```

### 2. Frontend Deployment

#### Customer App
```bash
cd frontend-customer
npm install
npm run build
# Serve dist/ folder with any static server
```

#### Admin Dashboard
```bash
cd frontend-admin
npm install
npm run build
# Serve dist/ folder with any static server
```

## Environment Configuration

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
RAPIDAPI_KEY=your-rapidapi-key
PAYSTACK_SECRET=your-paystack-secret
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_ENV=production
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Firewall rules set
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented

## Performance Optimization

- Enable gzip compression
- Set up CDN for images
- Configure database indexing
- Enable Redis caching
- Set up load balancer

## Monitoring

- Server logs monitoring
- Database performance monitoring
- API response time tracking
- Error rate monitoring
- User analytics tracking

## Security

- HTTPS enabled
- Rate limiting active
- Input validation enabled
- CORS properly configured
- Sensitive data encrypted

## Scaling

- Horizontal scaling ready
- Database sharding configured
- CDN integration ready
- Microservices architecture prepared
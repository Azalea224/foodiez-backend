# Deployment Guide

## MongoDB Setup on VPS

### Option 1: Install MongoDB Locally on VPS

```bash
# Update system
sudo apt update

# Install MongoDB
sudo apt install -y mongodb

# Or for newer versions (MongoDB 6.0+)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod

# Verify MongoDB is running
mongo --eval "db.version()"
# Or for newer versions:
mongosh --eval "db.version()"
```

### Option 2: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodiez?retryWrites=true&w=majority
```

**Important:** Replace `username` and `password` with your MongoDB Atlas credentials.

## Environment Setup

1. Create `.env` file on VPS:
```bash
nano /root/BE/foodiez-backend/.env
```

2. Add your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodiez
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodiez?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=production
```

3. Save and exit (Ctrl+X, then Y, then Enter)

## Starting the Server

```bash
cd /root/BE/foodiez-backend
npm start
```

## Using PM2 (Process Manager - Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/index.js --name foodiez-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it provides

# Useful PM2 commands:
pm2 list          # List all processes
pm2 logs foodiez-api  # View logs
pm2 restart foodiez-api  # Restart
pm2 stop foodiez-api    # Stop
pm2 delete foodiez-api  # Remove
```

## Firewall Configuration

If you need to allow external connections:

```bash
# Allow port 3000
sudo ufw allow 3000

# Or for specific IP
sudo ufw allow from YOUR_IP to any port 3000
```

## Troubleshooting

### MongoDB Connection Issues

1. Check if MongoDB is running:
```bash
sudo systemctl status mongod
```

2. Check MongoDB logs:
```bash
sudo tail -f /var/log/mongodb/mongod.log
```

3. Test MongoDB connection:
```bash
mongosh
# Or: mongo
```

4. If using MongoDB Atlas, ensure:
   - Your IP is whitelisted in Network Access
   - Database user credentials are correct
   - Connection string is properly formatted

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```


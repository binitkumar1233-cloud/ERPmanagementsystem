const mongoose = require('mongoose');
const https = require('https');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

/* Resolve MongoDB Atlas SRV via DNS-over-HTTPS (bypasses system DNS blocks) */
function resolveAtlasSRV(host) {
    return new Promise((resolve) => {
        const req = https.get(
            `https://dns.google/resolve?name=_mongodb._tcp.${host}&type=SRV`,
            (res) => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        const records = (json.Answer || []).map(a => {
                            const [priority, weight, port, name] = a.data.trim().split(' ');
                            return { priority: +priority, weight: +weight, port: +port, name: name.replace(/\.$/, '') };
                        });
                        resolve(records);
                    } catch { resolve([]); }
                });
            }
        );
        req.on('error', () => resolve([]));
        req.setTimeout(5000, () => { req.destroy(); resolve([]); });
    });
}

async function buildURI(srvUri) {
    const m = srvUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/\?]+)(?:\/([^\?]*))?(?:\?(.*))?/);
    if (!m) return srvUri;
    const [, user, pass, host, db, qs] = m;

    const records = await resolveAtlasSRV(host);
    if (records.length === 0) return srvUri; // fallback to original

    const hosts = records.map(r => `${r.name}:${r.port}`).join(',');
    const dbName = db || 'schoolandcollegeerpmanagement';
    return `mongodb://${user}:${pass}@${hosts}/${dbName}?authSource=admin&ssl=true&retryWrites=true&w=majority&appName=Binit2`;
}

const connectDB = async (retries = 3) => {
    const rawUri = process.env.MONGO_URI;
    if (!rawUri) {
        console.error('❌  MONGO_URI is not set in .env — cannot connect to database');
        process.exit(1);
    }

    let uri = rawUri;
    if (rawUri.startsWith('mongodb+srv://')) {
        console.log('   Resolving Atlas SRV via DNS-over-HTTPS…');
        uri = await buildURI(rawUri);
        if (uri !== rawUri) console.log('   SRV resolved — using direct hosts');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 15000,
                connectTimeoutMS: 15000,
                socketTimeoutMS: 45000,
                family: 4,
            });
            console.log(`✅  MongoDB connected: ${conn.connection.host}`);
            await ensureDefaultAdmin();
            return;
        } catch (err) {
            console.error(`❌  MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`);
            if (attempt < retries) {
                console.log(`   Retrying in 5s…`);
                await new Promise(r => setTimeout(r, 5000));
            } else {
                console.error('❌  All MongoDB connection attempts failed. Check your MONGO_URI and Atlas IP whitelist.');
                console.error('   The server will continue running but all database operations will fail.');
            }
        }
    }
};

async function ensureDefaultAdmin() {
    try {
        const User = require('../models/User');
        const existing = await User.findOne({ email: 'binitkumar1233@gmail.com' });
        if (!existing) {
            await User.create({
                name: 'Binit Kumar Mandal',
                email: 'binitkumar1233@gmail.com',
                password: 'Admin@123',
                role: 'Super Admin',
                dept: 'Management',
                status: 'Active',
            });
            console.log('✅  Default admin created — email: binitkumar1233@gmail.com  password: Admin@123');
        }
    } catch (err) {
        console.error('   Could not seed admin:', err.message);
    }
}

module.exports = connectDB;

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import { execSync } from 'child_process';

// Helper for ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI Escape Codes for CLI styling
const reset = '\x1b[0m';
const bold = '\x1b[1m';
const dim = '\x1b[2m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';

function logWelcome() {
  console.log(`\n${cyan}${bold}▲ CREATE TCX BACKEND${reset} ${dim}v1.0.0${reset}`);
  console.log(`${dim}Scaffold a modern, production-ready Node.js backend in seconds.\n${reset}`);
}

async function main() {
  logWelcome();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // 1. Get Project Name
    let projectName = await rl.question(`${bold}✔ Project name:${reset} ${dim}(my-tcx-backend)${reset} `);
    projectName = projectName.trim() || 'my-tcx-backend';

    const isCurrentDir = projectName === '.';
    const targetDir = path.resolve(process.cwd(), projectName);
    const displayProjectName = isCurrentDir ? path.basename(targetDir) : projectName;

    if (isCurrentDir) {
      if (fs.existsSync(targetDir)) {
        const files = fs.readdirSync(targetDir);
        if (files.length > 0 && !files.every(f => f === '.git' || f === '.gitignore')) {
          console.log(`\n${yellow}⚠ Warning: Current directory is not empty.${reset}`);
          const proceed = await rl.question(`${bold}👉 Do you want to scaffold here anyway? (y/n, default: y):${reset} `);
          if (proceed.toLowerCase().trim() === 'n') {
            console.log(`\n${red}✖ Scaffolding cancelled.${reset}`);
            rl.close();
            process.exit(0);
          }
        }
      }
    } else if (fs.existsSync(targetDir)) {
      console.log(`\n${red}✖ Error: Directory '${projectName}' already exists.${reset}`);
      rl.close();
      process.exit(1);
    }

    // 2. Select Language (TypeScript vs JavaScript)
    console.log(`\n${bold}Select a language:${reset}`);
    console.log(`  ${cyan}1)${reset} TypeScript ${dim}(Recommended - type-safe and modern)${reset}`);
    console.log(`  ${cyan}2)${reset} JavaScript ${dim}(Standard Node.js ESM)${reset}`);
    let langChoice = await rl.question(`${bold}👉 Choose [1-2] (default: 1):${reset} `);
    langChoice = langChoice.trim() || '1';
    const language = langChoice === '2' ? 'js' : 'ts';

    // 3. Select Template (Express vs Fastify)
    console.log(`\n${bold}Select a framework template:${reset}`);
    console.log(`  ${cyan}1)${reset} Express.js ${dim}(Classic & highly compatible)${reset}`);
    console.log(`  ${cyan}2)${reset} Fastify    ${dim}(High performance & modern)${reset}`);
    let frameworkChoice = await rl.question(`${bold}👉 Choose [1-2] (default: 1):${reset} `);
    frameworkChoice = frameworkChoice.trim() || '1';
    const framework = frameworkChoice === '2' ? 'fastify' : 'express';

    // 4. Select Database (Prisma vs Mongoose vs None)
    console.log(`\n${bold}Select a database client:${reset}`);
    console.log(`  ${cyan}1)${reset} Prisma   ${dim}(SQL - PostgreSQL, MySQL, SQLite, etc.)${reset}`);
    console.log(`  ${cyan}2)${reset} Mongoose ${dim}(NoSQL - MongoDB)${reset}`);
    console.log(`  ${cyan}3)${reset} None     ${dim}(No database starter files)${reset}`);
    let dbChoice = await rl.question(`${bold}👉 Choose [1-3] (default: 1):${reset} `);
    dbChoice = dbChoice.trim() || '1';
    
    let database = 'none';
    if (dbChoice === '1') database = 'prisma';
    else if (dbChoice === '2') database = 'mongoose';

    // 5. Select Authentication (JWT vs None)
    console.log(`\n${bold}Select authentication starter code:${reset}`);
    console.log(`  ${cyan}1)${reset} JWT Authentication ${dim}(User signup/login routes, middleware, & hashing)${reset}`);
    console.log(`  ${cyan}2)${reset} None               ${dim}(Clean starter without auth logic)${reset}`);
    let authChoice = await rl.question(`${bold}👉 Choose [1-2] (default: 1):${reset} `);
    authChoice = authChoice.trim() || '1';
    const auth = authChoice === '2' ? 'none' : 'jwt';

    rl.close();

    console.log(`\n${cyan}⚙ Scaffold settings:${reset}`);
    console.log(`  • Directory: ${green}${isCurrentDir ? `${displayProjectName} (current directory)` : projectName}${reset}`);
    console.log(`  • Language:  ${green}${language === 'ts' ? 'TypeScript' : 'JavaScript'}${reset}`);
    console.log(`  • Framework: ${green}${framework}${reset}`);
    console.log(`  • Database:  ${green}${database}${reset}`);
    console.log(`  • Auth:      ${green}${auth === 'jwt' ? 'JWT (jsonwebtoken + bcryptjs)' : 'None'}${reset}`);

    const templatesDir = path.resolve(__dirname, '../templates');
    const sourceDir = path.join(templatesDir, `${framework}-${database}-${language}`);

    console.log(`\n${dim}Creating project files...${reset}`);

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy template directory if exists, otherwise generate dynamically
    if (fs.existsSync(sourceDir)) {
      fs.cpSync(sourceDir, targetDir, { recursive: true });
    } else {
      createFallbackTemplate(targetDir, displayProjectName, framework, database, language, auth);
    }

    // Update package.json in targetDir with the new project name
    const pkgJsonPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      pkg.name = displayProjectName;
      fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
    }

    console.log(`${green}✔ Project scaffolded successfully!${reset}`);

    // Optional: Setup git & run npm install automatically
    console.log(`\n${bold}Next steps:${reset}`);
    if (!isCurrentDir) {
      console.log(`  ${cyan}cd${reset} ${projectName}`);
    }
    console.log(`  ${cyan}npm install${reset}`);
    console.log(`  ${cyan}npm run dev${reset}\n`);

    console.log(`${green}${bold}Happy coding! 🚀${reset}\n`);

  } catch (err) {
    console.error(`\n${red}✖ An error occurred during scaffolding:${reset}`, err);
    rl.close();
    process.exit(1);
  }
}

function createFallbackTemplate(targetDir, projectName, framework, database, language, auth) {
  const isTs = language === 'ts';
  const ext = isTs ? 'ts' : 'js';
  const hasAuth = auth === 'jwt';
  
  // Setup fallback file structure
  const srcDir = path.join(targetDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  const pkgJson = {
    name: projectName,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: isTs ? {
      "build": "tsc",
      "start": "node dist/index.js",
      "dev": "tsx watch src/index.ts"
    } : {
      "start": "node src/index.js",
      "dev": "nodemon src/index.js"
    },
    dependencies: {},
    devDependencies: isTs ? {
      "tsx": "^4.7.1",
      "typescript": "^5.3.3",
      "@types/node": "^20.11.24"
    } : {
      "nodemon": "^3.1.0"
    }
  };

  let indexCode = '';

  const writeProjectFile = (relativePath, content) => {
    const filePath = path.join(targetDir, relativePath);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content.trim() + '\n');
  };

  if (framework === 'express') {
    pkgJson.dependencies['express'] = '^4.18.2';
    pkgJson.dependencies['dotenv'] = '^16.3.1';
    pkgJson.dependencies['cors'] = '^2.8.5';
    if (isTs) {
      pkgJson.devDependencies['@types/express'] = '^4.17.21';
      pkgJson.devDependencies['@types/cors'] = '^2.8.17';
    }
    if (hasAuth) {
      pkgJson.dependencies['jsonwebtoken'] = '^9.0.2';
      pkgJson.dependencies['bcryptjs'] = '^2.4.3';
      if (isTs) {
        pkgJson.devDependencies['@types/jsonwebtoken'] = '^9.0.6';
        pkgJson.devDependencies['@types/bcryptjs'] = '^2.4.6';
      }
    }
    if (database === 'prisma') {
      pkgJson.dependencies['@prisma/client'] = '^5.0.0';
      pkgJson.devDependencies['prisma'] = '^5.0.0';
    } else if (database === 'mongoose') {
      pkgJson.dependencies['mongoose'] = '^7.0.0';
    }

    // Write database connection
    let dbContent = '';
    if (database === 'mongoose') {
      dbContent = isTs ? `import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${projectName}');
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error: any) {
    console.error(\`Error connecting to MongoDB: \${error.message}\`);
    process.exit(1);
  }
};` : `import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${projectName}');
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error connecting to MongoDB: \${error.message}\`);
    process.exit(1);
  }
};`;
    } else if (database === 'prisma') {
      dbContent = isTs ? `import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully via Prisma Client.');
  } catch (error) {
    console.error('Error connecting to database via Prisma Client:', error);
    process.exit(1);
  }
};` : `import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully via Prisma Client.');
  } catch (error) {
    console.error('Error connecting to database via Prisma Client:', error);
    process.exit(1);
  }
};`;
    } else {
      dbContent = isTs ? `export const connectDB = async (): Promise<void> => {
  console.log('No database selected. Running server without database connection.');
};` : `export const connectDB = async () => {
  console.log('No database selected. Running server without database connection.');
};`;
    }
    writeProjectFile(`src/config/db.${ext}`, dbContent);

    // Prisma Schema
    if (database === 'prisma') {
      const prismaSchema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
      writeProjectFile('prisma/schema.prisma', prismaSchema);
    }

    // Auth middleware, controller, route, model
    if (hasAuth) {
      if (database === 'mongoose') {
        const userModel = `import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;`;
        writeProjectFile(`src/models/user.model.${ext}`, userModel);
      }

      const middlewareContent = isTs ? `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};` : `import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};`;
      writeProjectFile(`src/middleware/auth.middleware.${ext}`, middlewareContent);

      let controllerContent = '';
      if (database === 'mongoose') {
        controllerContent = isTs ? `import { Request, Response } from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware.js';

const generateToken = (id: any): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await (user as any).matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};` : `import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};`;
      } else if (database === 'prisma') {
        controllerContent = isTs ? `import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware.js';

const generateToken = (id: any): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};` : `import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};`;
      } else {
        controllerContent = isTs ? `import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware.js';

interface UserMock {
  id: string;
  name: string;
  email: string;
  password?: string;
}

const users: UserMock[] = [];

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: UserMock = { id: String(users.length + 1), name, email, password: hashedPassword };
    users.push(user);
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = users.find(u => u.email === email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<any> => {
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};` : `import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: String(users.length + 1), name, email, password: hashedPassword };
    users.push(user);
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = users.find(u => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};`;
      }
      writeProjectFile(`src/controllers/auth.controller.${ext}`, controllerContent);

      const routesContent = `import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;`;
      writeProjectFile(`src/routes/auth.routes.${ext}`, routesContent);
    }

    indexCode = isTs ? `import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
${hasAuth ? "import authRoutes from './routes/auth.routes.js';" : ""}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', framework: 'Express', database: '${database}' });
});

${hasAuth ? "app.use('/api/auth', authRoutes);" : ""}

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});` : `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
${hasAuth ? "import authRoutes from './routes/auth.routes.js';" : ""}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', framework: 'Express', database: '${database}' });
});

${hasAuth ? "app.use('/api/auth', authRoutes);" : ""}

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`;
  } else {
    // Fastify
    pkgJson.dependencies['fastify'] = '^4.21.0';
    pkgJson.dependencies['@fastify/cors'] = '^8.3.0';
    pkgJson.dependencies['dotenv'] = '^16.3.1';

    indexCode = `import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 5000;

await fastify.register(cors);

fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', framework: 'Fastify', database: '${database}' };
});
`;

    if (database === 'prisma') {
      pkgJson.dependencies['@prisma/client'] = '^5.0.0';
      pkgJson.devDependencies['prisma'] = '^5.0.0';
    } else if (database === 'mongoose') {
      pkgJson.dependencies['mongoose'] = '^7.0.0';
    }

    indexCode += `
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
`;
  }

  // Write files
  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));
  fs.writeFileSync(path.join(srcDir, `index.${ext}`), indexCode);
  fs.writeFileSync(path.join(targetDir, '.gitignore'), `node_modules/\n.env\ndist/\n`);
  fs.writeFileSync(path.join(targetDir, '.env'), `PORT=5000\nDATABASE_URL="file:./dev.db"\n`);
  fs.writeFileSync(path.join(targetDir, 'README.md'), `# ${projectName}\n\nGenerated with create-tcx-backend.\n`);

  if (isTs) {
    const tsconfig = {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        outDir: "./dist",
        rootDir: "./src"
      },
      include: ["src/**/*"]
    };
    fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  }
}

main();

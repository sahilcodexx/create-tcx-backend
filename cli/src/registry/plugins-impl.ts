import { registry } from './index.js';
import { ProjectContext } from './types.js';

// Helper to check if TypeScript is used
const getExt = (ctx: ProjectContext) => ctx.language === 'ts' ? 'ts' : 'js';

// Helper to create basic folders
const setupFolders = (ctx: ProjectContext) => {
  const ext = getExt(ctx);
  // Base health controller and routes
  ctx.files[`src/app/controllers/health.controller.${ext}`] = ctx.language === 'ts' ? `
import { Request, Response } from 'express';

export class HealthController {
  public static check(req: Request, res: Response): void {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}
` : `
export class HealthController {
  static check(req, res) {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}
`;

  // Base logger utility
  ctx.files[`src/utils/logger.${ext}`] = ctx.language === 'ts' ? `
export const logger = {
  info: (msg: string, ...args: any[]) => console.log(\`[INFO] \${msg}\`, ...args),
  error: (msg: string, ...args: any[]) => console.error(\`[ERROR] \${msg}\`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(\`[WARN] \${msg}\`, ...args),
};
` : `
export const logger = {
  info: (msg, ...args) => console.log(\`[INFO] \${msg}\`, ...args),
  error: (msg, ...args) => console.error(\`[ERROR] \${msg}\`, ...args),
  warn: (msg, ...args) => console.warn(\`[WARN] \${msg}\`, ...args),
};
`;

  // Config file
  ctx.files[`src/config/index.${ext}`] = `
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey123456789'
};
`;

  ctx.env['PORT'] = '5000';
  ctx.env['NODE_ENV'] = 'development';
  ctx.env['JWT_SECRET'] = 'supersecretkey123456789';
};

// ==========================================
// 1. FRAMEWORK PLUGINS
// ==========================================

// Express Plugin
registry.registerFramework('express', {
  name: 'express',
  onInstall(ctx) {
    ctx.dependencies['express'] = '^4.19.2';
    ctx.dependencies['cors'] = '^2.8.5';
    ctx.dependencies['dotenv'] = '^16.4.5';
    
    if (ctx.language === 'ts') {
      ctx.devDependencies['@types/express'] = '^4.17.21';
      ctx.devDependencies['@types/cors'] = '^2.8.17';
    } else {
      ctx.dependencies['nodemon'] = '^3.1.0';
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    setupFolders(ctx);

    ctx.scripts['start'] = ctx.language === 'ts' ? 'node dist/server.js' : 'node src/server.js';
    ctx.scripts['dev'] = ctx.language === 'ts' ? 'tsx watch src/server.ts' : 'nodemon src/server.js';
    if (ctx.language === 'ts') {
      ctx.scripts['build'] = 'tsc';
    }

    // src/app.ts
    ctx.files[`src/app.${ext}`] = ctx.language === 'ts' ? `
import express, { Express } from 'express';
import cors from 'cors';
import { HealthController } from './app/controllers/health.controller.js';
import { errorHandler } from './app/middlewares/error.middleware.js';

const app: Express = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', HealthController.check);

${ctx.auth !== 'none' ? "import authRoutes from './app/routes/auth.routes.js';\napp.use('/api/auth', authRoutes);" : ''}

// Error Handler
app.use(errorHandler);

export default app;
` : `
import express from 'express';
import cors from 'cors';
import { HealthController } from './app/controllers/health.controller.js';
import { errorHandler } from './app/middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', HealthController.check);

${ctx.auth !== 'none' ? "import authRoutes from './app/routes/auth.routes.js';\napp.use('/api/auth', authRoutes);" : ''}

// Error Handler
app.use(errorHandler);

export default app;
`;

    // src/server.ts
    ctx.files[`src/server.${ext}`] = `
import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { connectDatabase } from './database/index.js';

const start = async () => {
  try {
    await connectDatabase();
    app.listen(config.port, () => {
      logger.info(\`🚀 Server running on http://localhost:\${config.port} in \${config.env} mode\`);
    });
  } catch (err: any) {
    logger.error(\`Failed to start server: \${err.message}\`);
    process.exit(1);
  }
};

start();
`;

    // src/app/middlewares/error.middleware.ts
    ctx.files[`src/app/middlewares/error.middleware.${ext}`] = ctx.language === 'ts' ? `
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(\`Express Error Handler: \${err.message}\`);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};
` : `
import { logger } from '../../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(\`Express Error Handler: \${err.message}\`);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};
`;
  }
});

// Fastify Plugin
registry.registerFramework('fastify', {
  name: 'fastify',
  onInstall(ctx) {
    ctx.dependencies['fastify'] = '^4.28.1';
    ctx.dependencies['@fastify/cors'] = '^9.0.1';
    ctx.dependencies['dotenv'] = '^16.4.5';
    if (ctx.language === 'js') {
      ctx.dependencies['nodemon'] = '^3.1.0';
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    setupFolders(ctx);

    ctx.scripts['start'] = ctx.language === 'ts' ? 'node dist/server.js' : 'node src/server.js';
    ctx.scripts['dev'] = ctx.language === 'ts' ? 'tsx watch src/server.ts' : 'nodemon src/server.js';
    if (ctx.language === 'ts') {
      ctx.scripts['build'] = 'tsc';
    }

    // src/app.ts
    ctx.files[`src/app.${ext}`] = ctx.language === 'ts' ? `
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { logger } from './utils/logger.js';

const app: FastifyInstance = Fastify({ logger: false });

app.register(cors);

// Health check
app.get('/api/health', async () => {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

${ctx.auth !== 'none' ? "import authRoutes from './app/routes/auth.routes.js';\napp.register(authRoutes, { prefix: '/api/auth' });" : ''}

// Error Handler
app.setErrorHandler((error, request, reply) => {
  logger.error(\`Fastify Error: \${error.message}\`);
  reply.status(error.statusCode || 500).send({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
});

export default app;
` : `
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { logger } from './utils/logger.js';

const app = Fastify({ logger: false });

app.register(cors);

// Health check
app.get('/api/health', async () => {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

${ctx.auth !== 'none' ? "import authRoutes from './app/routes/auth.routes.js';\napp.register(authRoutes, { prefix: '/api/auth' });" : ''}

// Error Handler
app.setErrorHandler((error, request, reply) => {
  logger.error(\`Fastify Error: \${error.message}\`);
  reply.status(error.statusCode || 500).send({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
});

export default app;
`;

    // src/server.ts
    ctx.files[`src/server.${ext}`] = `
import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { connectDatabase } from './database/index.js';

const start = async () => {
  try {
    await connectDatabase();
    await app.listen({ port: config.port, host: '0.0.0.0' });
    logger.info(\`🚀 Server running on http://localhost:\${config.port} in \${config.env} mode\`);
  } catch (err: any) {
    logger.error(\`Failed to start Fastify server: \${err.message}\`);
    process.exit(1);
  }
};

start();
`;
  }
});

// Hono Plugin
registry.registerFramework('hono', {
  name: 'hono',
  onInstall(ctx) {
    ctx.dependencies['hono'] = '^4.4.7';
    ctx.dependencies['@hono/node-server'] = '^1.11.2';
    ctx.dependencies['dotenv'] = '^16.4.5';
    if (ctx.language === 'js') {
      ctx.dependencies['nodemon'] = '^3.1.0';
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    setupFolders(ctx);

    ctx.scripts['start'] = ctx.language === 'ts' ? 'node dist/server.js' : 'node src/server.js';
    ctx.scripts['dev'] = ctx.language === 'ts' ? 'tsx watch src/server.ts' : 'nodemon src/server.js';
    if (ctx.language === 'ts') {
      ctx.scripts['build'] = 'tsc';
    }

    // src/app.ts
    ctx.files[`src/app.${ext}`] = ctx.language === 'ts' ? `
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from './utils/logger.js';

const app = new Hono();

app.use('*', cors());

app.get('/api/health', (c) => {
  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

${ctx.auth !== 'none' ? "import authRoutes from './app/routes/auth.routes.js';\napp.route('/api/auth', authRoutes);" : ''}

app.onError((err, c) => {
  logger.error(\`Hono Error: \${err.message}\`);
  return c.json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  }, 500);
});

export default app;
` : `
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from './utils/logger.js';

const app = new Hono();

app.use('*', cors());

app.get('/api/health', (c) => {
  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

${ctx.auth !== 'none' ? "import authRoutes from './app/routes/auth.routes.js';\napp.route('/api/auth', authRoutes);" : ''}

app.onError((err, c) => {
  logger.error(\`Hono Error: \${err.message}\`);
  return c.json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  }, 500);
});

export default app;
`;

    // src/server.ts
    ctx.files[`src/server.${ext}`] = `
import { serve } from '@hono/node-server';
import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { connectDatabase } from './database/index.js';

const start = async () => {
  try {
    await connectDatabase();
    serve({
      fetch: app.fetch,
      port: config.port
    }, (info) => {
      logger.info(\`🚀 Hono server running on http://localhost:\${info.port} in \${config.env} mode\`);
    });
  } catch (err: any) {
    logger.error(\`Failed to start Hono server: \${err.message}\`);
    process.exit(1);
  }
};

start();
`;
  }
});

// ==========================================
// 2. ORM & DATABASE PLUGINS
// ==========================================

// None Database / None ORM plugin (creates simple connection mocks)
registry.registerDatabase('none', {
  name: 'none-db',
  onGenerate(ctx) {
    const ext = getExt(ctx);
    ctx.files[`src/database/index.${ext}`] = `
import { logger } from '../utils/logger.js';

export const connectDatabase = async () => {
  logger.info('No database connection configured.');
  return Promise.resolve();
};
`;
  }
});

// Mongoose ORM/ODM
registry.registerORM('mongoose', {
  name: 'mongoose',
  onInstall(ctx) {
    ctx.dependencies['mongoose'] = '^8.4.1';
    if (ctx.language === 'ts') {
      ctx.devDependencies['@types/node'] = '^22.0.0';
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    ctx.env['DATABASE_URL'] = ctx.database === 'mongodb' 
      ? 'mongodb://localhost:27017/tcx_backend' 
      : 'mongodb://localhost:27017/tcx_backend';

    ctx.files[`src/database/index.${ext}`] = `
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDatabase = async () => {
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/tcx_backend';
  try {
    await mongoose.connect(url);
    logger.info('🔌 Connected to MongoDB database using Mongoose');
  } catch (error: any) {
    logger.error(\`Database connection error: \${error.message}\`);
    throw error;
  }
};
`;
  }
});

// Prisma ORM
registry.registerORM('prisma', {
  name: 'prisma',
  onInstall(ctx) {
    ctx.dependencies['@prisma/client'] = '^5.14.0';
    ctx.devDependencies['prisma'] = '^5.14.0';
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    let provider = 'postgresql';
    let urlValue = 'postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public';

    if (ctx.database === 'mysql') {
      provider = 'mysql';
      urlValue = 'mysql://johndoe:randompassword@localhost:3306/mydb';
    } else if (ctx.database === 'sqlite') {
      provider = 'sqlite';
      urlValue = 'file:./dev.db';
    }

    ctx.env['DATABASE_URL'] = urlValue;

    ctx.files[`src/database/index.${ext}`] = `
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('🔌 Connected to database via Prisma Client');
  } catch (error: any) {
    logger.error(\`Failed to connect database via Prisma Client: \${error.message}\`);
    throw error;
  }
};
`;

    // Write schema.prisma
    ctx.files['prisma/schema.prisma'] = `
datasource db {
  provider = "${provider}"
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
}
`;

    ctx.scripts['db:generate'] = 'prisma generate';
    ctx.scripts['db:migrate'] = 'prisma migrate dev';
  }
});

// Drizzle ORM
registry.registerORM('drizzle', {
  name: 'drizzle',
  onInstall(ctx) {
    ctx.dependencies['drizzle-orm'] = '^0.31.2';
    ctx.devDependencies['drizzle-kit'] = '^0.22.7';
    if (ctx.database === 'postgres') {
      ctx.dependencies['pg'] = '^8.11.5';
      ctx.devDependencies['@types/pg'] = '^8.11.6';
    } else if (ctx.database === 'mysql') {
      ctx.dependencies['mysql2'] = '^3.9.8';
    } else if (ctx.database === 'sqlite') {
      ctx.dependencies['better-sqlite3'] = '^11.0.0';
      ctx.devDependencies['@types/better-sqlite3'] = '^7.6.10';
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    let dbType = 'postgresql';
    let connString = 'postgresql://johndoe:randompassword@localhost:5432/mydb';

    if (ctx.database === 'mysql') {
      dbType = 'mysql';
      connString = 'mysql://johndoe:randompassword@localhost:3306/mydb';
    } else if (ctx.database === 'sqlite') {
      dbType = 'sqlite';
      connString = 'dev.db';
    }

    ctx.env['DATABASE_URL'] = connString;

    // Drizzle Kit Config
    ctx.files['drizzle.config.ts'] = `
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: '${dbType === 'postgresql' ? 'postgresql' : dbType === 'mysql' ? 'mysql' : 'sqlite'}',
  dbCredentials: {
    url: process.env.DATABASE_URL || '${connString}'
  }
});
`;

    // database/schema.ts
    ctx.files[`src/database/schema.${ext}`] = `
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
`;

    // database/index.ts
    let dbImportsAndInst = '';
    if (ctx.database === 'postgres') {
      dbImportsAndInst = `
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || '${connString}',
});
export const db = drizzle(pool, { schema });
`;
    } else if (ctx.database === 'mysql') {
      dbImportsAndInst = `
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL || '${connString}');
export const db = drizzle(connection, { schema });
`;
    } else {
      // sqlite
      dbImportsAndInst = `
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';

const sqlite = new Database(process.env.DATABASE_URL || 'dev.db');
export const db = drizzle(sqlite, { schema });
`;
    }

    ctx.files[`src/database/index.${ext}`] = `
${dbImportsAndInst}
import { logger } from '../utils/logger.js';

export const connectDatabase = async () => {
  logger.info('🔌 Connected to database via Drizzle ORM');
  return Promise.resolve();
};
`;

    ctx.scripts['db:generate'] = 'drizzle-kit generate';
    ctx.scripts['db:migrate'] = 'drizzle-kit migrate';
  }
});

// PostgreSQL / MySQL / SQLite plugins (without ORM)
const registerNativeDb = (name: string, dep: string, connectCode: string, typesDep?: string) => {
  registry.registerDatabase(name, {
    name: `${name}-db`,
    onInstall(ctx) {
      if (ctx.orm === 'none') {
        ctx.dependencies[dep] = 'latest';
        if (ctx.language === 'ts' && typesDep) {
          ctx.devDependencies[typesDep] = 'latest';
        }
      }
    },
    onGenerate(ctx) {
      const ext = getExt(ctx);
      if (ctx.orm === 'none') {
        ctx.files[`src/database/index.${ext}`] = connectCode;
      }
    }
  });
};

registerNativeDb('postgres', 'pg', `
import pg from 'pg';
import { logger } from '../utils/logger.js';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb'
});

export const connectDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('🔌 Connected to PostgreSQL pool successfully');
  } catch (error: any) {
    logger.error(\`Failed to connect to PostgreSQL: \${error.message}\`);
    throw error;
  }
};
`, '@types/pg');

registerNativeDb('mysql', 'mysql2', `
import mysql from 'mysql2/promise';
import { logger } from '../utils/logger.js';

export let connection: mysql.Connection;

export const connectDatabase = async () => {
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://localhost:3306/mydb');
    logger.info('🔌 Connected to MySQL server successfully');
  } catch (error: any) {
    logger.error(\`Failed to connect to MySQL: \${error.message}\`);
    throw error;
  }
};
`);

registerNativeDb('sqlite', 'better-sqlite3', `
import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';

export let db: Database.Database;

export const connectDatabase = async () => {
  try {
    db = new Database(process.env.DATABASE_URL || 'dev.db');
    logger.info('🔌 Connected to SQLite database file successfully');
  } catch (error: any) {
    logger.error(\`Failed to connect to SQLite: \${error.message}\`);
    throw error;
  }
};
`, '@types/better-sqlite3');

registerNativeDb('mongodb', 'mongodb', `
import { MongoClient } from 'mongodb';
import { logger } from '../utils/logger.js';

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';
export const client = new MongoClient(url);
export let db: any;

export const connectDatabase = async () => {
  try {
    await client.connect();
    db = client.db('tcx_backend');
    logger.info('🔌 Connected to MongoDB client successfully');
  } catch (error: any) {
    logger.error(\`Failed to connect to MongoDB: \${error.message}\`);
    throw error;
  }
};
`);

// ==========================================
// 3. FEATURE PLUGINS
// ==========================================

// JWT Auth Plugin
registry.registerPlugin('auth-jwt', {
  name: 'auth-jwt',
  onInstall(ctx) {
    ctx.dependencies['jsonwebtoken'] = '^9.0.2';
    ctx.dependencies['bcryptjs'] = '^2.4.3';
    if (ctx.language === 'ts') {
      ctx.devDependencies['@types/jsonwebtoken'] = '^9.0.6';
      ctx.devDependencies['@types/bcryptjs'] = '^2.4.6';
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);

    // Auth Middleware
    ctx.files[`src/app/middlewares/auth.middleware.${ext}`] = ctx.language === 'ts' ? `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
` : `
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
`;

    // Auth controller
    ctx.files[`src/app/controllers/auth.controller.${ext}`] = ctx.language === 'ts' ? `
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../config/index.js';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Mock db register logic
      const token = jwt.sign({ name, email }, config.jwtSecret, { expiresIn: '30d' });
      res.status(201).json({ name, email, token });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      // Mock db login validation logic
      const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '30d' });
      res.status(200).json({ email, token });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
` : `
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../config/index.js';

export class AuthController {
  static async register(req, res) {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ name, email }, config.jwtSecret, { expiresIn: '30d' });
      res.status(201).json({ name, email, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '30d' });
      res.status(200).json({ email, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
`;

    // Auth Routes
    ctx.files[`src/app/routes/auth.routes.${ext}`] = `
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', protect, (req: any, res: any) => {
  res.json({ user: req.user });
});

export default router;
`;
  }
});

// Better Auth Plugin
registry.registerPlugin('auth-better-auth', {
  name: 'better-auth',
  onInstall(ctx) {
    ctx.dependencies['better-auth'] = '^0.2.0';
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    ctx.files[`src/config/auth.${ext}`] = `
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    // configured from your DB connection
  },
  emailAndPassword: {
    enabled: true
  }
});
`;
  }
});

// Zod Validation Plugin
registry.registerPlugin('validation-zod', {
  name: 'zod-validation',
  onInstall(ctx) {
    ctx.dependencies['zod'] = '^3.23.8';
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);

    ctx.files[`src/app/middlewares/validation.middleware.${ext}`] = ctx.language === 'ts' ? `
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors
      });
    }
  };
};
` : `
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors
      });
    }
  };
};
`;
  }
});

// Docker Plugin
registry.registerPlugin('docker', {
  name: 'docker',
  onGenerate(ctx) {
    ctx.files['Dockerfile'] = `
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
${ctx.language === 'ts' ? 'COPY tsconfig.json ./' : ''}
RUN npm install
COPY . .
${ctx.language === 'ts' ? 'RUN npm run build' : ''}

FROM node:22-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
`;

    ctx.files['.dockerignore'] = `
node_modules
dist
.env
Dockerfile
.git
`;
  }
});

// Swagger Plugin
registry.registerPlugin('swagger', {
  name: 'swagger',
  onInstall(ctx) {
    if (ctx.framework === 'express') {
      ctx.dependencies['swagger-ui-express'] = '^5.0.0';
      if (ctx.language === 'ts') {
        ctx.devDependencies['@types/swagger-ui-express'] = '^4.1.6';
      }
    }
  },
  onGenerate(ctx) {
    const ext = getExt(ctx);
    if (ctx.framework === 'express') {
      ctx.files[`src/config/swagger.${ext}`] = `
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '${ctx.projectName} API Docs',
    version: '1.0.0',
    description: 'Auto-generated API swagger documentation'
  },
  servers: [
    {
      url: 'http://localhost:5000'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health Check',
        responses: {
          '200': {
            description: 'Success response'
          }
        }
      }
    }
  }
};
`;
      // Mount inside app.ts or similar
    }
  }
});

// ESLint Plugin
registry.registerPlugin('eslint', {
  name: 'eslint',
  onInstall(ctx) {
    ctx.devDependencies['eslint'] = '^9.0.0';
    if (ctx.language === 'ts') {
      ctx.devDependencies['@typescript-eslint/eslint-plugin'] = '^7.0.0';
      ctx.devDependencies['@typescript-eslint/parser'] = '^7.0.0';
    }
  },
  onGenerate(ctx) {
    ctx.files['eslint.config.js'] = `
import js from '@eslint/js';
${ctx.language === 'ts' ? "import tseslint from 'typescript-eslint';" : ""}

export default [
  js.configs.recommended,
  ${ctx.language === 'ts' ? "...tseslint.configs.recommended," : ""}
  {
    rules: {
      'no-console': 'off',
      'semi': ['error', 'always']
    }
  }
];
`;
  }
});

// Prettier Plugin
registry.registerPlugin('prettier', {
  name: 'prettier',
  onInstall(ctx) {
    ctx.devDependencies['prettier'] = '^3.3.0';
  },
  onGenerate(ctx) {
    ctx.files['.prettierrc'] = JSON.stringify({
      semi: true,
      singleQuote: true,
      trailingComma: "none",
      printWidth: 100,
      tabWidth: 2
    }, null, 2);
  }
});

// Husky Plugin
registry.registerPlugin('husky', {
  name: 'husky',
  onInstall(ctx) {
    ctx.devDependencies['husky'] = '^9.0.11';
    ctx.devDependencies['lint-staged'] = '^15.2.5';
  },
  onGenerate(ctx) {
    ctx.scripts['prepare'] = 'husky';
    ctx.files['.lintstagedrc'] = JSON.stringify({
      "src/**/*.{js,ts}": [
        "eslint --fix",
        "prettier --write"
      ]
    }, null, 2);
  }
});

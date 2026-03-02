import Redis from 'ioredis';

class RedisManager {
  private static instance: RedisManager;
  private client: Redis;
  private isConnected: boolean = false;

  private constructor() {
    const user = process.env.REDIS_USER || 'default';
    const pass = process.env.REDIS_PASSWORD || '';
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT || '6379');

    this.client = new Redis({
      host,
      port,
      username: user !== 'default' ? user : undefined,
      password: pass || undefined,
      retryStrategy: (times: any) => {
        if (times > 100) {
          console.error('Redis max reconnection attempts reached');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', (err: any) => {
      this.isConnected = false;
      console.error('Redis error:', err.message);
    });

    this.client.on('connect', () => {
      console.log('Redis connecting...');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      console.log('✅ Redis connected successfully');
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.log('Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  public isRedisConnected(): boolean {
    return this.isConnected;
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

export const redisManager = RedisManager.getInstance();
export const getRedisClient = (): Redis => redisManager.getClient();
export const isRedisConnected = (): boolean => redisManager.isRedisConnected();

import 'dotenv/config';



export const baseOrmConfig: any =
{
    type: process.env.DATABASE_DRIVER,
    host: process.env.DATABASE_HOST,
    port: (process.env.DATABASE_PORT as any) as number,

    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    // url: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false },

    logging: false,

    synchronize: true,

    entities: ["dist/**/*/*.entity{.ts,.js}"],

    cli: {
        migrationsDir: "dist/database/migrations",
        entitiesDir: "src/**/*"
    }
}





import { DataSource } from 'typeorm';
import { baseOrmConfig } from './base_orm_config';

const dataSource = new DataSource({
    ...baseOrmConfig,
    entities: ["src/**/*/*.entity{.ts,.js}"],
    migrations: ["src/**/*/*-Migration{.ts,.js}"],
});

export default dataSource;

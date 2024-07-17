import { TypeOrmModule } from "@nestjs/typeorm";
import { seeder } from "nestjs-seeder";
import { baseOrmConfig } from "./database/base_orm_config";
import { UsersSeeder } from "./seeders/user.seeder";

seeder({
    imports: [
        TypeOrmModule.forRoot({ ...baseOrmConfig })
    ],
}).run([
    UsersSeeder,
]);
import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { User } from "../entities/user.entity";
import { UserRole, UserStatus } from "src/enum/user-role.enum";

@Injectable()
export class UsersSeeder implements Seeder {

    async seed(): Promise<any> {
        const nber = await User.count();
        if (nber > 10) return;
        const list: User[] = [
            {
                role: UserRole.admin,
                username: "admin",
                status: UserStatus.active,
                email: "admin@mailinator.com",
                password: "admin",
            }

        ] as any;
        const users: User[] = User.create(list);

        return await User.save(users);
    }

    async drop(): Promise<any> {
        return User.clear();
    }
}
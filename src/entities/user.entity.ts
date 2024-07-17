import { Entity, Column, Index, BeforeInsert, } from "typeorm";
import { Audit } from "./audit";
import { hash } from 'bcrypt';
import { UserRole, UserStatus } from "src/enum/user-role.enum";
import { Exclude } from "class-transformer";

@Entity("users")
export class User extends Audit {
    static entityName = "users";

    @Column({ nullable: true, unique: true })
    username?: string;

    @Column({ nullable: true })
    email?: string;

    @Exclude()
    @Column({ nullable: true })
    password?: string;


    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.user,
    })
    role?: UserRole;


    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.waiting,
    })
    status?: UserStatus;




    @BeforeInsert()
    async hashPassword() {
        this.email = this.email?.trim()?.toLowerCase();
        this.username = this.username?.trim();
        if (this.password)
            this.password = await hash(this.password, 10)
    }
}

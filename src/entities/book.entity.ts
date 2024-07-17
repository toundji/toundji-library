import { Entity, Column, BeforeInsert } from "typeorm";
import { Audit } from "./audit";

@Entity("books")
export class Book extends Audit {

    static entityName = "books";

    @Column({ nullable: true })
    title?: string;

    @Column({ nullable: true })
    author?: string;

    @Column({ nullable: true })
    publicationDate?: Date;

    @Column({ nullable: true })
    genres?: string;


    @BeforeInsert()
    async hashPassword() {
        this.title = this.title?.trim();
        this.author = this.author?.trim();
        this.genres = this.genres?.trim();
    }
}

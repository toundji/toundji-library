import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiErrorCreation, ApiErrorDelete, ApiErrorNotFound, ApiErrorTypeOrm, ApiErrorUpdate } from 'src/utils/api-error';
import { Book } from 'src/entities/book.entity';
import { BookDto, BookUp } from 'src/dto/book.dto';
import { Public, Roles } from 'src/utils/api.decorator';
import { UserRole } from 'src/enum/user-role.enum';


@Injectable()
export class BookService {

    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
    ) { }

    async create(bookDto: BookDto) {
        return await this.bookRepository.save(bookDto).catch(error => {
            Logger.error(error);
            throw new ApiErrorCreation("book")
        });
    }

    findAll() {
        return this.bookRepository.find({ loadEagerRelations: true, order: { createdAt: "DESC" } }).catch(error => {
            Logger.error(error);
            throw new ApiErrorTypeOrm("book");
        });
    }



    async findOne(id: number) {
        const book = await this.bookRepository.findOne({ where: { id: id } }).catch(error => {
            Logger.error(error);
            throw new ApiErrorTypeOrm("book");
        });
        if (!book) {
            throw new ApiErrorNotFound("book");
        }
        return book;
    }



    async update(id: number, updateBookDto: BookUp) {
        await this.bookRepository.update(id, updateBookDto).catch(error => {
            Logger.error(error);
            throw new ApiErrorUpdate("book");
        });
        return await this.findOne(id);
    }



    remove(id: number) {
        return this.bookRepository.delete(id).catch(error => {
            Logger.error(error);
            throw new ApiErrorDelete("book");
        });
    }
}

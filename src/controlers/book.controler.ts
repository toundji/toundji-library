import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Book } from '../entities/book.entity';
import { BookDto, BookUp } from '../dto/book.dto';
import { UserRole } from 'src/enum/user-role.enum';
import { Public, Roles } from 'src/utils/api.decorator';
import { BookService } from 'src/services/book.service';


@ApiTags("books")
@ApiBearerAuth('token')
@Controller('books')
export class BookController {

    constructor(private readonly bookService: BookService) { }

    @Roles(UserRole.admin)
    @Post()
    create(@Body() bookDto: BookDto): Promise<Book> {
        return this.bookService.create(bookDto);
    }

    @Get()
    findAll(): Promise<Book[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Book> {
        return this.bookService.findOne(+id);
    }

    @Roles(UserRole.admin)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateBookDto: BookUp): Promise<Book> {
        return this.bookService.update(+id, updateBookDto);
    }

    @Roles(UserRole.admin)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.bookService.remove(+id);
    }

}

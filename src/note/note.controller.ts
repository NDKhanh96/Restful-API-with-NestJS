import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../decorator';
import { InsertNoteDTO, UpdateNoteDTO } from '../dto';

@UseGuards(CustomJwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  insertNote(
    @GetUser('id') userId: number,
    @Body() insertNoteDto: InsertNoteDTO,
  ) {
    return this.noteService.insertNote(userId, insertNoteDto);
  }

  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @Get(':id')
  getNoteById(@Param('id', ParseIntPipe) noteId: number) {
    return this.noteService.getNoteById(noteId);
  }

  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNoteDto: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(noteId, updateNoteDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteNoteById(@Query('id', ParseIntPipe) noteId: number){
    return this.noteService.deleteNoteById(noteId);
  }
}

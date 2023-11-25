import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertNoteDTO, UpdateNoteDTO } from '../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async insertNote(userId: number, insertNoteDto: InsertNoteDTO) {
    return this.prismaService.note.create({
      data: {
        ...insertNoteDto,
        userId,
      },
    });
  }

  getNotes(userId: number) {
    return this.prismaService.note.findMany({
      where: {
        userId,
      },
    });
  }

  getNoteById(noteId: number) {}

  updateNoteById(noteId: number, updateNoteDto: UpdateNoteDTO) {
    console.log(noteId);
    const note = this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });
    if (!note) {
      throw new ForbiddenException('Can not find note to update');
    }
    return this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: { ...updateNoteDto },
    });
  }

  deleteNoteById(noteId: number) {
    const note = this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });
    if (!note) {
      throw new ForbiddenException('Can not find note to delete');
    }
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}

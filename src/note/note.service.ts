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

  getNoteById(noteId: number) {
    return this.prismaService.note.findFirst({
      where: {
        id: noteId,
      },
    });
  }

  updateNoteById(noteId: number, updateNoteDto: UpdateNoteDTO) {
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

  async deleteNoteById(noteId: number) {
    const note = this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });
    if (!note) {
      throw new ForbiddenException('Cannot find Note to delete');
    }
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}

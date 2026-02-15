import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.service.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  }

  getBySlug(slug: string) {
    return this.prisma.service.findUnique({ where: { slug } });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(input: { name: string; email: string; password: string; role?: Role }) {
    const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role ?? Role.CLIENT,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return { user, token: this.sign(user) };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new BadRequestException('Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new BadRequestException('Invalid credentials');

    const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
    return { user: safe, token: this.sign(safe) };
  }

  sign(user: { id: string; email: string; role: Role }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }
}

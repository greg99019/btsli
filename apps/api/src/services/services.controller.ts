import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Get()
  list() {
    return this.services.list();
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.services.getBySlug(slug);
  }
}

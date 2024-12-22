import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  async create(@Request() req, @Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(req.user._id, createProgressDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.progressService.findAllByUser(req.user._id);
  }

  @Get('latest')
  async getLatest(@Request() req) {
    return this.progressService.getLatestProgress(req.user._id);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.progressService.getProgressStats(req.user._id);
  }
}

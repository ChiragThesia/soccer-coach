import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
  ) {}

  async create(userId: string, createProgressDto: CreateProgressDto): Promise<ProgressDocument> {
    const createdProgress = new this.progressModel({
      userId,
      ...createProgressDto,
    });
    return createdProgress.save();
  }

  async findAllByUser(userId: string): Promise<ProgressDocument[]> {
    return this.progressModel
      .find({ userId })
      .sort({ date: -1 })
      .exec();
  }

  async getLatestProgress(userId: string): Promise<ProgressDocument | null> {
    return this.progressModel
      .findOne({ userId })
      .sort({ date: -1 })
      .exec();
  }

  async getProgressStats(userId: string) {
    const progress = await this.progressModel
      .find({ userId })
      .sort({ date: 1 })
      .exec();

    if (!progress.length) {
      return {
        totalSessions: 0,
        averageJuggles: 0,
        averageKickDistance: 0,
        bestJuggles: 0,
        bestKickDistance: 0,
      };
    }

    const totalSessions = progress.length;
    const averageJuggles = progress.reduce((acc, curr) => acc + curr.juggles, 0) / totalSessions;
    const averageKickDistance = progress.reduce((acc, curr) => acc + curr.kickDistance, 0) / totalSessions;
    const bestJuggles = Math.max(...progress.map(p => p.juggles));
    const bestKickDistance = Math.max(...progress.map(p => p.kickDistance));

    return {
      totalSessions,
      averageJuggles,
      averageKickDistance,
      bestJuggles,
      bestKickDistance,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ViewCommonService } from './common.service';

@Injectable()
export class ViewService extends ViewCommonService {}

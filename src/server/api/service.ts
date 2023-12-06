import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(private readonly httpService: HttpService) {}

    public request<T>(config: AxiosRequestConfig<T>): Promise<T | AxiosError> {
        return new Promise((resolve, reject) => {
            firstValueFrom(
                this.httpService.request({
                    ...config,
                    headers: {
                        'Content-Type': 'application/json',
                        ...config.headers,
                    },
                })
            )
                .then((response) => resolve(response.data))
                .catch(reject);
        });
    }
}

import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export class HttpRequester {
    public getToUrl = async <T>(
     url: string,
     params: AxiosRequestConfig<any> | undefined,
     catchFunction: (error: any) => void,
     extractFunction: (response: void | AxiosResponse<any, any>) => T
    ): Promise<T> => {
        const response = await axios.get(url, params).catch(e => catchFunction(e));
        return extractFunction(response);
    }
}
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {logger} from "../../utils/container/container";

export class HttpRequester {
    public getToUrl = async <T>(
     url: string,
     params: AxiosRequestConfig<any> | undefined,
     catchFunction: (error: any) => void,
     extractFunction: (response: void | AxiosResponse<any, any>) => T
    ): Promise<T> => {
        logger.logDebugFromEntity(`Attempting HTTP GET\n 
                                   URL: ${url}\n
                                   Params: ${params}`
            , this.constructor);

        const response = await axios.get(url, params).catch(e => {
            logger.logDebugFromEntity(`Attempt HTTP GET to URL ${url} has failed.`, this.constructor);
            catchFunction(e)
        });

        logger.logDebugFromEntity(`Attempt HTTP GET to URL ${url} was successful.`, this.constructor);
        return extractFunction(response);
    }
}
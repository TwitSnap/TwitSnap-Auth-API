import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {logger} from "../../utils/container/container";

export class HttpRequester {
    public getToUrl = async <T>(
     url: string,
     params: AxiosRequestConfig<any> | undefined,
     catchFunction: (error: any) => void,
     extractFunction: (response: void | AxiosResponse<any, any>) => T
    ): Promise<T> => {
        // ? Logea la request que se va a hacer junto con su ID unico
        const requestId = this.getRequestUniqueId();
        logger.logDebugFromEntity(`Attempting HTTP request...
                                   ID: ${requestId}\n
                                   Verb: GET\n
                                   URL: ${url}\n
                                   Params: ${params}`
            , this.constructor);

        // ? Obtiene una response en caso de que haya ido ok, en caso de error lo catchea y handlea
        const response = await axios.get(url, params).catch(e => {
            logger.logDebugFromEntity(`Attempt HTTP request
                                        ID: ${requestId}\n
                                        Verb: GET\n
                                        URL: ${url}\n
                                        Params: ${params}\n
                                        Result: FAILED`
                , this.constructor);
            catchFunction(e)
        });

        // ? Logea resultado exitoso
        logger.logDebugFromEntity(`Attempt HTTP request
                                        ID: ${requestId}\n
                                        Verb: GET\n
                                        URL: ${url}\n
                                        Params: ${params}\n
                                        Result: SUCCESS`
                , this.constructor);
        return extractFunction(response);
    }

    private getRequestUniqueId = (): string => {
        return new Date().toISOString();
    }
}
import { GoogleResolverStrategy } from './GoogleAuthResolverStrategy';
import { logger } from './../../utils/container/container';
import { UnknownTypeError } from './errors/UnknownType';
import { ResolverStrategy } from './ResolverStrategy';
import {NormalResolverStrategy} from "./NormalResolverStrategy"

export class ResolverBuilder{
    public match = (type:string): ResolverStrategy =>{
        switch (type){
            case "Normal":
                console.log("se entro en tipo normal");
                return new NormalResolverStrategy();
            case "GAuth":
                return new GoogleResolverStrategy();
            default:
                throw new UnknownTypeError("Tipo de conexion desconocida");
        }
    }
}
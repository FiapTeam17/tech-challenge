import { SystemBaseException } from "@common";

export class ErrorToAccessClienteServiceException extends SystemBaseException {
    public readonly code = "sgr.errorToAccessClientService";
    public readonly message = "Erro ao acessar o serviço cliente";
    public readonly httpStatus = 500;
}
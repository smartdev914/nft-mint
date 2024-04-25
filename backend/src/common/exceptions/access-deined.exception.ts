import { MessageError } from "@/message";
import { ForbiddenException } from "@nestjs/common";

export class AccessDeniedException extends ForbiddenException {
    constructor() {
        super(MessageError.ACCESS_DENIED());
    }
}
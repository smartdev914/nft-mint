import { MessageError, MessageName } from "@/message";
import { BadRequestException } from "@nestjs/common";

export class ExpiredException extends BadRequestException {
    constructor(text: MessageName) {
        super(MessageError.EXPIRED(text));
    }
}
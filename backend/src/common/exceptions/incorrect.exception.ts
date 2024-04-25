import { MessageError, MessageName } from "@/message";
import { BadRequestException } from "@nestjs/common";

export class IncorrectException extends BadRequestException {
    constructor(text: MessageName) {
        super(MessageError.INCORRECT(text));
    }
}
import { MessageError, MessageName } from "@/message";
import { BadRequestException } from "@nestjs/common";

export class NotfoundException extends BadRequestException {
    constructor(text: MessageName) {
        super(MessageError.NOT_FOUND(text));
    }
}
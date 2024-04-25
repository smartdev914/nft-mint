import { MessageError, MessageName } from "@/message";
import { BadRequestException } from "@nestjs/common";

export class ExistsException extends BadRequestException {
    constructor(text: MessageName) {
        super(MessageError.EXISTS(text));
    }
}
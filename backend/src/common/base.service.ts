import { MessageName } from "@/message";
import { NotfoundException } from "@exceptions/not-found.exception";
import { FindOneOptions, Repository } from "typeorm";

export interface Pagination<T> {
    total: number;
    data: T[];
}

export interface RemoveResult {
    removed: number;
}

export abstract class BaseService<T, K, V> {
    constructor(private name: string, private repository: Repository<T>) {}

    abstract findAll(filterDto?): Promise<T[] | Pagination<T>>;

    async findById(id: number, options?: FindOneOptions<T>): Promise<T> {
        return await this.repository.findOneBy({ id, ...options } as any);
    }

    async create(createDto: K): Promise<T> {
        return await this.repository.save(createDto as any);
    }

    async remove(id: string | number): Promise<RemoveResult> {
        const removed = await this.repository.delete(id);

        return {
            removed: removed.affected
        }
    }

    async update(id: string | number, updateDto?: V | Partial<T>): Promise<T> {
        const toUpdate = await this.repository.findOne({ where: { id } as any });
        if(!toUpdate) {
            throw new NotfoundException(this.name as MessageName);
        }

        const updated = Object.assign(toUpdate, updateDto);
        return this.repository.save(updated);
    }
}
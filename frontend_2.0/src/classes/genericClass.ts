import { MutableRefObject } from "react";
import { interfaceStateType} from "../types";
import { GenericClassInterface } from "../interfaces";

export abstract class GenericClass<T> implements GenericClassInterface<T> {
    state: interfaceStateType
    setState: (newState: interfaceStateType) => any

    id?: string
    setId: (id: string) => any

    obj?: T
    setObj: (obj: T) => any

    collectionId: string = ""

    constructor(id?: string) {
        this.state = {}
        this.setState = (state) => {}

        this.id = id
        this.setId = (id) => {}

        this.setObj = (obj) => {}
    }

    async initialize(id?: string) {
        return
    }

    async get<T>(id: string): Promise<T | void> {
        return
    }
}
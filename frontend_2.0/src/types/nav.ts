export type stateType = {
    id: string 
    
    prevName?: string
    prevState?: stateType
}

export type navigationLinkType = {
    name: string 
    state: stateType
}
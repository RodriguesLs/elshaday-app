export class Person {
    id?: string;
    personType?: PersonType;
    document?: string;
    name?: string;
    nickname?: string;
    address?: string;
}

enum PersonType {
    simple,
    juridic
}

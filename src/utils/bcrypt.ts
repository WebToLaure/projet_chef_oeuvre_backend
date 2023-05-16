import * as bcrypt from 'bcrypt';


const salt = 10;

export function encodePassword(password: string) {


    return bcrypt.hashSync(password, salt);
}
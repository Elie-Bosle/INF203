"use strict";

import { Std, FrStdt } from "./exercise3.mjs";
import { writeFileSync, readFileSync } from "fs";

export class Promotion {
    constructor() {
        this.students = [];
    }

    add(student) {
        this.students.push(student);
    }

    size() {
        return this.students.length;
    }

    get(i) {
        return this.students[i];
    }

    print() {
        let output = "";
        for (const student of this.students) {
            output += `${student.toString()}\n`;
        }
        console.log(output);
        return output;
    }

    write() {
        return JSON.stringify(this.students);
    }

    read(str) {
        let fileJSON = JSON.parse(str);
        for (const std in fileJSON) {
            let student = fileJSON[std];

            if (Object.keys(student).length == 3) {
                let a = new Std(student.lastName, student.firstName, student.id);
                this.add(a);

            }
            else {
                let a = new FrStdt(student.lastName, student.firstName, student.id, student.nationality);
                this.add(a);
            }
        }
    }

    saveF(fileName) {
        writeFileSync(fileName, this.write());
    }

    readF(fileName) {
        let data = readFileSync(fileName, 'utf-8');
        this.read(data);
    }
}

//var myJSON = [{ "lastName": "Chris", "firstName": "Lolos", "id": "38" }, { "lastName": "Christof", "firstName": "Lala", "id": "12", "nationality": "France" }];
//var string = "Bosle Elie 12"
//var elie = new Std("elie", "bosle", "12")
//var promo = new Promotion();
//promo.add(elie)
//var promo2 = new Promotion()
//promo.read(myJSON);
//console.log(promo.write())
//console.log(promo.read(promo.write()))
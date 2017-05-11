
/**
 * Index class
 */
export default class index {

    private _name:string; // private name variable

    /**
     * @description adds two numbers together
     * 
     * @param {number} a first number to add
     * @param {number} b second number to add
     * 
     * @returns {number}
     */
    add(a:number, b:number):number {
        return a + b;
    }

    /**
     * @description subtracts two numbers together
     * 
     * @param {number} a first number to subtract
     * @param {number} b second number to subtract
     * 
     * @returns {number}
     */
    subtract(a:number, b:number):number {
        return a - b;
    }

    /**
     * @description divides two numbers together
     * 
     * @param {number} a first number to divide
     * @param {number} b second number to divide
     * 
     * @returns {number}
     */
    divide(a:number, b:number):number {
        return a / b;
    }

    /**
     * @description multiplies two numbers together
     * 
     * @param {number} a first number to multiply
     * @param {number} b second number to multiply
     * 
     * @returns {number}
     */
    multiply(a:number, b:number):number {
        return a * b;
    }
}
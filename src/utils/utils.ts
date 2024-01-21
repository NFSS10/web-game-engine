abstract class Utils {
    static generateUUID(): string {
        const now = Date.now();

        const num1 = Math.floor(Math.random() * 100000000);
        const num2 = Math.floor(Math.random() * 100000000);

        const uuid = `${now}-${num1}-${num2}`;

        return uuid;
    }

    static generateUUIDNumber(): number {
        const randomNumber = Math.floor(Math.random() * 100000000);
        const idStr = `${Date.now()}${randomNumber}`.slice(4);
        const uuid = parseInt(idStr);

        return uuid;
    }
}

export { Utils };

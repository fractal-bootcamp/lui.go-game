

export const arrayGenerator = (rowsAndCols: number) : string[][] => {
    if (rowsAndCols <= 0 || rowsAndCols >= 999 ) {
        throw new Error("Rows and columns must be positive integers under 999.");
    }
    const array = [];
    for (let i = 0; i < rowsAndCols; i++) {
        array[i] = [];
        for (let j = 0; j < rowsAndCols; j++) {
            array[i][j] = ""
            // no idea why this is getting red text because it works great
        }
    }
    return array;
}

// const testArray = arrayGenerator(9)
// console.log(testArray)
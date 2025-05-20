const isNegative = (num: string | number) => {
    if (typeof(num) === 'string') {
        return num.charAt(0) === '-' 
    }

    return num < 0;
}

export { isNegative }
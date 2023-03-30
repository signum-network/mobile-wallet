export const shortenString = (str: string, trimOffset: number = 12) : string => {
    return str.length > trimOffset ? str.substring(0, trimOffset) + '…' : str;
}
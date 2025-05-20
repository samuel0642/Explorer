/*
* Parse transactions in the form '{851bf6fbf7a976327817c738c489d7fa657752445430922d94c983c0b9ed4609,851bf6fbf7a976327817c738c489d7fa657752445430922d94c983c0b9ed4609}'
* @param transactionString The string to parse
*/
function parseTransactionIdsInBlockData(transactionIdsString: string): Array<string> {
    if (transactionIdsString == "{}") {
        return []
    }
    
    return transactionIdsString.replaceAll("{", "").replaceAll("}", "").split(",")
}

export { parseTransactionIdsInBlockData }
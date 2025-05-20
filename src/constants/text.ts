const TOOLTIP_DESCRIPTIONS = Object.freeze({
    // General Blockchain Concepts
    hash: "Unique identifier of the block, derived from its contents.",
    height: "Position of the block in the blockchain sequence.",
    hex: "Hexadecimal representation of the transaction data.",
    is_overwintered: "Indicates if the transaction uses the Overwinter protocol upgrade.",
    num_inputs: "Number of input transactions.",
    num_outputs: "Number of output transactions.",
    size: "Total size of the transaction in bytes.",
    timestamp: "Time when the block was mined, in Unix format.",
    total_public_input: "Sum of ZEC values of all input transactions.",
    total_public_output: "Sum of ZEC values of all output transactions.",
    tx_id: "Unique identifier of the transaction.",
    version: "Version number of the transaction format.",

    // Transaction Output-Related Concepts
    transaction_output_output_index: "The index number of this output in the transaction.",
    transaction_output_recipients: "List of recipient addresses for this output.",
    transaction_output_tx_id: "Unique identifier of the transaction this output belongs to.",
    transaction_output_value: "The amount of ZEC being transferred in this output.",

    // Block-Related Concepts
    block_bits: "Compact representation of the target difficulty for this block.",
    block_chainwork: "Total cumulative work in the blockchain up to and including this block.",
    block_confirmations: "Number of subsequent blocks, including the current block, added to the blockchain.",
    block_difficulty: "Measure of how difficult it is to find a hash below the target defined by this block.",
    block_hash: "Unique identifier of the block, derived from its contents.",
    block_height: "Position of the block in the blockchain sequence.",
    block_inputs: "Array of input transactions included in this block.",
    block_merkle_root: "Root hash of the Merkle tree of transactions in this block.",
    block_miner: "Identifier of the miner or mining pool that mined this block.",
    block_nonce: "Value used during mining to find a valid block hash.",
    block_num_inputs: "Total number of input transactions in this block.",
    block_num_outputs: "Total number of output transactions in this block.",
    block_num_transactions: "Total number of transactions included in this block.",
    block_outputs: "Array of output transactions included in this block.",
    block_size: "Total size of the block in bytes.",
    block_timestamp: "Time when the block was mined, in Unix format.",
    block_total_block_input: "Total value of all input transactions in this block.",
    block_total_block_output: "Total value of all output transactions in this block.",
    block_transaction_ids: "Array of transaction identifiers included in this block.",
    block_transactions: "Array of transactions included in this block.",
    block_version: "Version number of the block format."
});

export { TOOLTIP_DESCRIPTIONS }
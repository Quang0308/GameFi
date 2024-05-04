export class cStoreCommand {
  constructor() {
    // add new player and set the initial points to 10zz
    this.AddPlayerVaultCommand = `INSERT INTO tbl_player_vault(wallet_id, created_date, balance)
        VALUES(lower($wallet_id), $created_date, 10) RETURNING *`;

    // get all active player
    this.GetPlayerBalanceCommand =
      'SELECT * FROM tbl_player_vault WHERE wallet_id = lower($wallet_id) AND STATUS = 1';

    // get the top player by their points
    this.GetTopPlayerCommand = `SELECT * FROM tbl_player_match 
        WHERE STATUS = 2
        ORDER BY player_point DESC
        LIMIT $row_count`;

    //  add ticket to player
    this.AddPlayerBalanceCommand = `UPDATE tbl_player_vault SET balance = balance + $amount
        WHERE wallet_id = lower($wallet_id) AND $amount >= 0 RETURNING balance`;

    // deduct player ticket
    this.WithdrawPlayerBalanceCommand = `UPDATE tbl_player_vault SET balance = balance - $amount
        WHERE wallet_id = lower($wallet_id) AND balance >= $amount AND $amount > 0 RETURNING balance;`;

    // insert new mathc info when the player starts a match
    this.StartPlayerMatchCommand = `INSERT INTO tbl_player_match(wallet_id, start_time, status)
        VALUES(lower($wallet_id), $start_time, 1)
        returning id`;

    // update the end_time the player finish a match
    this.EndPlayerMatchCommand = `UPDATE tbl_player_match 
        SET end_time =$end_time, play_data=$play_data, player_point=$player_point, status = 2
        WHERE wallet_id = lower($wallet_id) AND id = $id AND status = 1 returning id`;

    // insert new record to vault_transaction table
    this.AddPlayerBalanceTransactionCommand = `INSERT INTO tbl_vault_transaction (wallet_id, transaction_type, amount, transaction_date,transaction_id)
        VALUES(lower($wallet_id), $transaction_type, $amount, $transaction_date,$transaction_id) returning id`;

    // update the transation hash int ovault_transaction
    this.UpdateTransactionCommand = `UPDATE tbl_vault_transaction SET transaction_id = $transid
        WHERE id =$id returning id`;
  }
}

// ES6 module syntax
export default cStoreCommand;


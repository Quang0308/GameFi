import Web3 from 'web3';
//import floppyAbi from '../contracts/floppy.json';
import floppyAbi from '../contracts/floppy.json' assert { type: 'json' };
import vaultAbi from '../contracts/vault.json' assert { type: 'json' };
//import vaultAbi from '../contracts/vault.json';
import { env } from 'file:///C:/Users/This Pc/OneDrive - VNU-HCMUS/Desktop/FLP-SMC-test/Server/src/configs/enviroment.js';

class SmartContractDAO {
  constructor() {
    // Network test
    this.web3 = new Web3('https://polygon-amoy.g.alchemy.com/v2/MUpeEFamQR5lA_XrfMSK3uaGp0J-3k83');
    this.token_address = env.TOKEN_ADRESS;
    this.vault_address = env.VAULT_ADRESS;
    this.withdrawer_address = env.WITHDRAWER_ADDRESS;
    this.withdrawer_private_key = env.WITHDRAWER_PRIVATE_ADDRESS;
  }

  // retreive the FLP balance of an address
  async getBalance(address) {
    try {
      address = address.toLowerCase();
      const contract = new this.web3.eth.Contract(floppyAbi, this.token_address);
      const bl = await contract.methods.balanceOf(address).call();

      const value = parseInt(bl.toString()) / 10 ** 18;
      return value;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async withdraw(address, amount) {
    //this.web3.eth.accounts.wallet.add(this.withdrawer_private_key);
    this.web3.eth.accounts.wallet.add('0x6df6c92d6da2975554e3c51b02ba684d80d762caef039d5b1c54c3ab9bcd30c8');
    //const vault_contract = new this.web3.eth.Contract(vaultAbi, this.vault_address, {dataInputFill: "data"});
    const vault_contract = new this.web3.eth.Contract(vaultAbi, this.vault_address);
    //sender privatekey
    var value = Web3.utils.toWei(amount.toString());
    console.log(value);
    console.log(address);
    console.log(this.vault_address);
    var rs = await vault_contract.methods.withdraw(value, address).send({
      from: this.withdrawer_address,
      gas: 750000,
      // gasPrice: 1000000000,
      // blockGasLimit: 10000000
      //data: encode,
    });
    console.log("vault_contract done");
    return rs.transactionHash;
  }
}

export default SmartContractDAO;

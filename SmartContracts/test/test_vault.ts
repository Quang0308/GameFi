import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import * as chai from "chai";

import { Vault } from "../typechain-types";
import { Floppy } from "../typechain-types";

chai.use(chaiAsPromised);

function getbyte(strinput: string) {
  var bytes = [];
  for (var i = 0; i < strinput.length; ++i) {
    bytes.push(strinput.charCodeAt(i));
  }
  return bytes;
}

function parseEther(amount: number) {
  return ethers.parseUnits(amount.toString(), 18);
}

describe("Vault Contract", () => {
  var owner: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    carol: SignerWithAddress;

  var vault: Vault;
  var token: Floppy;

  // hàm được chạy trước mỗi testcase
  beforeEach(async () => {
    // Đặt lôi trường, đảm bảo chạy trne6 môi trường blockchain sạch
    await ethers.provider.send("hardhat_reset", []);

    // Get signers - để tương tác với hợp đồng
    [owner, alice, bob, carol] = await ethers.getSigners();

    // Deploy the Vault contract
    const Vault = await ethers.getContractFactory("Vault", owner);
    vault = await Vault.deploy();

    // Deploy the Token contract
    const Token = await ethers.getContractFactory("Floppy", owner);
    token = await Token.deploy();

    // Set the token address in the Vault contract
    await vault.setToken(await token.getAddress());
  });

  // ******************* Happy Path *********************
  it("Should deposit into the Vault", async () => {
    // chuyển token từ tài khoản mặc định to tài khoản của Alice
    // parseEther - chuyển đổi amount to string
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));

    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));

    // Alice deposit to Vault contract
    await vault.connect(alice).deposit(parseEther(500 * 10 ** 3));

    // so sánh số dư
    expect(await token.balanceOf(await vault.getAddress())).equal(
      parseEther(500 * 10 ** 3),
    );
  });

  it("Should withdraw", async () => {
    // grant role for bob
    var WITHDRAWER_ROLE = ethers
      .keccak256(Buffer.from("WITHDRAWER_ROLE"))
      .toString();
    await vault.grantRole(WITHDRAWER_ROLE, bob.address);

    // setter vault function
    await vault.setWithdrawEnable(true);
    await vault.setMaxWithdrawAmount(parseEther(1 * 10 ** 6)); // tiền rút tối đa là 10^6

    // alice deposit into vault
    // chuyển token từ tài khoản mặc định đến tài khoản của Alice
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));
    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));
    // Alice deposit to Vault contract
    await vault.connect(alice).deposit(parseEther(500 * 10 ** 3));

    // bob withdraw into alice address
    await vault.connect(bob).withdraw(parseEther(300 * 10 ** 3), alice.address);

    // Kiểm tra số dư trong vault contract sau khi rút tiền
    expect(await token.balanceOf(vault.getAddress())).equal(
      parseEther(200 * 10 ** 3),
    );
    // Kiểm tra số dư token của Alice sau khi rút tiền
    expect(await token.balanceOf(alice.getAddress())).equal(
      parseEther(800 * 10 ** 3),
    );

    // Rút tiền từ contract Vault bởi Alice sẽ bị revert
    // await expect(
    //   vault.connect(alice).withdraw(parseEther(300 * 10 ** 3), alice.address),
    // ).revertedWith("Caller is not a withdrawer");
  });

  // ******************* UnHappy Path *********************
  it("Should not deposit, Insufficient account balance", async () => {
    // chuyển token từ tài khoản mặc định to tài khoản của Alice
    // parseEther - chuyển đổi amount to string
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));

    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));

    // Alice deposit to Vault contract
    await expect(
      vault.connect(alice).deposit(parseEther(2 * 10 ** 6)),
    ).revertedWith("Insufficient account balance");
  });

  it("Should not withdraw, Withdraw is not available", async () => {
    // grant role for bob
    var WITHDRAWER_ROLE = ethers
      .keccak256(Buffer.from("WITHDRAWER_ROLE"))
      .toString();
    await vault.grantRole(WITHDRAWER_ROLE, bob.address);

    // setter vault function
    await vault.setWithdrawEnable(false);
    await vault.setMaxWithdrawAmount(parseEther(1 * 10 ** 6)); // tiền rút tối đa là 10^6

    // alice deposit into vault
    // chuyển token từ tài khoản mặc định đến tài khoản của Alice
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));
    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));
    // Alice deposit to Vault contract
    await vault.connect(alice).deposit(parseEther(500 * 10 ** 3));

    // Withdraw is not available by bob
    await expect(
      vault.connect(bob).withdraw(parseEther(300 * 10 ** 3), alice.address),
    ).revertedWith("Withdraw is not available");
  });

  it("Should not withdraw, Exceed maximum amount", async () => {
    // grant role for bob
    var WITHDRAWER_ROLE = ethers
      .keccak256(Buffer.from("WITHDRAWER_ROLE"))
      .toString();
    await vault.grantRole(WITHDRAWER_ROLE, bob.address);

    // setter vault function
    await vault.setWithdrawEnable(true);
    await vault.setMaxWithdrawAmount(parseEther(1 * 10 ** 3)); // tiền rút tối đa là 10^6

    // alice deposit into vault
    // chuyển token từ tài khoản mặc định đến tài khoản của Alice
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));
    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));
    // Alice deposit to Vault contract
    await vault.connect(alice).deposit(parseEther(500 * 10 ** 3));

    // Withdraw is not available by bob
    await expect(
      vault.connect(bob).withdraw(parseEther(2 * 10 ** 3), alice.address),
    ).revertedWith("Exceed maximum amount");
  });

  it("Should not withdraw, Caller is not a withdrawer", async () => {
    // grant role for bob
    var WITHDRAWER_ROLE = ethers
      .keccak256(Buffer.from("WITHDRAWER_ROLE"))
      .toString();
    await vault.grantRole(WITHDRAWER_ROLE, bob.address);

    // setter vault function
    await vault.setWithdrawEnable(true);
    await vault.setMaxWithdrawAmount(parseEther(1 * 10 ** 3)); // tiền rút tối đa là 10^6

    // alice deposit into vault
    // chuyển token từ tài khoản mặc định đến tài khoản của Alice
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));
    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));
    // Alice deposit to Vault contract
    await vault.connect(alice).deposit(parseEther(500 * 10 ** 3));

    // Withdraw is not available by bob
    await expect(
      vault.connect(carol).withdraw(parseEther(1 * 10 ** 3), alice.address),
    ).revertedWith("Caller is not a withdrawer");
  });

  it("Should not withdraw, ERC20InsufficientBalance", async () => {
    // grant role for bob
    var WITHDRAWER_ROLE = ethers
      .keccak256(Buffer.from("WITHDRAWER_ROLE"))
      .toString();
    await vault.grantRole(WITHDRAWER_ROLE, bob.address);

    // setter vault function
    await vault.setWithdrawEnable(true);
    await vault.setMaxWithdrawAmount(parseEther(5 * 10 ** 3)); // tiền rút tối đa là 10^6

    // alice deposit into vault
    // chuyển token từ tài khoản mặc định đến tài khoản của Alice
    await token.transfer(alice.address, parseEther(1 * 10 ** 6));
    // Alice duyệt cho Vault contract sử dụng token bằng approve
    await token
      .connect(alice)
      .approve(await vault.getAddress(), await token.balanceOf(alice.address));
    // Alice deposit to Vault contract
    await vault.connect(alice).deposit(parseEther(2 * 10 ** 3));

    // Withdraw is not available by bob

    await expect(
      vault.connect(bob).withdraw(parseEther(3 * 10 ** 3), alice.address),
    ).rejectedWith("ERC20InsufficientBalance");
  });

  // it("Should emergency withdraw", async () => {
  //   // chuyển token từ tài khoản mặc định đến tài khoản của Alice
  //   await token.transfer(alice.address, parseEther(1 * 10 ** 6));
  //   // Alice duyệt cho Vault contract sử dụng token bằng approve
  //   await token
  //     .connect(alice)
  //     .approve(await vault.getAddress(), await token.balanceOf(alice.address));

  //   // await vault.connect(alice).deposit(parseEther(500 * 10 ** 3));
  //   // let ownerblanceBefore = await token.balanceOf(owner.address);

  //   // await vault.emergencyWithdraw();
  //   // expect(await token.balanceOf(vault.address)).equal(parseEther(0));
  //   // let ownerblanceAfter = await token.balanceOf(owner.address);

  //   // expect(ownerblanceAfter.sub(ownerblanceBefore)).equal(
  //   //   parseEther(500 * 10 ** 3),
  //   // );
  // });
});

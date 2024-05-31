import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function MyAllowance() {
  const [myWallet, setEthWallet] = useState(null);
  const [myAccount, setAccount] = useState(null);
  const [atm, setATM] = useState(null);
  const [allowance, setBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // New state variable

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (myWallet) {
      const myAccount = await myWallet.request({ method: "eth_accounts" });
      handleAccount(myAccount);
    }
  };

  const handleAccount = (myAccount) => {
    if (myAccount) {
      console.log("Account connected:", myAccount);
      setAccount(myAccount);
      setErrorMessage(undefined);
    } else {
      console.log("No account found.");
    }
  };

  const connectAccount = async () => {
    if (!myWallet) {
      alert("MetaMask wallet is required to connect. Try again");
      return;
    }

    const myAccount = await myWallet.request({ method: "eth_requestAccounts" });
    handleAccount(myAccount);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(myWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        const newBalance = (await atm.getBalance()).toNumber();
        setBalance(newBalance);
      } catch (error) {
        setErrorMessage("Error fetching balance. Please try again.");
        console.error("Error getting balance:", error);
      }
    }
  };

  const save = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit(100);
        await tx.wait();
        getBalance();
      } catch (error) {
        setErrorMessage("Error during saving amount. Please try again.");
        console.error("Error:", error);
      }
    }
  };

  const spend = async () => {
    if (atm) {
      try {
        const tx = await atm.withdraw(100);
        await tx.wait();
        getBalance();
      } catch (error) {
        setErrorMessage("Error during spending. Please try again.");
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>My Allowance Manager</h1></header>
      {}
      {!myWallet && <p>Please install Metamask in order to check your balance.</p>}
      {!myAccount && myWallet && (
        <button onClick={connectAccount}>Please connect your MetaMask wallet</button>
      )}
      {myAccount && (
        <div class="homepage">
          <h3>Hi User Welcome back!</h3>
          <p>{myAccount}</p>
          <p>Here's your current Allowance: {allowance}</p>
          <button onClick={save}>Save 100</button>
          <button onClick={spend}>Spend 100</button>
        </div>
      )}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
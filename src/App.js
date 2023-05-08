import "./App.css";
import React, { useState } from "react";
import Web3 from "web3";
import token from "../src/contracts/tokenAbi.json";
import stake from "../src/contracts/stakeAbi.json";

var account;

// 3. Contract ABI + Address + contract instance
const contractAddress = "0x60508bA1f66ACDC801Ac09d28Ef5BAf488DDf734";
const tokenAddress = "0xCa4a818256Ad182EE9CAF981140e0e0af34d96Af";

function App() {
  // web3 task
  // Define the states 
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [contractTokenInstance, setcontractTokenInstance] = useState(null);
  const [plan ,setPlan]= useState(null);
  const [amount, setAmount] = useState(0);
  const [count, setCount] = useState(0);
  const [balance, setBalance] = useState(0); 
  const [totalStake, setTotalStake] = useState(null);
  const [totalWithdraw , setTotalwidthdraw] = useState(null);
  const [totalreward , setTotalreward] = useState(null);
// set plan for staking
  const setPlanFun = async(value)=>{
    setPlan(value);
  } 
 
  const connectWallet = async () => {
    if (connected === true) {
      // Alternate: if (connected)
      setWeb3(null);
      setConnected(false);
    

      return;
    }

    // Check if Web3 has been injected by the browser (e.g. MetaMask)
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(async () => {
          setWeb3(web3);
          setConnected(true); // updated
          const accounts = await web3.eth.getAccounts();
          account = accounts[0];
          setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
          console.log("account: ", account);
          setContractInstance(new web3.eth.Contract(stake, contractAddress));
          setcontractTokenInstance(new web3.eth.Contract(token, tokenAddress));
        var  Tokeninstance =new web3.eth.Contract(token, tokenAddress)
        var  stakeinstance =new web3.eth.Contract(stake, contractAddress)
      // set the balance of users 
       Tokeninstance.methods.balanceOf(account).call().then(function(result) {
        const convertToEth = web3.utils.fromWei(result.toString(), 'ether');
        setBalance(convertToEth);
        
      });
      // set the total stake  and widthraw of users 
      stakeinstance.methods.users(account).call().then(function(result) {
        var totalstaked =  result["userTotalStaked"];
        var remainingwidthdraw =  result["remainingStake"];
        var reward =  result["totalRewardTokens"];
        const convertToEth = web3.utils.fromWei(totalstaked.toString(), 'ether');
        setTotalStake(convertToEth);
        setTotalwidthdraw(web3.utils.fromWei(remainingwidthdraw.toString(), 'ether'));
        setTotalreward(web3.utils.fromWei(reward.toString(), 'ether'));
      });
      
    })
    .catch((error) => {
      console.error(error);
    });
       
    }
  };

  const stakefun = async () => {
    if (connected && web3 && contractInstance) {
      const convertToWei = web3.utils.toWei(amount.toString(), 'ether');
      // console.log(convertToWei);
      // console.log(plan);
      let result = await contractTokenInstance.methods.approve(contractAddress, convertToWei).send({from: account}).then(() =>{
        console.log(plan);
        console.log(convertToWei)
        console.log(contractInstance);
      contractInstance.methods.staking(convertToWei,plan).send({
        from: account
      })
      console.log(result);
    })
    }
  };
  const widthdrawfun = async () => {
    if (connected && web3 && contractInstance) {
      console.log(count);
      let result = await contractInstance.methods.withdraw(count).send({
        from: account
      })    
      console.log(result);
    }
  };

  // **************  web page ***************//
  return (
    <div className="App">
      <div className="main">
        {/* ***** Header Start ***** */}
        <header id="header">
          {/* Navbar */}
          <nav
            data-aos="zoom-out"
            data-aos-delay={800}
            className="navbar gameon-navbar navbar-expand"
          >
            <div className="container header">
              {/* Logo */}
              <a className="navbar-brand" href="/">
                <img src="/img/logo/logo.png" alt="Brand Logo" />
              </a>
              <div className="ml-auto" />
              {/* Navbar Nav */}
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="/" className="nav-link active">
                    Home
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="#stake" className="nav-link active">
                    Stake
                  </a>
                </li>
              </ul>
              {/* <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="#referral" className="nav-link active">
                    Referral
                  </a>
                </li>
              </ul> */}
              <ul className="navbar-nav items mx-auto">
                <li className="nav-item active">
                  <a href="#how_to" className="nav-link active">
                    How to
                  </a>
                </li>
              </ul>
              {/* Navbar Icons */}
              {/* Navbar Toggler */}
              <ul className="navbar-nav toggle">
                <li className="nav-item">
                  <a
                    href="#"
                    className="nav-link"
                    data-toggle="modal"
                    data-target="#menu"
                  >
                    <i className="icon-menu m-0" />
                  </a>
                </li>
              </ul>
              {/* Navbar Action Button */}
              <ul className="navbar-nav action">
                <li className="nav-item ml-2">
                  <button
                    type="button"
                    onClick={connectWallet}
                    class="btn ml-lg-auto btn-bordered-white"
                  >
                    <i class="icon-wallet mr-md-2"></i>{connected ? ` ${address}` : 'Connect Wallet'}
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        {/* ***** Header End ***** */}
        {/* ***** Hero Area Start ***** */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-12 col-md-6 col-lg-9 text-center">
                {/* Hero Content */}
                <div className="hero-content">
                  <div className="intro text-center mb-5">
                    <h1 style={{ color: "blue" }}>Alexa Staking</h1>
                    <h3 className="mt-4">Rule The World</h3>
                  </div>
                  {/* Buttons */}
                  <div className="button-group">
                    <a
                      className="btn btn-bordered active smooth-anchor"
                      href=""
                    >
                      <i className="icon-rocket mr-2" />
                      Buy Token
                    </a>
                    <a className="btn btn-bordered-white" href="">
                      <i className="icon-note mr-2" />
                      Contract
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ***** Hero Area End ***** */}
        {/* ***** Staking Area Start ***** */}
        <section className="staking-area" id="stake">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7">
                <div className="card no-hover staking-card single-staking">
                  <h3 className="m-0">
                    Stake Alexa Token
                  </h3>
                  <ul
                    className="nav nav-tabs staking-tabs border-0 my-3 my-md-4"
                    id="myTab"
                    role="tablist"
                  >
                    <li class="nav-item" role="presentation">
                      <button
                        class="tab-link "
                        id="tab-one-tab"
                        onClick={() => setPlanFun('1')}
                        data-toggle="tab"
                        data-target="#tab-one"
                        role="tab"
                        aria-controls="tab-one"
                        aria-selected="true"
                      >
                        5 Days
                      </button>
                    </li>

                    <li class="nav-item" role="presentation">
                      <button
                        class="tab-link "
                        id="tab-one-tab"
                        onClick={() => setPlanFun('2')}
                        data-toggle="tab"
                        data-target="#tab-one"
                        role="tab"
                        aria-controls="tab-one"
                        aria-selected="true"
                      >
                        10 Days
                      </button>
                    </li>

                    <li class="nav-item" role="presentation">
                      <button
                        class="tab-link "
                        id="tab-one-tab"
                        onClick={() => setPlanFun('3')}
                        data-toggle="tab"
                        data-target="#tab-one"
                        role="tab"
                        aria-controls="tab-one"
                        aria-selected="true"
                      >
                        15 Days
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="tab-link "
                        id="tab-one-tab"
                        onClick={() => setPlanFun('4')}
                        data-toggle="tab"
                        data-target="#tab-one"
                        role="tab"
                        aria-controls="tab-one"
                        aria-selected="true"
                      >
                        20 Days
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content mt-md-3" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="tab-one"
                      role="tabpanel"
                      aria-labelledby="tab-one-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> {totalStake} Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> {totalWithdraw} Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> {balance} Alexa
                              </li>
                            </ul>
                          </div>
                          {/* <div className="info-right d-flex flex-column">
                            <span>24%</span>
                            <span>APY*</span>
                          </div> */}
                        </div>

                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} value ={amount} onChange={ (e) => setAmount(e.target.value)}/>
                              <a href="#">Max</a>
                            </div>
                            <button
                              type="button"
                              class="btn input-btn mt-2 mt-md-0 ml-md-3"
                              onClick={stakefun}
                            >
                              Stake
                            </button>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} value={count} onChange={(e)=> setCount(e.target.value)} />
                              <a href="#">Max</a>
                            </div>
                            <button
                              type="button"
                              class="btn input-btn mt-2 mt-md-0 ml-md-3"
                              onClick={widthdrawfun}
                            >
                              Withdraw
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-two"
                      role="tabpanel"
                      aria-labelledby="tab-two-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>48%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-three"
                      role="tabpanel"
                      aria-labelledby="tab-three-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>72%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-four"
                      role="tabpanel"
                      aria-labelledby="tab-four-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>120%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-five"
                      role="tabpanel"
                      aria-labelledby="tab-five-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>144%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-six"
                      role="tabpanel"
                      aria-labelledby="tab-six-tab"
                    >
                      <div className="staking-tab-content">
                        {/* Info Box */}
                        <div className="info-box d-flex justify-content-between">
                          <div className="info-left">
                            <ul className="list-unstyled">
                              <li>
                                <strong>Your Staked Alexa:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Withdraw:</strong> 250 Alexa
                              </li>
                              <li>
                                <strong>Available Balance:</strong> 250 Alexa
                              </li>
                            </ul>
                          </div>
                          <div className="info-right d-flex flex-column">
                            <span>150%</span>
                            <span>APY*</span>
                          </div>
                        </div>
                        <div className="input-box my-4">
                          <div className="input-area d-flex flex-column flex-md-row mb-3">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Approve
                            </a>
                          </div>
                          <div className="input-area d-flex flex-column flex-md-row">
                            <div className="input-text">
                              <input type="text" placeholder={10000} />
                              <a href="#">Max</a>
                            </div>
                            <a
                              href="#"
                              className="btn input-btn mt-2 mt-md-0 ml-md-3"
                            >
                              Withdraw
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="input-box my-4">
              <div className="input-area d-flex flex-column flex-md-row mb-3">
                <div className="input-text">
                  <input type="text" placeholder={0.00} />
                  <a href="#">Max</a>
                </div>
                <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">Approve</a>
              </div>
              <div className="input-area d-flex flex-column flex-md-row">
                <div className="input-text">
                  <input type="text" placeholder={0.00} />
                  <a href="#">Max</a>
                </div>
                <a href="#" className="btn input-btn mt-2 mt-md-0 ml-md-3">Withdraw</a>
              </div>
            </div> */}
            
            
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="staking-items mt-4 mt-md-0">
                  {/* Single Card */}
                  <div className="card no-hover staking-card">
                    <h3 className="m-0">{totalStake} Alexa</h3>
                    <p>Total Staked Alexa</p>
                  </div>
                  {/* Single Card */}
                  <div className="card no-hover staking-card my-2">
                    <h3 className="m-0">{totalreward} Alexa</h3>
                    <p>Total Reward tokens</p>
                  </div>
                  {/* Single Card */}
                  <div className="card no-hover staking-card">
                    <h3 className="m-0">1</h3>
                    <p>Number of Stakers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ***** Staking Area End ***** */}
        {/* ***** Staking Area Start ***** */}
        {/* <section className="staking-area" id="referral">
          <h2 style={{ textAlign: "center" }}>Referral Commision</h2>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-4">
                <div className="card no-hover staking-card">
                  <h3 className="m-0">Level 1 - (3%)</h3>
                  <p>200 Alexa</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card no-hover staking-card">
                  <h3 className="m-0">Level 2 - (2%)</h3>
                  <p>210 Alexa</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card no-hover staking-card">
                  <h3 className="m-0">Level 3 - (1%)</h3>
                  <p>210 Alexa</p>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/* ***** Staking Area End ***** */}
        {/* ***** Content Area Start ***** */}
        <section className="content-area" id="how_to">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-md-6">
                <div className="content intro">
                  <span className="intro-text">staking</span>
                  <h2>How to Stake ?</h2>
                  <p>
                    Staking is a popular way to earn passive income with your
                    crypto investments
                  </p>
                  <ul className="list-unstyled items mt-5">
                    <li className="item">
                      {/* Content List */}
                      <div className="content-list d-flex align-items-center">
                        <div className="content-icon">
                          <span>
                            <i className="fa-brands fa-discord" />
                          </span>
                        </div>
                        <div className="content-body ml-4">
                          <h3 className="m-0">Add Alexa Tokens</h3>
                          <p className="mt-3">
                            You will need Alexa tokens in your wallet to stake.
                            Once you purchase Alexa tokens, make sure that you
                            add the Alexa token to your MetaMask/TrustWallet
                            Wallet so you can view your Alexa balance.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="item">
                      {/* Content List */}
                      <div className="content-list d-flex align-items-center">
                        <div className="content-icon">
                          <span className="featured">
                            <i className="fa-brands fa-hotjar" />
                          </span>
                        </div>
                        <div className="content-body ml-4">
                          <h3 className="m-0">Connect &amp; Verify Wallet</h3>
                          <p className="mt-3">
                            Click the "Connect Wallet" button at the upper right
                            corner of the site and make sure you have the
                            Binance Smart Chain network selected in your
                            MetaMask wallet.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="item">
                      {/* Content List */}
                      <div className="content-list d-flex align-items-center">
                        <div className="content-icon">
                          <span>
                            <i className="fa-solid fa-rocket" />
                          </span>
                        </div>
                        <div className="content-body ml-4">
                          <h3 className="m-0">Stake Alexa</h3>
                          <p className="mt-3">
                            You'll need to click the 'Stake Alexa' and scroll to
                            the top of the page to bring up the staking
                            interface on the site.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6">
                {/* Blockchain Animation */}
                <div className="wrapper-animation d-none d-md-block">
                  <div className="blockchain-wrapper">
                    <div className="pyramid">
                      <div className="square">
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                      </div>
                    </div>
                    <div className="pyramid inverse">
                      <div className="square">
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                        <div className="triangle" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ***** Content Area End ***** */}
        {/* ***** CTA Area Start ***** */}
        <section className="cta-area p-0">
          <div className="container">
            <div className="row">
              <div className="col-12 card">
                <div className="row align-items-center justify-content-center">
                  <div className="col-12 col-md-5 text-center">
                    <img src="/img/content/cta_thumb.png" alt />
                  </div>
                  <div className="col-12 col-md-6 mt-4 mt-md-0">
                    <h2 className="m-0">BUY $Alexa NOW</h2>
                    <br />
                    <p>
                      Still don’t have $Alexa token? Buy it now on PancakeSwap
                      and start staking your tokens
                    </p>
                    <a className="btn btn-bordered active d-inline-block">
                      <i className="icon-rocket mr-2" />
                      Buy on Pancakeswap
                    </a>
                  </div>
                </div>
                <a className="cta-link" />
              </div>
            </div>
          </div>
        </section>
        {/* ***** CTA Area End ***** */}
        {/*====== Footer Area Start ======*/}
        <footer className="footer-area">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 text-center">
                {/* Footer Items */}
                <div className="footer-items">
                  {/* Logo */}
                  <a className="navbar-brand" href="/">
                    <img src="/img/logo/logo.png" alt />
                  </a>
                  <div className="social-share ml-auto">
                    <ul
                      className="d-flex list-unstyled"
                      style={{ justifyContent: "center" }}
                    >
                      <li>
                        <a href="">
                          <i className="fab fa-telegram" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fab fa-telegram" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fas fa-globe" />
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="copyright-area py-4">
                    ©2023 Alexapro, All Rights Reserved By{" "}
                    <a href="#" target="_blank">
                      Alexapro
                    </a>
                  </div>
                </div>
                {/* Scroll To Top */}
                <div id="scroll-to-top" className="scroll-to-top">
                  <a href="#header" className="smooth-anchor">
                    <i className="fa-solid fa-arrow-up" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/*====== Footer Area End ======*/}
        {/*====== Modal Search Area Start ======*/}
        <div id="search" className="modal fade p-0">
          <div className="modal-dialog dialog-animated">
            <div className="modal-content h-100">
              <div className="modal-header" data-dismiss="modal">
                Search <i className="far fa-times-circle icon-close" />
              </div>
              <div className="modal-body">
                <form className="row">
                  <div className="col-12 align-self-center">
                    <div className="row">
                      <div className="col-12 pb-3">
                        <h2 className="search-title mt-0 mb-3">
                          What are you looking for?
                        </h2>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 input-group mt-md-4">
                        <input type="text" placeholder="Enter your keywords" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 input-group align-self-center">
                        <button className="btn btn-bordered-white mt-3">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/*====== Modal Search Area End ======*/}
        {/*====== Modal Responsive Menu Area Start ======*/}
        <div id="menu" className="modal fade p-0">
          <div className="modal-dialog dialog-animated">
            <div className="modal-content h-100">
              <div className="modal-header" data-dismiss="modal">
                Menu <i className="far fa-times-circle icon-close" />
              </div>
              <div className="menu modal-body">
                <div className="row w-100">
                  <div className="items p-0 col-12 text-center" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*====== Modal Responsive Menu Area End ======*/}
      </div>
    </div>
  );
}

export default App;

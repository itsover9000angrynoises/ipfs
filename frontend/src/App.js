'use strict'

import React, { Component } from 'react'
import Web3 from 'web3'
import { ContractABI, ContractAddress, middlewareURL } from './config'
import axios from 'axios'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    console.log(accounts);
    this.setState({ account: accounts[0] })
    const userDetailsContract = new web3.eth.Contract(ContractABI, ContractAddress)
    this.setState({ userDetailsContract })
  }

  async addUser(userDetails) {
    const user = {
      firstName: userDetails.firstName.value,
      lastName: userDetails.lastName.value,
      email: userDetails.email.value,
      city: userDetails.city.value,
      country: userDetails.country.value,
      pincode: userDetails.pincode.value,
    }
    const sendToIPFS = await axios.post(middlewareURL,user,{
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
    await this.state.userDetailsContract.methods.addUserDetails(sendToIPFS.data).send({ from: this.state.account})
  }

  async getUserDetails(id) {
    const retrievedUserHash = await this.state.userDetailsContract.methods.getUserDetails(id).call();
    const queryIpfs = await axios.get(`${middlewareURL}/${retrievedUserHash}`,{
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
    queryIpfs.data.ipfsHash = retrievedUserHash;
    this.setState({retrievedUser:queryIpfs.data});
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      user: {
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        country: "",
        pincode: "",
      },
      retrievedUser :[],
      userDetailsContract: []
    }
  }
  render() {
    const ethereum = window.ethereum._state.isConnected && window.ethereum._state.isUnlocked;
    return (
      <div className="container">
        <h1>USER DETAILS MANAGEMENT</h1>
        {!ethereum && <h1>Unlock metamask and connect manually to this site and refresh</h1>}
        <p>Your account: {this.state.account}</p>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.addUser(this.state.user)
        }}>
          <h5> User Details </h5>
          <input id="userDetails" ref={(input) => this.state.user.firstName = input} type="text" className="form-control" placeholder="User first Name" required /><br />
          <input id="userDetails" ref={(input) => this.state.user.lastName = input} type="text" className="form-control" placeholder="User Last Name" required /><br />
          <input id="userDetails" ref={(input) => this.state.user.email = input} type="text" className="form-control" placeholder="User email" required /><br />
          <input id="userDetails" ref={(input) => this.state.user.city = input} type="text" className="form-control" placeholder="User City" required /><br />
          <input id="userDetails" ref={(input) => this.state.user.country = input} type="text" className="form-control" placeholder="User Country" required /><br />
          <input id="userDetails" ref={(input) => this.state.user.pincode = input} type="text" className="form-control" placeholder="User PinCode" required /><br />
          <input type="submit" />
        </form>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.getUserDetails(this.task.value)
        }}>
          <h5> Retrieve User Details </h5>
          <input id="userDetails" ref={(input) => this.task = input} type="text" className="form-control" placeholder="User Id" required /><br />
          <input type="submit" />
        </form>
        {
          <p>
          IPFSHASH:{this.state.retrievedUser.ipfsHash}<br/>
          FirstName: {this.state.retrievedUser.firstName}<br/>
          Lastname: {this.state.retrievedUser.lastName}<br/>
          Email: {this.state.retrievedUser.email}<br/>
          City: {this.state.retrievedUser.city}<br/>
          Country: {this.state.retrievedUser.country}<br/>
          PinCode: {this.state.retrievedUser.pincode}<br/>
          </p>
        }
      
      </div>
    );
  };
}

export default App;

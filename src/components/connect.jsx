import React,{useEffect, useState,useCallback} from 'react'
import { AccountState } from '../recoil';
import { useRecoilState } from 'recoil'
// import contractAbi from "../../ABI/zkycToken.json"
import Web3 from "web3";
import { useNavigate ,Link} from 'react-router-dom'

import detectEthereumProvider from "@metamask/detect-provider"
import { ethers } from 'ethers'


export default function Connect() {
      
    const navigate = useNavigate();

    const web3 = new Web3(window.ethereum)
    const [account,setAccount]=useRecoilState(AccountState)  
    const [ensName,setENSName] =useState( "")
    const [ensAvater,setENSAvater] =useState("" )
    const [chainId,setChainId]=useState("")




    
    
      const connectWallet=async()=>{
        console.log("connecting")
      try{
 
         const provider = new ethers.providers.Web3Provider(window.ethereum)
          console.log(provider)

          await provider.send("eth_requestAccounts", []);
          
           const newsigner = provider.getSigner()
          
         
         const account= await newsigner.getAddress()
         console.log(account,"iii")
         account?.length >0 && navigate("/account")
         setAccount(account)
       



         }catch(error){
        //    if(error.code === 4001) {
      
        //     } else {
        //       console.error(error);
        //    }
       }
   }


  return (
     <button className='text-slate-700 bg-red-600 rounnded-lg px-6 py-2' onClick={connectWallet}>
        Connect wallet
     </button>
  )
}
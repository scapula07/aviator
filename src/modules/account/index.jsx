import React,{useState,useEffect} from 'react'
import Header from '../../components/header'
import { IoMdEye } from "react-icons/io";
import { BiWallet,BiMoneyWithdraw } from "react-icons/bi";
import Web3 from "web3";
import { useRecoilState,useRecoilValue } from 'recoil'
import { AccountState } from '../../recoil'
import { ethers } from 'ethers'
import abi from "../../abi/bet.json"
import { Link } from 'react-router-dom';
import { useLocation,useParams} from "react-router-dom";


const address="0xeb8a5b71Fa5cA86fB472D111D1aBD2d779933D70"

export default function Account() {

    const account=useRecoilValue(AccountState)
    const [bal,setBal]=useState()

    const web3 = new Web3(window.ethereum)

    const contract = new web3.eth.Contract(
        abi,
        address
      )

     
    useEffect(()=>{
        const getBalance=async()=>{
            try{
                const bal = await contract.methods.getUserBalance(account).call({})
                setBal(bal)
                console.log(bal)

                }catch(e){
                    console.log(e)
                }

            }
            getBalance()
       })

       const deposit=async()=>{
            try{
                const _amount=web3.utils.toWei(bal.toString(),'ether')
                console.log(_amount)
                const txs = await contract.methods.deposit().send({from:account,value:"1000"})
                 console.log(txs,"txxx")

               }catch(e){
                console.log(e)
               }
         
          }

     const Withdraw=async()=>{
            try{
                const _amount=web3.utils.toWei(bal.toString(),'ether')
                console.log(_amount)
                const txs = await contract.methods.deposit().send({from:account,value:"1000"})
                 console.log(txs,"txxx")

               }catch(e){
                console.log(e)
               }
         
          }
  return (
    <div className='w-full h-screen py-4 px-4 text-white' style={{background:"#2c3139"}}>
         <Header 
             account={account}
          
         />

         <div className='flex  w-full space-x-6 py-8' >


                <div className='flex w-full flex-col space-y-3'>
                         <div className='flex items-center w-full justify-start space-x-2'>
                             <IoMdEye
                              className='text-2xl'
                             />
                             <h5>Total balance</h5>
                              
                          </div>
                          <button className='flex items-center text-white bg-green-600 py-3 justify-center space-x-2'
                             onClick={deposit}
                            >
                              <BiWallet />
                              <h5>Deposit</h5>
                              

                         </button>
                       

                   </div>


                   <div className='flex w-full flex-col space-y-3'>
                         <div className='flex items-center w-full justify-end'>
                          
                             <h5>{bal} ETH</h5>
                              
                          </div>
                         <button className='flex items-center text-white bg-green-600 py-3 justify-center space-x-2' >
                              <BiMoneyWithdraw />
                              <h5>Withdraw</h5>
                              

                         </button>
                       

                   </div>

         </div>

            <div className='flex w-full items-center flex-col justify-center py-6'>
                  <Link  to={`/aviator`}
                    state={{
                       bal
                  }}>
                     <h5 className='text-2xl font-extralight text-slate-300 hover:underline'>Click To</h5>
                  </Link>
           
                   <h5 className='text-7xl text-red-600 animate-color-change'>PLAY!!!</h5>

            </div>


    </div>
  )
}

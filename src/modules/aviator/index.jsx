import React,{useEffect,useState} from 'react'
import { MdArrowBackIos } from "react-icons/md";
import { AiFillQuestionCircle } from "react-icons/ai";
import { PiChatsFill } from "react-icons/pi";
import { IoMdJet } from "react-icons/io";
import "./aviator.css"
import { motion } from "framer-motion"
import { Link } from 'react-router-dom';
import { useLocation,useParams} from "react-router-dom";
import abi from "../../abi/bet.json"
import abiQrng from "../../abi/qrn.json"
import Web3 from "web3";
import { useRecoilState,useRecoilValue } from 'recoil'
import { AccountState } from '../../recoil'


const qrng="0x51246c9F480Cc6A46397b2A35684BC3231Acf41F"
const address="0xeb8a5b71Fa5cA86fB472D111D1aBD2d779933D70"


export default function Aviator() {
    const account=useRecoilValue(AccountState)


    const web3 = new Web3(window.ethereum)
    const location =useLocation()

    const bal=location?.state?.bal

    const [values, setValues] = useState({ x: 0, y: 0 });
    const [start,setStart]=useState(false)
    const [counting,setCounting]=useState(false)
    const [count, setCount] = useState(1);
    const [bet,setBet]=useState()
    const [ready,setReady]=useState(false)
    const [odds,setOdds]=useState(0)
    const [end,setEnd]=useState(false)

    const qrngContract = new web3.eth.Contract(
        abiQrng,
        qrng
      )

    useEffect(() => {
      const intervalId = setInterval(() => {
        setValues(prevValues => ({
          x: prevValues.x +20,
          y: prevValues.y - 10,
        }));
        if (values.x >= 30) {
          clearInterval(intervalId);
        }
      }, 1000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, [values]);




    const begin=async()=>{
        console.log("here")
        const txs = await qrngContract.methods.makeRequestUint256().send({from:account})
        console.log(txs,"txxx")

        console.log("here 3")


        setReady(true)
        setCounting(true)
        setInterval(() => {
            setCount(prevCount => (prevCount ) + 1); // Increment the count from 1 to 3 cyclically
            
          }, 2000);
          
          const num = await qrngContract.methods.endpointIdUint256().call({})
          console.log(num,"num")
          const integerValue = parseInt(num, 16);

          console.log(integerValue,"value")

          if(integerValue >0 &&odds < integerValue ){
              setStart(true)

              setInterval(() => {
                setOdds(Count => (Count ) + 1.1); 
                // Increment the count from 1 to 3 cyclically
                // console.log(integerValue < ,"state")
                // if(  integerValue < odds ){
                //     setEnd(true)
                //   }
              }, 500);

          }
      
      
     

    }
  
  return (
    <div className='w-full h-screen py-6 px-2 text-white bg-black' >
                <div className='flex w-full items-center'>
                      <Link to="/account">
                            <MdArrowBackIos 
                                className='text-2xl '
                                />
                      </Link>  
                

                </div>

               <div className='flex w-full items-center py-8 justify-between'>
                            <div className='flex items-center space-x-2'>
                                <h5 className=' font-semibold text-xl text-red-600' >Aviator</h5>
                                <AiFillQuestionCircle 
                                    className='text-2xl text-slate-300'
                                />
                            </div>

                            <div className='flex items-center space-x-2'>
                                <h5 className='text-green-500 font-semibold'>{bal} ETH</h5>
                                {/* <PiChatsFill 
                                    className='text-2xl text-slate-500'
                                /> */}


                            </div>

                </div>


                <div className='w-full bg-black h-80 rounded-lg graph-container relative'>

                    {start?
                       <>
                        {!end?

                        <motion.div animate={{ x: values?.x,y:values?.y}} className="bottom-0 absolute"  >
                            <div className='flex flex-col items-center'>
                                <h5 className='text-lg font-semibold text-red-700'>{odds}x</h5>
                               <IoMdJet 
                                   className='text-6xl text-red-600  '
                                />

                            </div>
                      
                          </motion.div>
                          :
                          <div className='flex items-center justify-center py-8'>
                               <h5 className='text-red-600 text-5xl'>Flew away!</h5>

                          </div>
                        }
                          </>
                         :
                         <>
                              {counting?
                                 
                                 <div className='flex items-center justify-center py-10'>
                                      <h5 className='text-red-600 text-7xl font-semibold'>{count}</h5>

                                 </div>
                                    
                                    :

                           
                                <div className='flex items-center justify-center py-8 flex-col space-y-4'>
                                    <h5 className='text-red-600 text-4xl '>Starting</h5>
                                    <h5 className='text-red-600 text-2xl font-light text-center w-1/2'>Enter your bet </h5>
                                
                                </div>
                               }
                         </>
                      

                    }
               


                

                </div>


                <div className='w-full  flex flex-col  rounded-lg py-4 mt-4' style={{background:"#2c3139"}}>
                         <div className='flex item-center w-full justify-center'>
                               <div className='flex items-center bg-black w-1/2 rounded-full justify-between px-4 py-1'>
                                   <h5 className='hover:bg-slate-600 w-1/2 text-center text-sm'>Bet</h5>
                                   <h5 className='hover:bg-slate-600 w-1/2 text-center text-sm'>Auto</h5>

                               </div>

                         </div>

                         <div className='flex w-full py-4 space-x-6 px-4'>
                              <input
                                  className='bg-black h-10 w-2/5 rounded-sm text-white px-3'
                                  type={"number"}
                                  placeholder={"10"}
                                  value={bet}
                                  onChange={(e)=>setBet(e.target.value)}
                               />
                               {ready?
                                  <button className='flex flex-col bg-red-500 text-white rounded-lg py-4 px-3 w-3/4'
                                        onClick={()=>setReady(false)}
                                              >
                                    
                                        <span>Cancel </span>
        
                                    </button>
                                               :
                                      <button className='flex flex-col bg-green-500 text-white rounded-lg py-4 px-3 w-3/4'
                                           onClick={begin}
                                         >
                                             <span>Bet</span>
           
                                         </button>

                                     }
                     
                             
                         </div>

                 </div>

                <div className='w-full  py-4 mt-8 h-44' style={{background:"#2c3139"}}>
                          <div className='flex item-center w-full justify-center'>
                               <div className='flex items-center bg-black w-1/2 rounded-full justify-between px-4 py-1'>
                                   <h5 className='hover:bg-slate-600 w-1/2 text-center text-sm'>Bet</h5>
                                   <h5 className='hover:bg-slate-600 w-1/2 text-center text-sm'>My bets</h5>
                                   <h5 className='hover:bg-slate-600 w-1/2 text-center text-sm'>Top</h5>

                               </div>

                           </div>

                  </div>


          


    </div>
  )
}

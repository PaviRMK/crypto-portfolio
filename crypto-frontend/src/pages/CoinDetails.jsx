import React,{useEffect,useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { getChartData } from '../services/cryptoApi';
import CryptoChart from '../Components/CryptoChart';
import FilterBar from '../Components/FilterBar';
import "../App.css";
const CoinDetails=()=>
{
    const navigate=useNavigate();
    const {coinId}=useParams();
    const[chartData,setChartData]=useState([]);
     const[days,setDays]=useState(1);
     const[currency,setCurrency]=useState("usd");
     useEffect(()=>{
            const fetchChart=async()=>{
                try{
                    const res=await getChartData(coinId,currency,days);
                    setChartData(res);
                }catch(error)
                {
                    console.error("Error fetching chart:",error);
                }
            };
            fetchChart();
     },[coinId,currency,days]);
 return(
    <div >
        {/* FILTER SECTION */}
      <div className="filter-card">
        <FilterBar
          setCurrency={setCurrency}
          setDays={setDays}
        />
      </div>

     <div className='chart-card'>
         <div className="back-container">
             <button className="back-btn" onClick={() => navigate(-1)}>
                 ← Back
             </button>
         </div>
<CryptoChart chartData={chartData} />

</div>
</div>
 );
};
export default CoinDetails;
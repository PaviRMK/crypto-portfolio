import React,{useEffect,useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { getChartData } from '../services/cryptoApi';
import CryptoChart from '../Components/CryptoChart';
import FilterBar from '../Components/FilterBar';
const CoinDetails=()=>
{
    const navigate=useNavigate();
    const {coinId}=useParams();
    const[chartData,setChartData]=useState([]);
     const[days,setDays]=useState(1);
     const [perPage, setPerPage] = useState(10);
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
          setPerPage={setPerPage}
          setDays={setDays}
        />
      </div>

     <div className='chart-card'>
<CryptoChart chartData={chartData} />
<div>
    <button onClick={()=>navigate("/dashboard")}>Back</button>
</div>
</div>
</div>
 );
};
export default CoinDetails;
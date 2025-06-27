import React, { useState } from 'react'
import { useGeoLocation } from './useGeolocation'
import axios from 'axios'

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24
}

const CommuteCard: React.FC = () => {
    const {location,error} = useGeoLocation(geolocationOptions);
    const [startAddress,setStartAddress] = useState('');
    const [startDate,setStartDate] = useState('');
    const [endAddress,setEndAddress] = useState('');
    const [endDate,setEndDate] = useState('');

    const goToWork = () => {
        commuteGeo(true);
    }

    const leaveWork = () => {
        commuteGeo(false);
    }

    const commuteGeo = (workFlage:boolean) => {
        if(location) {
            //console.log(`https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${location?.longitude},${location?.latitude}&format=xml&type=road&zipcode=true&simple=false&key=${key}`);
            const fetchGeo = async () => {
                const param = {
                    service:'address',
                    request: 'getAddress',
                    version: '2.0',
                    crs: 'epsg:4326',
                    point: `${location?.longitude},${location?.latitude}`,
                    format: 'json',
                    type: 'road',
                    zipcode: 'true',
                    simple: 'false',
                    commuteInfo: workFlage
                }
                try{
                    const response = await axios.get('http://192.168.0.20/myictstudy0521/apiRequest/address', {params:param});
                    if(response){
                        //console.log(response.data.response.result[0].text);
                        console.log(response);
                        console.log(workFlage);
                        if(workFlage) {
                            setStartDate(response.data.date);
                            setStartAddress(response.data.addr);
                        }else{
                            setEndDate(response.data.date);
                            setEndAddress(response.data.addr);
                        }
                    }
                    
                }catch(error){
                    console.log("주소정보 가져오기 실패 : "+error);
                }
                
            }
            fetchGeo();
        }
    }

  return (
    <div>
        <button className='btn btn-secondary' onClick={goToWork}>출근</button>
            <div>{startDate}</div>
            <div>{startAddress}</div>
        <button className='btn btn-secondary' onClick={leaveWork}>퇴근</button>
            <div>{endDate}</div>
            <div>{endAddress}</div>
    </div>
  )
}

export default CommuteCard
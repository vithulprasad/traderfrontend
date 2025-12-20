import api from './intercepter.js'; 


interface Signal {
    startDate:string;
    endDate:string;
    strength:string,
    price:number;
    page:number;
    limit:number;
    direction:string;
}
export const getSignalDetails = async (details:Signal) => {
  const response = await api.get(`/get_signal_details`,{
    params:details
  });
  return response;
};
export const broadcastTradeDetails = async () => {
  const response = await api.get(`/broadcastTradeDetails`);
  return response;
};



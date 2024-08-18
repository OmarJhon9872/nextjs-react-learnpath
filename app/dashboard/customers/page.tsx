// Importacion de metadata para cambio de title dinamicamente
import { Metadata } from 'next'; 
export const metadata: Metadata = {
  title: 'Customers',
};

export default function Page(){
    return (<p>Customers Page</p>)
}
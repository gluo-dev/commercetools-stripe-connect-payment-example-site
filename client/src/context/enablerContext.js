import { createContext, useEffect, useRef, useState } from "react";
import { getCTSessionId, loadEnabler } from "../utils";

export const EnablerContext = createContext({
    enabler : null
});

const procesorUrl = process.env.REACT_APP_PROCESOR_URL;

export const EnablerContextProvider = ({children, cartId}) => {

    const [enabler, setEnabler] = useState(null)
    
    useEffect(() => {
        
        if(!cartId) return;
        
        const asyncCall = async () => {
            try{
                let { Enabler } = await loadEnabler();
                
                let sessionId = await getCTSessionId(cartId);
                
                setEnabler(new Enabler({
                    processorURL : procesorUrl, 
                    returnURL : "/success",
                    sessionId,
                    onActionRequired : () => {},
                    onComplete: () => {},
                    onError : (e) => {
                        console.log({error : e})
                    }
                }))
            } catch (e) {
                console.error(e);
                return null;
            }
        };
        
        asyncCall()
    },[cartId])

    return (
        <EnablerContext.Provider value={
            {
                enabler
            }
        }>
            {children}
        </EnablerContext.Provider>
    )
}
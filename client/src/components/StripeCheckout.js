import React, { useEffect, useState } from "react";
import { useEnabler } from "../hooks/useEnabler";
import LinkAuthentication from "./LinkAuthentication";
import Address from "./Address";
import { getAddressFromPaymentIntent, updateCartShippingAddress } from "../utils";
import { Spinner } from "./Spinner";
import ExpressCheckout from "./ExpressCheckout";

const StripeCheckout = ({cart, paymentSuccess}) => {

    const { elements, enabler, createElement } = useEnabler();

    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("")
    const [paymentElement, setPaymentElement] = useState(null)

    useEffect(() => {
        if(!paymentSuccess) return;
    },[paymentSuccess])

    useEffect(() => {
        if (!enabler) return;

        createElement({
            type: 'payment',
            selector : "#payment",
            onComplete,
            onError,
        }).then(element => {
            if (!element) return
            setPaymentElement(element)
        }).catch(err => {
        });

    },[enabler])

    const onError  = ({type, message}) => {
        setPaymentError(message)
        console.error({type, message})
        setIsLoading(false)
    }

    const onComplete  = async (paymentIntent) => {
        const billingAlias = await getAddressFromPaymentIntent(paymentIntent);
        await updateCartShippingAddress(cart, billingAlias);
        window.location = `${window.location.origin}/success/manual?payment_intent=${paymentIntent}&cart_id=${cart.id}`
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setPaymentError("")
        if ( !paymentElement) {
            return;
        }
        setIsLoading(true)
        try {
            const { error : submitError } = await paymentElement.submit();
            if(!submitError) return;

        }catch(e) {
            setIsLoading(false)
        }
    }


    return (
        <div className="flex flex-col gap-4 w-8/12">
            <ExpressCheckout cart={cart} />
            or
            <form className="flex flex-col gap-4" id="test" onSubmit={onSubmit}>
                <div>
                    <h3>
                        Account
                    </h3>
                    <LinkAuthentication elements={elements}/>

                </div>
                <div>
                    <h3>
                        Address
                    </h3>
                    <Address elements={elements}/>
                </div>
                <div>
                    <h3>
                        Payment
                    </h3>
                    <div id="payment"></div>
                </div>
                <span className="text-[#df1c41]">
                    {paymentError}
                </span>
                <button disabled={isLoading} type="submit" className={`${!isLoading ? "bg-[#635bff]" : "bg-[#9d9dad]"} flex justify-center text-white text-lg font-medium p-3 rounded-md`}>
                    {
                        isLoading ?
                        <Spinner />
                        :
                        "Pay"
                    }
                </button>
            </form>
        </div>
    )
}

export default StripeCheckout;

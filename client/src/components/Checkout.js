import React, { useEffect, useRef, useState } from "react";
import Cart from "./Cart";
import CheckoutHosted from "./CheckoutHosted";
import CheckoutUPE from "./CheckoutUPE";
import Customer from "./Customer";
import { getCTSessionId, loadEnabler } from "../utils";
import { EnablerContext, EnablerContextProvider } from "../context/enablerContext";
import { AddressElement, Elements, LinkAuthenticationElement } from "@stripe/react-stripe-js"

import StripeCheckout from "./StripeCheckout";

const procesorUrl = process.env.REACT_APP_PROCESOR_URL;

export default function Checkout(props) {
  // If you want to only show one way to checkout, turn one of the following 3 variable to default to true
  const [showHosted, setShowHosted] = useState(false);
  const [showUPE, setShowUPE] = useState(false);
  const [custId, setCustId] = useState("");
  const [custInfo, setCustInfo] = useState({ name: "bob", city: "chicago" });

  const enablerRef = useRef()
  const stripe = useRef()
  const stripeElements = useRef()
  const paymentIntentTest = useRef()


  const styles = {
    header: {
      marginBottom: 15,
      marginTop: 25,
    },
    selector: {
      marginBottom: 20,
    },
  };

  const handleChange = (e) => {
    e.preventDefault();
    setShowHosted(e.target.value === "hosted");
    setShowUPE(e.target.value === "upe");
  };

  const paymentHandler = (val) =>{
    console.log('+++++++'+val+'---------')
    paymentIntentTest.current = val
    console.log('+++++++'+paymentIntentTest.current+'---------')
    console.log('+++++++'+val+'---------')

  }

  function getPaymentHandler  () {
    console.log('+++++++'+paymentIntentTest.current+'---------')
    return paymentIntentTest.current;

  }


  useEffect(() => {
    if(!stripe) return;

  },[stripe])

  return (
    <>
    {props.cart && (
      <EnablerContextProvider cartId={props.cart?.id} paymentHandler={paymentHandler}>
        <div className="flex flex-row justify-between gap-5">
          <StripeCheckout cart={props.cart} setCart={props.setCart} getPaymentHandler={getPaymentHandler}/>
          <div className="bg-black w-4/12">
            {props.cart && props.cart.lineItems &&
              <Cart cart={props.cart} currency={props.currency} />
            }
          </div>
        </div>
      </EnablerContextProvider>
    )}
    {
      !props.cart &&
      <p>
        Your cart is empty, add products <a href="/" className="text-[#635bff] underline">here</a>
      </p>
    }
    </>
  );
}

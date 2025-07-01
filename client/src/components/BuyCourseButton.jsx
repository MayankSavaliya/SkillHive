import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, {data, isLoading, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(()=>{
    if(isSuccess){
       if(data?.url){
        window.location.href = data.url; // Redirect to stripe checkout url
       }else{
        showToast.error("❌ Invalid response from server", {
          description: "There was an issue with the payment processor. Please try again.",
          duration: 4000,
          showCancel: true,
          onCancel: () => {
            console.log('User cancelled the error notification');
          }
        });
       }
    } 
    if(isError){
      showToast.error("❌ " + (error?.data?.message || "Failed to create checkout session"), {
        description: "Please check your internet connection and try again.",
        duration: 4000,
        showCancel: true,
        onCancel: () => {
          console.log('User cancelled the checkout error notification');
        }
      });
    }
  },[data, isSuccess, isError, error])

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;

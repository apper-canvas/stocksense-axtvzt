import React, { useEffect } from 'react'
const {ApperClient, ApperUI} = ApperSDK;
const Callback = () => {
    useEffect(() => {
      ApperUI.showSSOVerify("#authentication-callback");
    }, []);

    return (
        <div>
          <div id="authentication-callback"></div>
        </div>
    )
}

export default Callback
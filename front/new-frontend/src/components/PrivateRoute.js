import React from "react";
import { Helmet } from "react-helmet";

const PrivateRoute = ({ children }) => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {children}
    </>
  );
};

export default PrivateRoute;

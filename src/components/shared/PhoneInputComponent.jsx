// <= IMPORTS =>
import axios from "axios";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInputComponent = ({ value, onChange, id, name }) => {
  // COUNTRY CODE STATE MANAGEMENT (DEFAULT TO "US")
  const [country, setCountry] = useState("us");
  // AUTO FETCHING THE COUNTRY CODE BY DETECTING USER'S COUNTRY
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get("https://ipwho.is/");
        // IF RESPONSE SUCCESSFUL
        if (response.data && response.data.country_code) {
          // SETTING COUNTRY CODE
          setCountry(response.data.country_code.toLowerCase());
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountry();
  }, []);
  return (
    <PhoneInput
      country={country}
      value={value}
      onChange={onChange}
      id={id}
      name={name}
      inputStyle={{
        width: "100%",
        paddingLeft: "3rem",
        paddingRight: "3rem",
        paddingTop: "1.3rem",
        paddingBottom: "1.3rem",
        outline: "none",
        borderWidth: "2px",
        borderColor: "#f7fafc",
        borderRadius: "0.375rem",
        color: "#6b7280",
      }}
      containerStyle={{ width: "100%" }}
    />
  );
};

export default PhoneInputComponent;

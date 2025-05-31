// <= IMPORTS =>
import OTPInputLib from "react-otp-input";

export default function OTPInput({ value, onChange, numInputs = 6 }) {
  return (
    <OTPInputLib
      value={value}
      onChange={onChange}
      numInputs={numInputs}
      inputType="tel"
      shouldAutoFocus
      renderInput={(inputProps, idx) => (
        <input
          {...inputProps}
          key={idx}
          className="w-[4rem] h-[4rem] rounded focus:border-color-DB focus:outline-none text-center mx-[0.5rem] text-[2rem] border-2 border-gray-300 text-gray-500"
        />
      )}
      renderSeparator={
        <span className="text-gray-600 text-[3rem] font-[600]">-</span>
      }
      containerStyle="flex justify-center"
    />
  );
}

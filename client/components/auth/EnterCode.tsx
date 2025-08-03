"use client";
import React, { useRef, useState, useEffect } from "react";

export default function EnterCode({
  callback,
  reset,
  isLoading,
}: {
  callback: (code: string) => void;
  reset: boolean;
  isLoading: boolean;
}) {
  const [code, setCode] = useState("");

  // Refs to control each digit input element
  const inputRefs: React.RefObject<HTMLInputElement | null>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset all inputs and clear state
  const resetCode = () => {
    inputRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });
    inputRefs[0]?.current?.focus();
    setCode("");
  };

  // Call our callback when code = 6 chars
  useEffect(() => {
    if (code.length === 6) {
      if (typeof callback === "function") callback(code);
      resetCode();
    }
  }, [code]); //eslint-disable-line

  // Listen for external reset toggle
  useEffect(() => {
    resetCode();
  }, [reset]); //eslint-disable-line

  // Handle input
  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    // Update code state with single digit
    const newCode = [...code];
    // Convert lowercase letters to uppercase
    if (/^[a-z]+$/.test(input.value)) {
      const uc = input.value.toUpperCase();
      newCode[index] = uc;
      if (inputRefs[index]?.current) {
        inputRefs[index].current.value = uc;
      }
    } else {
      newCode[index] = input.value;
    }
    setCode(newCode.join(""));

    input.select();

    if (input.value === "") {
      // If the value is deleted, select previous input, if exists
      if (previousInput) {
        previousInput.current?.focus();
      }
    } else if (nextInput) {
      // Select next input on entry, if exists
      nextInput.current?.select();
    }
  }

  // Select the contents on focus
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  // Handle backspace key
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1];
    // const nextInput = inputRefs[index + 1];

    if ((e.key === "Backspace" || e.key === "Delete") && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1)
      );
      if (previousInput) {
        previousInput.current?.focus();
      }
    }
  }

  // Capture pasted characters
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === 6) {
      setCode(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        if (inputRef.current) {
          inputRef.current.value = pastedCode.charAt(index);
        }
      });
    }
  };

  // Clear button deletes all inputs and selects the first input for entry
  // const ClearButton = () => {
  //   return (
  //     <button
  //       onClick={resetCode}
  //       className="text-2xl absolute right-[-30px] top-3"
  //     ></button>
  //   );
  // };

  return (
    <div className="flex gap-1.5 lg:gap-2 justify-center">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          className="lg:text-2xl text-xl lg:rounded-lg rounded-md p-2 lg:max-w-[50px] lg:min-h-[55px] max-w-[40px] min-h-[41px] text-center text-gray-800 bg-white border-2 border-gray-300 focus-within:border-indigo-300 focus-within:outline-0"
          key={index}
          type="text"
          maxLength={1}
          onChange={(e) => handleInput(e, index)}
          ref={inputRefs[index]}
          autoFocus={index === 0}
          onFocus={handleFocus}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={isLoading}
        />
      ))}
    </div>
  );
}

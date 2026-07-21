"use client";
import { createContext, useContext } from "react";

const LogoContext = createContext(null);

export const LogoProvider = ({ footerData, children }) => {
	return <LogoContext.Provider value={footerData}>{children}</LogoContext.Provider>;
};

export const useLogoData = () => useContext(LogoContext);

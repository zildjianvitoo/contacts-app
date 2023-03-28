import React, { createContext } from "react";

const LocaleContext = createContext();

export const LocalProvider = LocaleContext.Provider;
export const LocaleConsumer = LocaleContext.Consumer;

export default LocaleContext;

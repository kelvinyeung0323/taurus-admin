import React, {ErrorInfo} from 'react';

import './App.css'
import zh_CN from "antd/lib/locale/zh_CN";

import KRouterProvider from "@/route/Router.tsx";
import {ConfigProvider} from "antd";
import AuthContextProvider from "@/store/auth-context.tsx";

import {ErrorBoundary} from "react-error-boundary";
import DictContextProvider from "@/store/dict-context.tsx";


const logError = (error: Error, info: ErrorInfo) => {
    // Do something with the error, e.g. log to an external API
    console.log(error, info)
};

function Fallback({error, resetErrorBoundary}: { error: Error, resetErrorBoundary: (...args: never[]) => void }) {

    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    resetErrorBoundary()
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{color: "red"}}>{error.message}</pre>
        </div>
    );
}

const App: React.FC = () => {


    return (
        <>
            <ConfigProvider locale={zh_CN}>
                <AuthContextProvider>
                    <ErrorBoundary FallbackComponent={Fallback} onError={logError}>
                        <DictContextProvider>
                            <KRouterProvider/>
                        </DictContextProvider>
                    </ErrorBoundary>
                </AuthContextProvider>
            </ConfigProvider>
        </>
    )
};

export default App;
import React, { createContext, useState, ReactNode } from 'react';

interface Device {
    id: number;
    nome: string;
    serial_number: string;
    created_at?: string;
}

interface DeviceContextType {
    selectedDevice: Device | null;
    setSelectedDevice: (device: Device | null) => void;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    return (
        <DeviceContext.Provider value={{ selectedDevice, setSelectedDevice }}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevice() {
    const context = React.useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevice deve ser usado dentro de DeviceProvider');
    }
    return context;
}

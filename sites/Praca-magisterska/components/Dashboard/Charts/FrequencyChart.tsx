'use client'

import { Switch, Text } from "@radix-ui/themes";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type FrequencyData = {
    mag: number;
    freq: number;
}

export interface FrequencyChartProps {
    freqData: FrequencyData[];
    height: number;
    width?: number;
}

export default function FrequencyChart({ freqData, width, height }: FrequencyChartProps) {
    
    const [logScale, setLogScale] = useState<boolean>(false);    

    return (
        <div className={[(width ? `w-[${width}px]` : 'w-full'), `h-[${height}px]`].join(' ')}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                <LineChart data={freqData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="freq"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                        scale={logScale ? "log" : "auto"}
                        domain={["dataMin", "dataMax"]}
                    />
                    <Tooltip />
                    <Line
                        type={"monotone"}
                        dataKey={"mag"}
                        stroke="#8884d8"
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="flex flex-row gap-4">
                <Text>Normal scale</Text>
                <Switch checked={logScale} onClick={() => {setLogScale(!logScale)}} />
                <Text>Log scale</Text>
            </div>
        </div>
    );
}
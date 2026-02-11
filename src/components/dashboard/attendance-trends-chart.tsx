"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', present: 30, absent: 2 },
    { name: 'Tue', present: 32, absent: 1 },
    { name: 'Wed', present: 28, absent: 5 },
    { name: 'Thu', present: 33, absent: 0 },
    { name: 'Fri', present: 31, absent: 2 },
    { name: 'Sat', present: 15, absent: 0 }, // Maybe half day
    { name: 'Sun', present: 0, absent: 0 },
];

export function AttendanceTrendsChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="present" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

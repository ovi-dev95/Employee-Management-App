"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', logins: 40, ideas: 24 },
    { name: 'Tue', logins: 30, ideas: 13 },
    { name: 'Wed', logins: 20, ideas: 98 },
    { name: 'Thu', logins: 27, ideas: 39 },
    { name: 'Fri', logins: 18, ideas: 48 },
    { name: 'Sat', logins: 23, ideas: 38 },
    { name: 'Sun', logins: 34, ideas: 43 },
];

export function ActivityChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="logins" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ideas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

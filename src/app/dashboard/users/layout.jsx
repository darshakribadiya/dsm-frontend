import React from 'react'
import NavTabs from './_components/nav-tabs'

export default function Page({ children }) {
    return (
        <div className='flex flex-col'><NavTabs />
            <div className="">{children}</div>
        </div>
    )
}

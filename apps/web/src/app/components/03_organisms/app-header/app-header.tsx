"use client"
import classNames from 'classnames';
import { XPRNAvatar, XPRNConnectButton, XRPNContainer } from 'xprnkit';
type AppHeaderProps = React.HTMLAttributes<HTMLDivElement> & {}
export const AppHeader: React.FunctionComponent<AppHeaderProps> = ({ className}) => { 
const rootClasses = classNames({
  [`${className}`]: className,
  'grid grid-cols-[1fr,max-content] p-2 item-center': true,
  'sticky top-0 bg-white z-1':true,
});
  return <div className={`${rootClasses}`}>
    <div className='flex items-center'>
    <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-8 h-8"
          >
            <path
              strokeMiterlimit="10"
              className="fill-black stroke-none"
              strokeWidth="7px"
              d="M37.02,87.36v-7.28h-5.9c-9.01,0-16.31-7.3-16.31-16.31v-23.77c0-18.2,14.76-32.96,32.96-32.96h4.48c18.2,0,32.96,14.76,32.96,32.96v23.77c0,9.01-7.3,16.31-16.31,16.31h-4.7v7.28s-.02,1.75-.02,1.75c0,2.13-1.72,3.85-3.85,3.85-1.36,0-2.56-.71-3.24-1.78-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78-2.13,0-3.85-1.72-3.85-3.85v-1.75Z"
            />
            <rect
            className='fill-white'
              x="28.46"
              y="49.5"
              width="16.36"
              height="16.36"
              rx="8.18"
              ry="8.18"
            />
            <rect
            className='fill-white'
              x="55.18"
              y="49.5"
              width="16.36"
              height="16.36"
              rx="8.18"
              ry="8.18"
            />
            <rect
            className='fill-white'
              x="41.82"
              y="29.97"
              width="16.36"
              height="16.36"
              rx="8.18"
              ry="8.18"
            />
          </svg>
    <h1 className='text-2xl font-bold'>MintMe</h1>
    </div>
    <XRPNContainer noSessionState={<XPRNConnectButton className='bg-black p-2  text-white font-bold'>Connect</XPRNConnectButton>}>
      <XPRNAvatar className='bg-gray-400'></XPRNAvatar>
    </XRPNContainer>
    
    
   </div>
}
import React from 'react';

/** Reference: https://developers.facebook.com/docs/facebook-pixel/implementation */
const SCRIPT_CODE = `
 !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
`;

function FacebookPixelScript() {
  const isEnabled = Boolean(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);

  return isEnabled ? (
    <script dangerouslySetInnerHTML={{ __html: SCRIPT_CODE }} />
  ) : null;
}

export default FacebookPixelScript;

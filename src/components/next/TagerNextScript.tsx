import React, { ScriptHTMLAttributes } from 'react';
import { NextScript } from 'next/document';

import { isNotNullish } from '@tager/web-core';

type ScriptProps = ScriptHTMLAttributes<HTMLScriptElement>;
type ScriptElement = React.ReactElement<ScriptProps>;

/**
 * Reference: "Hacking Next.js for better PageSpeed scores"
 * https://medium.com/medwing-engineering-product-design/hacking-next-js-for-better-pagespeed-scores-6c651d19f218
 */
class TagerNextScript extends NextScript {
  /**
   * Reference:
   * https://github.com/vercel/next.js/blob/v9.5.3/packages/next/pages/_document.tsx#L666-L778
   */
  render() {
    /** Can be null only in AMP mode */
    const nextScriptFragment = super.render();

    const allScripts: Array<ScriptElement> = nextScriptFragment
      ? nextScriptFragment.props.children.flat().filter(isNotNullish)
      : [];

    function isChunk(scriptSrc: string | undefined): boolean {
      return scriptSrc ? scriptSrc.includes('chunk') : false;
    }

    const mainScripts = allScripts.filter(
      (script) => !isChunk(script.props.src)
    );

    const chunkedScripts = allScripts.filter((script) =>
      isChunk(script.props.src)
    );

    const jsContent = `
      var chunkedScripts = ${JSON.stringify(chunkedScripts)};
      setTimeout(() => {
        chunkedScripts.map((script) => {
          try {
            var scriptTag = document.createElement('script');
  
            if (script.props.src) {
              scriptTag.src = script.props.src;
            }
            
            scriptTag.async = script.props.async;
            scriptTag.defer = script.props.defer;
            scriptTag.noModule = script.props.noModule;
            scriptTag.crossOrigin = script.props.crossOrigin;
            scriptTag.nonce = script.props.nonce;
            
            if (script.props.id) {
              scriptTag.id = script.props.id;
            }
            
            if (script.props.children) {
              scriptTag.innerHTML = script.props.children;
            }
            
            document.body.appendChild(scriptTag);
          }
          catch(err) {
            console.log(err);
          }
        });
      // 1800ms seems like when PageSpeed Insights stop waiting for more js       
      }, 1800);
    `;

    return (
      <>
        {mainScripts}

        <script
          id="__NEXT_SCRIPT_CUSTOM"
          defer
          dangerouslySetInnerHTML={{ __html: jsContent }}
        />
      </>
    );
  }
}

export default TagerNextScript;

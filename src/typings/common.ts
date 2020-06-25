import React from 'react';
import { css } from 'styled-components';

export type SvgComponentProps<P = {}> = React.SVGProps<SVGSVGElement> & P;

export type SvgComponent<P = {}> = React.FunctionComponent<
  SvgComponentProps<P>
>;

export type CssSnippet = ReturnType<typeof css>;

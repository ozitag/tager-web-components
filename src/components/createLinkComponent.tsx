import React, {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { NextRouter, useRouter } from 'next/router';
import NextLinkComponent, { LinkProps } from 'next/link';

import { isNotNullish, Nullish } from '@tager/web-core';

export type LinkToPropType = Nullish<string | Pick<LinkProps, 'href' | 'as'>>;

function isLinkActive(to: LinkToPropType, router: NextRouter): boolean {
  if (typeof to === 'string') {
    return to === router.pathname;
  } else {
    return to?.as === router.asPath;
  }
}

export type CustomLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'className' | 'onClick'
> & {
  isActive: boolean;
  className: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  ref?: React.Ref<HTMLAnchorElement>;
  disabled?: boolean;
};

type CustomLinkRenderFunction = (props: CustomLinkProps) => React.ReactNode;

export type TagerLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<LinkProps, 'href' | 'as'> & {
    /** allow both static and dynamic routes */
    to: LinkToPropType;
    as?: React.ElementType;
    children?: CustomLinkRenderFunction | React.ReactNode;
    className?: string;
    activeClassName?: string;
    isActive?: boolean | (() => boolean);
    disabled?: boolean;
  };

function isRenderFunction(
  children: TagerLinkProps['children']
): children is CustomLinkRenderFunction {
  return typeof children === 'function';
}

const DefaultLinkComponent = styled.a<CustomLinkProps>`
  cursor: ${(props) =>
    props.isActive || props.disabled ? 'default' : 'pointer'};
`;

export type LinkConverterType = (link: LinkToPropType) => LinkToPropType;

/**
 * Source: https://blog.logrocket.com/dealing-with-links-in-next-js/
 */
export function createLinkComponent(
  options: {
    nextLinkComponent?: React.ComponentType<LinkProps>;
    uiLinkComponent?: React.ElementType<CustomLinkProps>;
    converter?: LinkConverterType;
  } = {}
): ForwardRefExoticComponent<
  PropsWithoutRef<TagerLinkProps> & RefAttributes<HTMLAnchorElement>
> {
  const {
    nextLinkComponent: NextLink = NextLinkComponent,
    uiLinkComponent: DefaultLink = DefaultLinkComponent,
  } = options;

  return React.forwardRef(
    (
      {
        to,
        replace,
        scroll,
        shallow,
        passHref = true,
        prefetch,
        className,
        activeClassName,
        isActive: isActiveProp,
        disabled,
        children,
        ...restLinkProps
      }: TagerLinkProps,
      ref: React.Ref<HTMLAnchorElement>
    ) => {
      /** router is null in Storybook environment */
      const router = useRouter() as ReturnType<typeof useRouter> | null;

      const convertedTo = useMemo(
        () => (options.converter ? options.converter(to) : to),
        [to]
      );

      const isActive = useMemo(() => {
        if (!router) return false;

        if (typeof isActiveProp === 'function') {
          return isActiveProp();
        } else if (typeof isActiveProp === 'boolean') {
          return isActiveProp;
        } else {
          return isLinkActive(convertedTo, router);
        }
      }, [isActiveProp, router, convertedTo]);

      const linkClassName = [isActive ? activeClassName : null, className]
        .filter(Boolean)
        .join(' ');

      function onClick(event: React.MouseEvent) {
        const path =
          typeof convertedTo === 'string' ? convertedTo : convertedTo?.as;

        if (!router || router.asPath === path || disabled) {
          event.preventDefault();
        }
      }

      function renderLink() {
        const linkProps: CustomLinkProps = {
          ...restLinkProps,
          className: linkClassName,
          isActive,
          onClick,
          ref,
          disabled,
        };

        if (isRenderFunction(children)) {
          return children(linkProps);
        } else {
          /** Use can override this component via "as" prop */
          return <DefaultLink {...linkProps}>{children}</DefaultLink>;
        }
      }

      const route =
        isNotNullish(convertedTo) && typeof convertedTo === 'object'
          ? convertedTo
          : { href: convertedTo ?? '' };

      /** otherwise pass both "href" / "as" */
      return (
        <NextLink
          {...route}
          replace={replace}
          scroll={scroll}
          shallow={shallow}
          passHref={disabled ? false : passHref}
          prefetch={prefetch}
        >
          {renderLink()}
        </NextLink>
      );
    }
  );
}

import React, {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useMemo,
} from 'react';
import { NextRouter, useRouter } from 'next/router';
import NextLink, { LinkProps } from 'next/link';

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

export type LinkConverterType = (link: LinkToPropType) => LinkToPropType;

/**
 * Source: https://blog.logrocket.com/dealing-with-links-in-next-js/
 */
export function createLinkComponent(
  options: {
    converter?: LinkConverterType;
  } = {}
): ForwardRefExoticComponent<
  PropsWithoutRef<TagerLinkProps> & RefAttributes<HTMLAnchorElement>
> {
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
        onClick,
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

      function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
        const path =
          typeof convertedTo === 'string' ? convertedTo : convertedTo?.as;

        if (!router || router.asPath === path || disabled) {
          event.preventDefault();
        }

        onClick?.(event);
      }

      const linkProps: CustomLinkProps = {
        ...restLinkProps,
        className: linkClassName,
        isActive,
        onClick: handleLinkClick,
        ref,
        disabled,
      };

      function renderLink() {
        if (isRenderFunction(children)) {
          return children(linkProps);
        } else {
          /** Use can override this component via "as" prop */
          return children;
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
          {...linkProps}
        >
          {renderLink()}
        </NextLink>
      );
    }
  );
}

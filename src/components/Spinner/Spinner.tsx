import React from 'react';
import cx from 'clsx';

import styles from './Spinner.module.pcss';

function assignVars<T extends { [key: string]: string | number }>(
  style: T
): React.CSSProperties & T {
  return style;
}

export interface SpinnerProps {
  show: boolean;
  size?: number;
  thickness?: number;
  color?: string;
}

function Spinner(props: SpinnerProps): JSX.Element {
  console.log('styles', styles);
  const size = props.size ?? 100;
  const thickness = props.thickness ?? 4;
  const color = props.color ?? 'white';
  return (
    <div
      className={cx(styles.spinner, props.show && styles.visible)}
      style={assignVars({
        '--spinner-size': size + 'px',
        '--spinner-color': color,
        '--spinner-thickness': thickness + 'px',
      })}
    >
      <div className={styles.inner}>
        <div className={styles.circle} />
      </div>
    </div>
  );
}

export default Spinner;

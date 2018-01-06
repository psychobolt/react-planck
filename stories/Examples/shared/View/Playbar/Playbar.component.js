// @flow
import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

type Props = {
  paused: boolean,
  togglePause: () => void,
  reset: () => void
}

export default ({ paused, togglePause, reset }: Props) => (
  <div>
    <Button.Group>
      <Button icon onClick={togglePause}>{paused ? <Icon name="play" /> : <Icon name="pause" />}</Button>
      <Button icon onClick={reset}><Icon name="refresh" /></Button>
    </Button.Group>
  </div>
);

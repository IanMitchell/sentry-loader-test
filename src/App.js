import React from 'react';
import SentryBoundary from './Boundary';
import BadComponent from './BadComponent';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <p>This is something that should break</p>

        <SentryBoundary
          team="Ian"
          fallback={() => <p>Oops!</p>}
          tags={{ LOCAL: true, BOUNDARY: 'sentryboundary' }}
        >
          <BadComponent />
        </SentryBoundary>
      </div>
    );
  }
}

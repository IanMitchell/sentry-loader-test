import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/minimal';

export default class SentryBoundary extends React.Component {
  static propTypes = {
    // Team exists outside of "tags" because we use it for error alerts and reporting
    team: PropTypes.string,
    children: PropTypes.node.isRequired,
    fallback: PropTypes.func,
    // eslint-disable-next-line zillow/react/forbid-prop-types
    tags: PropTypes.object,
  };

  static defaultProps = { team: 'name', fallback: null, tags: {} };

  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const { team, tags } = this.props;

    this.setState({
      error,
      info,
    });

    Sentry.withScope(scope => {
      scope.setLevel('error');
      scope.setTag('team', team);

      Object.entries(tags).forEach(([key, value]) => scope.setTag(key, value));

      Object.entries(info).forEach(([key, value]) =>
        scope.setExtra(key, value)
      );

      Sentry.captureException(error);
    });
  }

  render() {
    const { fallback } = this.props;

    if (this.state.hasError) {
      return fallback ? fallback(this.state.error, this.state.info) : null;
    }

    return this.props.children;
  }
}

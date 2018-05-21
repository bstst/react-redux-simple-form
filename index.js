import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import {
  init,
  change,
  touch,
  destroy,
} from './actions';

export const wrapWithForm = (Comp) => {
  class Wrapper extends Component {
    componentWillMount () {
      this.props.dispatch(init(this.props));
    }

    componentWillUnmount () {
      this.props.dispatch(destroy(this.props.form, this.props.name));
    }

    render () {
      const field = {
        ...this.props.field,
        touch: () => this.props.dispatch(touch(this.props.form, this.props.name)),
        change: (value, touched = false) => this.props.dispatch(change(this.props.form, this.props.name, value, touched)),
      };
      return createElement(Comp, { ...this.props, field }, this.props.children);
    }
  }
  return connect((state, props) => {
    const forms = state.form || {};
    const form = forms[props.form] || {};
    const field = form[props.name] || {};
    return {
      field,
    };
  })(Wrapper);
};

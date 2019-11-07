import React, { Component } from 'react';

const modalHigherComponent = (WrappedComponent) =>
  class Modal extends Component {
    render() {
      return <WrappedComponent width={360} {...this.props} />;
    }
  };

export default modalHigherComponent;
